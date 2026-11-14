// Usage: serve site/ on :8080, then  node tools/qa/mobile-audit.js   (needs: npm i -D playwright)
// Mobile audit: screenshots of every section + checks (tap targets, tiny text, overflow), EN and AR
const {chromium,devices}=require('playwright');
const W=+(process.argv[2]||360), shots=process.argv[3]!=='noshots';
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader']});
for(const l of ['en','ar']){
const ctx=await b.newContext({viewport:{width:W,height:760},deviceScaleFactor:2,isMobile:true,hasTouch:true});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(l=>{localStorage.setItem('sfg-lang',l)},l);
await p.goto(''+(process.env.BASE||'http://localhost:8080/')+'');await p.waitForTimeout(1500);
await p.locator('[data-skip-intro]').first().click().catch(()=>{});await p.waitForTimeout(1200);
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=300){scrollTo(0,y);await new Promise(r=>setTimeout(r,40))}});
await p.waitForTimeout(800);
const audit=await p.evaluate(()=>{
  const vw=innerWidth,out={small:[],tiny:[],wide:[]};
  const vis=e=>{const r=e.getBoundingClientRect();const cs=getComputedStyle(e);return r.width>0&&r.height>0&&cs.visibility!=='hidden'&&cs.display!=='none'&&!e.closest('[aria-hidden="true"],[inert],dialog:not([open])');};
  document.querySelectorAll('a[href],button,summary,[role=button],input,select').forEach(e=>{if(!vis(e))return;const r=e.getBoundingClientRect();if(r.height<44||r.width<24)out.small.push((e.className||e.tagName)+':'+(e.textContent||e.getAttribute('aria-label')||'').trim().slice(0,30)+' '+Math.round(r.width)+'x'+Math.round(r.height));});
  const tw=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
  while(n=tw.nextNode()){if(!n.textContent.trim())continue;const e=n.parentElement;if(!vis(e)||e.closest('.sr-only,[data-intro],.results_clone'))continue;const fs=parseFloat(getComputedStyle(e).fontSize);if(fs<14)out.tiny.push(e.className+':'+fs+':'+n.textContent.trim().slice(0,25));}
  document.querySelectorAll('body *').forEach(e=>{const r=e.getBoundingClientRect();if(r.width>0&&(r.right>vw+1||r.left<-1)&&!e.closest('.team_marquee,.voices_list,.tl_track,.results_globe,.results_track,.partners_field,svg,[aria-hidden="true"],.intro_viewport,[data-intro]'))out.wide.push(e.className.toString().slice(0,40)+' '+Math.round(r.left)+'..'+Math.round(r.right));});
  out.small=[...new Set(out.small)];out.tiny=[...new Set(out.tiny)].slice(0,40);out.wide=[...new Set(out.wide)].slice(0,30);
  out.hscroll=document.documentElement.scrollWidth>vw;out.height=document.body.scrollHeight;return out;});
console.log('=====',l,W,'errs',errs);console.log(JSON.stringify(audit,null,1));
if(shots){
 let y=0,i=0;const H=await p.evaluate(()=>document.body.scrollHeight);
 while(y<H){await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(700);await p.screenshot({path:require('os').tmpdir()+`/sfg-mob-${l}-${String(i).padStart(2,'0')}.png`});y+=700;i++;}
 console.log('shots',i);
}
await ctx.close();}
await b.close();})();
