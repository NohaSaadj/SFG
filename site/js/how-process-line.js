// ===== How it works · process line v2.0 (after cambium.com/technology "process-line") =====
// One path through every step's dot: vertical at each dot, an S-curve between the two sides (straight on phones).
// It is drawn with the scroll: it starts when the first dot reaches mid-screen and is complete when the last dot does
// (or, if the page ends before that, when the page can scroll no further).
// Pictures stay fixed on the page margin. The tatreez divider is fitted to whole motifs. Reduced motion: drawn in full.
(function(){
  const sec=document.querySelector("[data-how]"); if(!sec) return;
  const box=sec.querySelector(".how_contain"),svg=sec.querySelector(".how_line");
  const rows=[...sec.querySelectorAll(".how_layout")],dots=rows.map(r=>r.querySelector("[data-process-dot]"));
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches,narrow=matchMedia("(max-width:991px)");
  const NS="http://www.w3.org/2000/svg",ART_H=520;
  let path=null,len=0,y0=0,y1=0;
  // Illustrations are drawn at 520px tall and scaled to their frame, like a picture
  function scaleArt(){sec.querySelectorAll(".how_media").forEach(f=>{const a=f.querySelector(".how_art");if(a)a.style.setProperty("--k",(f.clientHeight/ART_H).toFixed(4));});}
  function rel(el){const t=box.getBoundingClientRect(),r=el.getBoundingClientRect();return{x:r.left-t.left+r.width/2,y:r.top-t.top+r.height/2};}
  function build(){
    svg.textContent="";
    const d=dots.map(rel),b=box.getBoundingClientRect();y0=d[0].y;y1=d[d.length-1].y;const W=Math.ceil(b.width)+200,H=Math.ceil(b.height)+200;
    const holes=[...sec.querySelectorAll(".how_text_bg")].map(el=>{const t=el.getBoundingClientRect();
      return `<rect x="${(t.left-b.left).toFixed(1)}" y="${(t.top-b.top).toFixed(1)}" width="${t.width.toFixed(1)}" height="${t.height.toFixed(1)}" rx="16" fill="#000" filter="url(#howSoft)"/>`;}).join("");
    svg.innerHTML=`<defs><filter id="howSoft" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur stdDeviation="8"/></filter>`+
      `<mask id="howMask" maskUnits="userSpaceOnUse" x="-100" y="-100" width="${W}" height="${H}"><rect x="-100" y="-100" width="${W}" height="${H}" fill="#fff"/>${holes}</mask></defs>`;   // mask luminance, not colours
    let s=`M${d[0].x},${d[0].y}`;                                   // starts at the first dot
    for(let i=0;i<d.length-1;i++){
      const a=d[i],b=d[i+1],k=(b.y-a.y)/2;
      s+=narrow.matches?`L${b.x},${b.y}`:`C${a.x},${a.y+k} ${b.x},${b.y-k} ${b.x},${b.y}`;
    }
    path=document.createElementNS(NS,"path");path.setAttribute("d",s);path.setAttribute("mask","url(#howMask)");svg.append(path);
    len=path.getTotalLength();
    path.style.strokeDasharray=len+" "+len;
  }
  function update(){
    if(!path) return;
    const top=box.getBoundingClientRect().top+scrollY,mid=innerHeight/2,maxY=document.documentElement.scrollHeight-innerHeight;
    const s0=top+y0-mid,s1=Math.min(top+y1-mid,maxY-1);             // scroll positions: first dot at mid-screen → last dot there
    const p=reduce?1:Math.max(0,Math.min(1,(scrollY-s0)/Math.max(1,s1-s0)));
    path.style.strokeDashoffset=(len*(1-p)).toFixed(1);
  }
  function layout(){scaleArt();build();update();}
  addEventListener("scroll",update,{passive:true});addEventListener("resize",layout);narrow.addEventListener("change",layout);
  new MutationObserver(layout).observe(document.documentElement,{attributes:true,attributeFilter:["dir"]});
  if(window.ResizeObserver){let raf=0;new ResizeObserver(()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(layout);}).observe(box);}
  (document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(layout);
  layout();
})();
