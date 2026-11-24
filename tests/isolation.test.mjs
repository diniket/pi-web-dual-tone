import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const asset=name=>readFile(new URL('../assets/'+name,import.meta.url),'utf8');
const css=await asset('dual-tone.css');
const tokens=await asset('tokens.css');
const baseline=await asset('base-pi-web-dark.css');
const manifest=JSON.parse(await readFile(new URL('../package.json',import.meta.url),'utf8'));
const entry=manifest.piWeb.plugins[0];
const theme=entry.themes[0];
const clean=s=>s.replace(/\/\*[\s\S]*?\*\//g,'');
const hosts=new Set(['pi-web-app','app-navigation-panel','app-panel-edge-control','project-list','workspace-list','session-list','chat-view','tool-execution-view','workspace-panel','app-mobile-main-tabs','prompt-editor','status-bar']);

test('real selectable CSS-first theme; no JavaScript module, server or dependencies',()=>{
 assert.equal(manifest.name,'pi-web-dual-tone');assert.equal(manifest.version,'1.0.0');
 assert.equal(entry.id,'dual-tone');assert.equal(entry.defaultEnabled,true);
 assert.equal(entry.module,undefined);assert.equal(entry.serverModule,undefined);
 assert.equal(manifest.dependencies,undefined);assert.equal(manifest.devDependencies,undefined);
 assert.equal(entry.themes.length,1);assert.equal(theme.id,'dual-tone');
 assert.equal(theme.name,'Dual Tone');assert.equal(theme.colorScheme,'dark');
 assert.equal(entry.browserRoot,'assets');assert.equal(entry.themePairs,undefined);
 assert.equal(manifest.publishConfig.access,'public');
 assert.deepEqual(manifest.files,['assets','CHANGELOG.md','LICENSE']);
 assert.equal(manifest.repository.url,'git+https://github.com/diniket/pi-web-dual-tone.git');
 assert.equal(manifest.homepage,'https://github.com/diniket/pi-web-dual-tone#readme');
 assert.equal(manifest.piWebTested.piWebVersion,'1.202611.2');
});

test('official Pi Web Dark plugin baseline is preserved byte-for-byte',()=>{
 assert.equal(createHash('sha256').update(baseline).digest('hex'),'88b39cf2e51b820dacbf1bfdc412c4f2acdb0cf18fcf9d96880e492137ff7692');
 assert.equal([...baseline.matchAll(/--pi-[\w-]+\s*:/g)].length,52);
});

test('every direct redesign selector is restricted to an audited core shadow host',()=>{
 const rules=[...clean(css).matchAll(/([^{}]+)\{/g)].map(m=>m[1].trim()).filter(s=>!s.startsWith('@'));
 assert.ok(rules.length>35);
 for(const rule of rules)for(const s of rule.split(',')){
  const match=s.trim().match(/^:host\(([a-z-]+)\)\s+/);
  assert.ok(match,`Unscoped selector: ${s}`);assert.ok(hosts.has(match[1]),`Unaudited host: ${s}`);
 }
});

test('redesign does not overwrite official plugin variables or font inheritance',()=>{
 assert.doesNotMatch(clean(css+tokens),/--pi-[\w-]+\s*:/);
 assert.doesNotMatch(clean(css),/:host\([^)]*\)\s*\{/);
 assert.doesNotMatch(clean(css),/:root|:host-context|!important|@import/);
 assert.doesNotMatch(clean(tokens),/--(?!dt-)[\w-]+\s*:/);
 assert.doesNotMatch(clean(css),/\.panel-content|\.workspace-label-render|\.session-labels|pi-web-transcript-renderer|openspec/i);
});

test('CSS does not replace interaction, positioning, responsive grids or hidden states',()=>{
 assert.doesNotMatch(clean(css),/\b(display|position|pointer-events|grid-template-columns|grid-template-rows|visibility)\s*:/);
 assert.doesNotMatch(clean(css),/\[(hidden|inert)\]/);
 assert.match(css,/@media \(forced-colors: active\)/);assert.match(css,/:focus-visible/);
});

test('required Dual Tone palette is present verbatim in the token sheet',()=>{
 const required={
  'user-surface':'#172e47','assistant-surface':'#142522',
  'project-surface':'#141e2b','session-surface':'#13221f',
  'project-selected':'#203d5c','session-selected':'#20372f',
 };
 for(const [name,value] of Object.entries(required)){
  const match=tokens.match(new RegExp(`--dt-${name}:\\s*(#[\\da-f]+)`, 'i'));
  assert.ok(match,`missing token --dt-${name}`);
  assert.equal(match[1].toLowerCase(),value);
 }
});

function luminance(hex){const rgb=hex.match(/[\da-f]{2}/gi).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return rgb.reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);}
const palette=Object.fromEntries([...tokens.matchAll(/--dt-([\w-]+):\s*(#[\da-f]+)/gi)].map(m=>[m[1],m[2]]));
const contrast=(a,b)=>{const [lo,hi]=[luminance(a),luminance(b)].sort((a,b)=>a-b);return (hi+.05)/(lo+.05);};
for(const [fg,bg] of [
 ['text','bg'],['text','panel'],['secondary','sidebar'],['secondary','panel'],['secondary','bg'],
 ['accent','bg'],['accent','panel'],['text','hover'],['error','sidebar'],['text','selection'],
 ['bg','accent'],['success','panel'],['error','panel'],
 ['text','user-surface'],['text','assistant-surface'],['text','project-surface'],['text','session-surface'],
 ['text','project-selected'],['text','session-selected'],['text','project-hover'],['text','session-hover'],
 ['secondary','project-surface'],['secondary','session-surface'],['secondary','user-surface'],
 ['secondary','project-selected'],['secondary','session-selected'],
 ['project-meta','project-surface'],['project-meta-selected','project-selected'],
 ['project-heading','project-surface'],['session-heading','session-surface'],
 ['event-label','bg'],['event-label','panel'],
]) test(`text contrast ${fg}/${bg} meets WCAG AA`,()=>assert.ok(contrast(palette[fg],palette[bg])>=4.5));

test('essential boundaries and selection edges meet non-text 3:1 contrast',()=>{
 for(const [fg,bg] of [
  ['control-border','panel'],['control-border','bg'],
  ['user-edge','user-surface'],['assistant-edge','assistant-surface'],
  ['project-edge','project-surface'],['session-edge','session-surface'],
  ['project-edge','project-selected'],['session-edge','session-selected'],
 ]) assert.ok(contrast(palette[fg],palette[bg])>=3,`${fg}/${bg}=${contrast(palette[fg],palette[bg])}`);
});

test('shipped runtime carries no residual Dark Contrast naming or token namespace',async()=>{
 for(const file of ['package.json','assets/tokens.css','assets/dual-tone.css','scripts/build.mjs']){
  const body=await readFile(new URL('../'+file,import.meta.url),'utf8');
  assert.doesNotMatch(body,/dark[ -]contrast|--dc-/i,`${file} still references the previous theme`);
 }
});

test('one atomic, package-local theme sheet, using host revisioned asset URLs',async()=>{
 assert.deepEqual(theme.stylesheets,[{id:'appearance',path:'theme.css',order:2000}]);
 const generated=await asset('theme.css');
 assert.ok(Buffer.byteLength(generated)<2*1024*1024);assert.doesNotMatch(clean(generated),/@import/);
 assert.ok(generated.includes(baseline));assert.ok(generated.includes(tokens));assert.ok(generated.includes(css));
 assert.doesNotMatch(clean(generated),/dark[ -]contrast|--dc-/i);
 const declarations=[...generated.matchAll(/(--pi-[\w-]+)\s*:/g)].map(m=>m[1]);
 assert.equal(declarations.length,52);assert.equal(new Set(declarations).size,52);
 const shipped=await readdir(new URL('../assets/',import.meta.url));
 assert.deepEqual(shipped.sort(),['base-pi-web-dark.css','dual-tone.css','theme.css','tokens.css']);
});
