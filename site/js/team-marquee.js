// ===== Our team · draggable marquee (after cambium.com: 80px/s there; 40px/s here so faces can be read) =====
(function(){
  var sec=document.querySelector("[data-team]"); if(!sec) return;
  var box=sec.querySelector("[data-team-marquee]"), list=sec.querySelector("[data-team-list]"), btn=sec.querySelector("[data-team-pause]"), lbl=sec.querySelector("[data-team-pause-label]");
  var reduce=matchMedia("(prefers-reduced-motion: reduce)"), T=window.SFGT||String;
  lbl.textContent=T("Pause");
  if(reduce.matches) return;
  var originals=[].slice.call(list.children), SPEED=40, dir, setW=0, x=0, v=0, base=0, raf=0, last=0;
  var visible=false, hovered=false, focused=false, paused=false, drag=null;
  function build(){
    list.querySelectorAll("[data-clone]").forEach(function(c){c.remove();});
    dir=getComputedStyle(box).direction==="rtl"?1:-1;   // English drifts left; Arabic drifts right, as the reading runs
    setW=list.scrollWidth;   // one set: the cards plus the list's inline padding
    var copies=Math.max(1,Math.ceil(box.clientWidth/setW)+1);
    for(var k=0;k<copies;k++) originals.forEach(function(li){var c=li.cloneNode(true); c.setAttribute("data-clone",""); c.setAttribute("aria-hidden","true"); c.inert=true; list.appendChild(c);});
    base=dir*SPEED; v=base;
  }
  function wrap(){ x=((x%setW)+setW)%setW; if(dir<0) x-=setW; }   // keep x inside one set so the loop never shows a seam
  function frame(t){
    raf=0; var dt=Math.min(.05,(t-(last||t))/1000); last=t;
    var target=(paused||hovered||focused)?0:base;
    if(!drag){ v+=(target-v)*Math.min(1,dt*2); x+=v*dt; wrap(); }   // eases back to the drift after a throw, like the reference's 1s return
    list.style.transform="translate3d("+x.toFixed(2)+"px,0,0)";
    if(visible) raf=requestAnimationFrame(frame); else last=0;
  }
  function kick(){ if(!raf&&visible) raf=requestAnimationFrame(frame); }
  new IntersectionObserver(function(e){ visible=e[0].isIntersecting; if(visible) kick(); }).observe(box);
  box.addEventListener("pointerenter",function(e){ if(e.pointerType==="mouse") hovered=true; });
  box.addEventListener("pointerleave",function(){ hovered=false; });
  sec.addEventListener("focusin",function(){ focused=true; }); sec.addEventListener("focusout",function(){ focused=false; });
  btn.addEventListener("click",function(){ paused=!paused; btn.setAttribute("aria-pressed",String(paused)); lbl.textContent=T(paused?"Play":"Pause"); kick(); });
  // drag: the row follows the pointer; on release it keeps the throw's speed and eases back to its drift
  box.addEventListener("pointerdown",function(e){ if(e.button) return; drag={x0:e.clientX,y0:e.clientY,x:x,t:performance.now(),px:e.clientX,v:0,on:false,id:e.pointerId}; });
  box.addEventListener("pointermove",function(e){
    if(!drag||e.pointerId!==drag.id) return;
    var dx=e.clientX-drag.x0;
    if(!drag.on){ if(Math.abs(dx)<6) return; if(Math.abs(e.clientY-drag.y0)>Math.abs(dx)){ drag=null; return; } drag.on=true; box.classList.add("is-drag"); box.setPointerCapture(e.pointerId); }
    var now=performance.now(), dt=Math.max(1,now-drag.t); drag.v=(e.clientX-drag.px)/dt*1000; drag.px=e.clientX; drag.t=now;
    x=drag.x+dx; wrap(); kick();
  });
  function end(){ if(!drag) return; if(drag.on){ v=Math.max(-2000,Math.min(2000,drag.v)); box.classList.remove("is-drag"); } drag=null; kick(); }
  box.addEventListener("pointerup",end); box.addEventListener("pointercancel",end);
  box.addEventListener("click",function(e){ if(box.classList.contains("was-drag")) e.preventDefault(); },true);
  box.addEventListener("dragstart",function(e){ e.preventDefault(); });
  var rz; addEventListener("resize",function(){ clearTimeout(rz); rz=setTimeout(function(){ build(); wrap(); kick(); },200); });
  (document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(function(){ build(); wrap(); kick(); });
})();
