// Test-only, synthetic browser state. No session files or model requests.
await customElements.whenDefined('pi-web-app');
await new Promise(resolve=>setTimeout(resolve,1200));
const app=document.querySelector('pi-web-app');
await app.updateComplete;
const now='2026-11-12T18:00:00.000Z';
const {project}=await (await fetch('/__redesign/context.json')).json();
const response=await fetch(`/api/projects/${encodeURIComponent(project.id)}/workspaces`);
const body=response.ok?await response.json():undefined;
const workspace=(body?.workspaces??body?.resolution?.workspaces??[])[0]??{id:'dual-tone-fixture',projectId:project.id,path:project.path,label:'main',isMain:true,effectiveConfig:{}};
const sessions=['Dual Tone — verifica','Analisi e leggibilità','Verifica layout responsive','Eventi e tool call','Titolo molto lungo per verificare il troncamento senza perdere i controlli','Sessione archiviata'].map((name,i)=>({id:`synthetic-${i}`,cwd:project.path,path:`/synthetic/not-a-session-file-${i}`,name,firstMessage:name,created:now,modified:now,messageCount:[24,153,36,72,30,8][i],archived:i===5}));
const status={sessionId:sessions[0].id,model:{id:'preview-model',name:'Preview · nessuna inferenza',provider:'fixture',reasoning:true,contextWindow:128000,maxTokens:8192},thinkingLevel:'medium',isStreaming:false,isCompacting:false,isBashRunning:false,pendingMessageCount:0,queuedMessages:[],tokens:{input:3200,output:1200,cacheRead:0,cacheWrite:0,total:4400},cost:0,contextUsage:{tokens:4400,contextWindow:128000,percent:3.4}};
const text=(role,text,i)=>({role,entryId:`fixture-${i}`,parts:[{type:'text',text}],meta:{timestamp:now}});
const messages=[
 text('user','## Dual Tone per Pi Web\nMigliorare **leggibilità e gerarchia visiva** distinguendo due famiglie di superfici.\n\n- Progetti e messaggi utente in blu\n- Sessioni e messaggi agente in verde petrolio\n- Eventi compatti e discreti\n\n**OpenSpec resta invariato.**',0),
 text('assistant','## Interfaccia Dual Tone\nDue toni, una sola gerarchia: il blu orienta i progetti e le richieste, il verde petrolio accompagna le sessioni e le risposte.\n\n### Verifiche\n1. Navigazione e selezioni\n2. Scroll, espansione eventi e overflow\n3. Input, focus e layout responsive\n\n```css\n/* Token dedicati, nessuna sostituzione della palette plugin */\n--dt-project-selected: #203D5C;\n--dt-session-selected: #20372F;\n```\n\n[Documentazione](https://pi-web.dev/) · Contenuto sintetico, nessuna conversazione reale.',1),
 {role:'assistant',entryId:'fixture-tool',parts:[{type:'toolExecution',toolCallId:'fixture-read',toolName:'read',summary:'README.md',args:{path:'README.md'},status:'success',resultText:'Verifica dimostrativa completata. Nessun file è stato letto dal tool.'}]},
 {role:'assistant',entryId:'fixture-error',parts:[{type:'toolExecution',toolCallId:'fixture-check',toolName:'bash',summary:'controllo dimostrativo',args:{command:'test-preview-only'},status:'error',resultText:'Esempio di errore: messaggio e stato devono rimanere leggibili.'}]},
 text('assistant','**Pronto per la verifica visiva.** Apri gli eventi per controllare intestazioni, dettagli e stato dei tool.',4),
];
const fetchUpstream=window.fetch.bind(window);
const rawMessages=messages.flatMap(m=>m.parts.flatMap(p=>p.type==='toolExecution' ? [
 {role:'assistant',entryId:m.entryId+'-call',content:[{type:'toolCall',id:p.toolCallId,name:p.toolName,arguments:p.args}],timestamp:Date.parse(now)},
 {role:'toolResult',entryId:m.entryId+'-result',toolCallId:p.toolCallId,toolName:p.toolName,isError:p.status==='error',content:[{type:'text',text:p.resultText}],timestamp:Date.parse(now)}
] : [{role:m.role,entryId:m.entryId,content:[p],timestamp:Date.parse(now)}]));
window.fetch=(input,init)=>{
 const url=new URL(typeof input==='string'?input:input.url,location.href);
 if(url.pathname.endsWith('/sessions')&&(init?.method??'GET')==='GET')return Promise.resolve(new Response(JSON.stringify(sessions),{headers:{'Content-Type':'application/json'}}));
 if(url.pathname.includes('/sessions/synthetic-')) {
  if((init?.method??'GET')!=='GET')return Promise.reject(new Error('Synthetic fixture: writes are disabled'));
  const value=url.pathname.endsWith('/transcript-snapshot')?{seq:0,partial:null,page:{messages:rawMessages,start:0,total:rawMessages.length},status}:url.pathname.endsWith('/thinking-levels')?['off','low','medium','high']:url.pathname.endsWith('/commands')?[]:status;
  return Promise.resolve(new Response(JSON.stringify(value),{headers:{'Content-Type':'application/json'}}));
 }
 return fetchUpstream(input,init);
};
// Mock backend synchronization at the test boundary, not in shipped assets.
// Synthetic sessions have no daemon runtime/socket and must not be resumed.
for(const method of ['refreshSelectedSession','resumeSelectedSession','refreshCurrentWorkspaceSessions','loadSelectedSession'])app.sessions[method]=async()=>{};
app.state={...app.state,conversationSync:undefined,browserErrors:{},error:'',projects:[project,...[{name:'Aurora Lab',path:'/demo/aurora-lab'},{name:'Borea',path:'/demo/borea'},{name:'Cobalto',path:'/demo/cobalto'},{name:'Dune Works',path:'/demo/dune-works'}].map((demo,i)=>({...project,id:`demo-project-${i}`,name:demo.name,path:demo.path}))],selectedProject:project,workspaces:[workspace],selectedWorkspace:workspace,workspaceResolution:{status:'folder',projectId:project.id,workspaces:[workspace],diagnostics:[]},sessions,selectedSession:sessions[0],messages,messagePageStart:0,messagePageEnd:messages.length,messagePageTotal:messages.length,status,sessionStatuses:{[sessions[0].id]:status},availableThinkingLevels:['off','low','medium','high'],mainView:'chat',workspaceTool:'openspec-status:openspec-status'};
await app.updateComplete;
// Override only test-instance callbacks: fixture interaction cannot start inference.
function all(root=document){return [...root.querySelectorAll('*')].flatMap(e=>[e,...(e.shadowRoot?all(e.shadowRoot):[])]);}
function bind(){
 for(const e of all()) {
  if(e.localName==='session-list') e.onSelect=s=>{e.selected=s;};
  if(e.localName==='project-list') e.onSelect=p=>{e.selected=p;};
  if(e.localName==='chat-view')e.historyReady=true;
  if(e.localName==='prompt-editor'){
   e.disabled=false;
   e.onSend=async value=>{window.previewSubmissions.push(value);return true;};
   e.onStop=()=>{window.previewStops++;};
  }
 }
}
window.previewSubmissions=[];window.previewStops=0;bind();
window.redesignFixture={app,bind,all,workspace,sessions,status,messages};
document.title='Pi Web Dual Tone Preview';
document.documentElement.dataset.redesignFixture='ready';
console.log('DUAL_TONE_FIXTURE_READY');

