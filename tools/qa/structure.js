// Usage: serve site/ on :8080, then  node tools/qa/structure.js   (needs: npm i -D playwright)
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();
for(const l of ['en','ar']){const p=await b.newPage();await p.goto((process.env.BASE||'http://localhost:8080/')+'?lang='+l);await p.waitForTimeout(2500);
console.log(l,await p.evaluate(()=>{const ids={};document.querySelectorAll('[id]').forEach(e=>ids[e.id]=(ids[e.id]||0)+1);const dup=Object.entries(ids).filter(([k,v])=>v>1);
const broken=[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href')).filter(h=>h.length>1&&!document.getElementById(h.slice(1)));
const h=[...document.querySelectorAll('h1,h2,h3')].map(e=>e.tagName).join('').replace(/H3+/g,'3').replace(/H2/g,'2').replace(/H1/g,'1');
const noalt=[...document.querySelectorAll('img:not([alt])')].length;
return {dup,broken:[...new Set(broken)],headings:h,noalt,h1:document.querySelectorAll('h1').length}}));await p.close();}
await b.close();})();
