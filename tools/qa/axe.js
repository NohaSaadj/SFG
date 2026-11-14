// Runs axe-core on the page in English and Arabic, at desktop, dark mode and phone size.
// Usage: serve site/ on :8080, then  node tools/qa/axe.js   (needs: npm i -D playwright axe-core)
const {chromium}=require('playwright');const fs=require('fs');
const axe=fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8');
const BASE=process.env.BASE||'http://localhost:8080/';
(async()=>{const b=await chromium.launch();let bad=0;
for(const lang of ['en','ar'])for(const [name,o] of [['desktop',{viewport:{width:1440,height:900}}],['dark',{viewport:{width:1440,height:900},colorScheme:'dark'}],['phone',{viewport:{width:390,height:844},isMobile:true,hasTouch:true}]]){
  const ctx=await b.newContext({...o,bypassCSP:true});const p=await ctx.newPage();
  await p.goto(BASE+'?lang='+lang);await p.waitForTimeout(1200);
  await p.locator('[data-skip-intro]').first().click().catch(()=>{});await p.waitForTimeout(800);
  await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=400){scrollTo(0,y);await new Promise(r=>setTimeout(r,40))}});
  await p.waitForTimeout(2500);   // let the last reveals finish: mid-fade text would read as low contrast
  await p.addScriptTag({content:axe});
  const v=await p.evaluate(async()=>(await axe.run()).violations.map(v=>v.id+' ('+v.nodes.length+')'));
  const hs=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
  console.log(lang,name,v.length?v:'0 violations',hs?'HORIZONTAL SCROLL':'');bad+=v.length+(hs?1:0);await ctx.close();}
await b.close();process.exit(bad?1:0);})();
