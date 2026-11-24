// Test-only: run the static checks inside the preview and expose the result in
// the DOM so a headless browser can read it with --dump-dom.
const started=Date.now();
const start=async()=>{
 if(!window.redesignFixture){
  if(Date.now()-started>30000){document.documentElement.dataset.dualToneChecks=JSON.stringify({error:'fixture timeout'});return;}
  setTimeout(start,100);return;
 }
 try{
  const {runChecks}=await import('/__redesign/browser-checks.js');
  const result=await runChecks();
  document.documentElement.dataset.dualToneChecks=JSON.stringify(result);
  const pre=document.createElement('pre');
  pre.id='dual-tone-checks';
  pre.textContent=JSON.stringify(result,null,1);
  document.body.append(pre);
 }catch(error){
  document.documentElement.dataset.dualToneChecks=JSON.stringify({error:String(error?.stack??error)});
 }
};
start();
