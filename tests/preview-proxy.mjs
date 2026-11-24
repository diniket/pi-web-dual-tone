// Test-only HTML decoration. The actual installed Pi Web assets/API remain upstream.
import http from 'node:http';
import net from 'node:net';
import { readFile } from 'node:fs/promises';
const upstreamPort=Number(process.env.PI_WEB_PREVIEW_WEB_PORT??8616);
const port=Number(process.env.PI_WEB_PREVIEW_PORT??8617);
const context=process.env.PI_WEB_PREVIEW_CONTEXT??JSON.stringify({project:{id:'dual-tone-fixture',name:'Pi Web Dual Tone Preview',path:'/tmp/dual-tone-showcase',createdAt:'2026-11-12T18:00:00.000Z'}});
// Loopback only by default. A verification host can be added explicitly for a
// short-lived preview; the upstream Host is then rewritten to loopback so the
// isolated instance keeps its own restricted host access policy.
const allowedHosts=new Set(['127.0.0.1','localhost',...(process.env.PI_WEB_PREVIEW_ALLOWED_HOSTS??'').split(',').map(v=>v.trim()).filter(Boolean)]);
const hostOf=req=>(req.headers.host??'').split(':')[0];
const allowedHost=req=>allowedHosts.has(hostOf(req));
const upstreamHeaders=req=>{
  const headers={...req.headers};
  if(hostOf(req)!=='127.0.0.1'&&hostOf(req)!=='localhost')headers.host=`127.0.0.1:${upstreamPort}`;
  return headers;
};
const decorate=html=>html.replace('</body>','<script type="module" src="/__redesign/fixture.js"></script></body>');
const server=http.createServer(async(req,res)=>{
  if(!allowedHost(req)){res.writeHead(403);res.end('Local preview only');return;}
  const requestUrl=new URL(req.url??'/',`http://${req.headers.host??'127.0.0.1'}`);
  if(requestUrl.pathname==='/__redesign/baseline.css'){res.writeHead(200,{'Content-Type':'text/css','Cache-Control':'no-store'});res.end(await readFile(new URL('../assets/base-pi-web-dark.css',import.meta.url)));return;}
  if(requestUrl.pathname==='/__redesign/context.json'){res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(context);return;}
  if(['/__redesign/fixture.js','/__redesign/browser-checks.js','/__redesign/checks-runner.js'].includes(requestUrl.pathname)) {
    res.writeHead(200,{'Content-Type':'text/javascript','Cache-Control':'no-store'});
    res.end(await readFile(new URL('./'+requestUrl.pathname.split('/').at(-1),import.meta.url))); return;
  }
  const upstream=http.request({host:'127.0.0.1',port:upstreamPort,path:req.url,method:req.method,headers:{...upstreamHeaders(req),'accept-encoding':'identity'}},response=>{
    if(response.headers['content-type']?.includes('text/html')) {
      const chunks=[];response.on('data',c=>chunks.push(c));response.on('end',()=>{
        let html=decorate(Buffer.concat(chunks).toString());
        if(requestUrl.searchParams.get('checks')==='1')html=html.replace('</body>','<script type="module" src="/__redesign/checks-runner.js"></script></body>');
        const headers={...response.headers}; delete headers['content-length'];delete headers['content-encoding'];
        res.writeHead(response.statusCode,headers);res.end(html);
      });
    } else {res.writeHead(response.statusCode,response.headers);response.pipe(res);}
  });
  upstream.on('error',()=>{res.writeHead(502);res.end('Preview upstream unavailable');});req.pipe(upstream);
});
server.on('upgrade',(req,socket,head)=>{
  if(!allowedHost(req)){socket.destroy();return;}
  const peer=net.connect(upstreamPort,'127.0.0.1',()=>{
    peer.write(`${req.method} ${req.url} HTTP/${req.httpVersion}\r\n${Object.entries(upstreamHeaders(req)).map(([k,v])=>`${k}: ${v}`).join('\r\n')}\r\n\r\n`);
    if(head.length)peer.write(head);socket.pipe(peer);peer.pipe(socket);
  });
  peer.on('error',()=>socket.destroy());socket.on('error',()=>peer.destroy());socket.on('close',()=>peer.destroy());
});
const sockets=new Set();
server.on('connection',socket=>{sockets.add(socket);socket.on('close',()=>sockets.delete(socket));});
server.listen(port,'127.0.0.1',()=>console.log(`PREVIEW_PROXY_READY :${port}`));
process.on('SIGTERM',()=>{for(const socket of sockets)socket.destroy();server.close(()=>process.exit());});
