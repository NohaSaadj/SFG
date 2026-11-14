// ===== In-page links glide to their section (1–1.6s, the same smooth curve as the text motion) =====
window.SFGScrollTo=(function(){
  var reduce=matchMedia("(prefers-reduced-motion: reduce)"), raf=0;
  function bez(x1,y1,x2,y2){   // cubic-bezier easing, like CSS
    function a(p,q){return 1-3*q+3*p;} function b(p,q){return 3*q-6*p;} function c(p){return 3*p;}
    function at(t,p,q){return((a(p,q)*t+b(p,q))*t+c(p))*t;} function sl(t,p,q){return 3*a(p,q)*t*t+2*b(p,q)*t+c(p);}
    return function(x){ if(x<=0||x>=1) return x; var t=x; for(var i=0;i<8;i++){var d=sl(t,x1,x2); if(!d) break; t-=(at(t,x1,x2)-x)/d;} return at(t,y1,y2); };
  }
  var ease=bez(.38,.005,.215,1);   /* --ease-smooth */
  function stop(){cancelAnimationFrame(raf); raf=0; removeEventListener("wheel",stop); removeEventListener("touchstart",stop);}
  return function(el,done){
    if(!el) return; stop();
    var y0=scrollY, dist=Math.abs(el.getBoundingClientRect().top);
    if(reduce.matches||dist<2){ el.scrollIntoView(); if(done) done(); return; }
    var dur=Math.min(1600,Math.max(1000,700+dist*.12)), t0=performance.now();
    addEventListener("wheel",stop,{passive:true}); addEventListener("touchstart",stop,{passive:true});   // the reader can take over at any time
    (function step(now){
      var k=Math.min(1,(now-t0)/dur), target=el.getBoundingClientRect().top+scrollY;   // re-aimed every frame, so late images can't throw it off
      scrollTo(0,y0+(target-y0)*ease(k));
      if(k<1) raf=requestAnimationFrame(step); else { stop(); if(done) done(); }
    })(t0);
  };
})();
document.addEventListener("click",function(e){
  var a=e.target.closest&&e.target.closest('a[href^="#"]'); if(!a||e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey) return;
  var id=a.getAttribute("href").slice(1), el=id&&document.getElementById(id); if(!el||document.documentElement.classList.contains("is-locked")) return;
  e.preventDefault();
  setTimeout(function(){   // after the menu has closed
    SFGScrollTo(el,function(){ history.replaceState(null,"","#"+id); if(!el.hasAttribute("tabindex")) el.setAttribute("tabindex","-1"); el.focus({preventScroll:true}); });
  },0);
});
