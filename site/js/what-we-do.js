// ===== What we do / What we don't do · the second sheet slides up over the first =====
(function(){
  var sec=document.querySelector("[data-wwd]"); if(!sec) return;
  var doS=sec.querySelector("[data-wwd-do]"),dontS=sec.querySelector("[data-wwd-dont]"),dim=doS.querySelector(".wwd_dim");
  var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  function fits(){  // the sheet effect needs each sheet's content to fit the screen
    sec.classList.remove("is-static");
    return [doS,dontS].every(function(el){return el.scrollHeight<=innerHeight+1;});
  }
  var staticMode=false, dontPlayed=false;
  function playDont(){ if(dontPlayed||!window.SFGReveal) return; dontPlayed=true;
    SFGReveal.play([dontS.querySelector(".wwd_title")]);
    [].forEach.call(dontS.querySelectorAll(".wwd_col"),function(c){ SFGReveal.play([].slice.call(c.querySelectorAll("[data-split]"))); });   // each card writes in on its own, as on the first sheet
  }
  function layout(){
    staticMode=reduce||innerWidth<768||!fits();
    sec.classList.toggle("is-static",staticMode);
    if(staticMode){doS.style.transform="";dontS.style.transform="";dim.style.opacity=0;}
    update();
  }
  function update(){
    if(staticMode){
      var r=dontS.getBoundingClientRect(); if(r.top<innerHeight*.7){ dontS.classList.add("is-in"); playDont(); } return;
    }
    var r=sec.getBoundingClientRect(),range=sec.offsetHeight-innerHeight;
    var p=Math.min(1,Math.max(0,-r.top/range));
    var k=Math.min(1,Math.max(0,(p-.25)/.55)); k=1-Math.pow(1-k,3);           // hold "What we do", then slide
    dontS.style.transform="translate3d(0,"+((1-k)*100).toFixed(2)+"%,0)";
    doS.style.transform="scale("+(1-.04*k).toFixed(4)+")";
    dim.style.opacity=(.45*k).toFixed(3);
    dontS.classList.toggle("is-in",k>.92); if(k>.92) playDont();
  }
  addEventListener("scroll",update,{passive:true}); addEventListener("resize",layout);
  (document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(layout);
  layout();
})();