// Deterministic visual scenarios for the screenshot matrix. Test-only.
const frames=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
const scenario=new URLSearchParams(location.search).get('scenario')??'default';
async function applyScenario(){
 await frames();
 if(scenario==='events'||scenario==='tool'){
  const chat=all().find(e=>e.localName==='chat-view');
  const group=chat?.shadowRoot.querySelector('details.event-group');
  if(group){group.open=true;group.dispatchEvent(new Event('toggle'));}
  if(scenario==='tool'){
   const execution=all().find(e=>e.localName==='tool-execution-view');
   const trigger=execution?.shadowRoot.querySelector('summary,button,[aria-expanded="false"]');
   trigger?.click();
  }
  await chat?.updateComplete;await frames();
 }
 if(scenario==='session'){
  const sessions=all().filter(e=>e.localName==='session-list'&&e.getBoundingClientRect().width>0)
   .map(e=>e.shadowRoot.querySelectorAll('.ui-nav-row')).find(rows=>rows.length>1);
  sessions?.[1]?.click();await frames();
 }
 if(scenario==='session2'){
  app.state={...app.state,selectedSession:window.redesignFixture.sessions[1]};
  await app.updateComplete;
  for(const list of all().filter(e=>e.localName==='session-list')){list.selected=window.redesignFixture.sessions[1];await list.updateComplete;}
  await frames();
 }
 if(scenario==='mobile-nav'&&innerWidth<=760){
  app.state={...app.state,mainView:'navigation'};await app.updateComplete;bind();await frames();
 }
 if(scenario==='mobile-nav-projects'&&innerWidth<=760){
  app.state={...app.state,mainView:'navigation'};await app.updateComplete;bind();await frames();
  const projects=all().find(e=>e.localName==='project-list'&&e.getBoundingClientRect().width>0);
  const toggle=projects?.shadowRoot.querySelector('.ui-nav-section-toggle');
  if(toggle&&projects.shadowRoot.querySelector('section')?.dataset.collapsed==='true'){toggle.click();await frames();}
 }
 if(new URLSearchParams(location.search).get('top')==='1'){
  const chat=all().find(e=>e.localName==='chat-view');
  const scroller=chat?.shadowRoot.querySelector('.chat');
  if(scroller)scroller.scrollTop=0;
  await frames();
 }
 document.documentElement.dataset.redesignScenario=scenario;
}
await applyScenario();
