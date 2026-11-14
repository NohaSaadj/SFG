// ===== Results · after iventions.com "produced": looped university list + WebGL dotted globe · v2.0 =====
// Same mechanics as the reference (read from its source): the list is an endless vertical loop that drifts up 0.3px a frame,
// the globe auto-rotates (camera tilt locked at π/2.8), tilts towards the pointer and can be dragged; hovering a marker
// pauses the spin. Nothing is highlighted while the list drifts: clicking a country highlights its universities and
// brings the first one to the centre; clicking it again clears the highlight.
// v4: an intro with three result cards. On desktop the globe starts large at the bottom centre of the intro and, as you
// scroll, travels down through a gap into its slot, shrinking and turning (after cambium.com's iPad; scrubbed, so it reverses).
(function(){
  "use strict";
  var root=document.querySelector("[data-results]"); if(!root||root.dataset.resultsReady||!window.DotGlobe)return; root.dataset.resultsReady="1";
  var COUNTRIES={
    uk:{name:"United Kingdom",lat:54.0,lng:-2.5},
    ie:{name:"Ireland",lat:53.3,lng:-7.8,start:true},
    fr:{name:"France",lat:46.6,lng:2.4,start:true},
    it:{name:"Italy",lat:42.8,lng:12.5},
    nl:{name:"Netherlands",lat:52.2,lng:5.3},
    be:{name:"Belgium",lat:50.6,lng:4.6,start:true},
    eg:{name:"Egypt",lat:26.8,lng:30.8},
    sg:{name:"Singapore",lat:1.35,lng:103.8},
    us:{name:"USA",lat:39.8,lng:-98.6},
    hu:{name:"Hungary",lat:47.2,lng:19.5},
    pl:{name:"Poland",lat:52.0,lng:19.1},
    tr:{name:"Turkey",lat:39.0,lng:35.2},
    qa:{name:"Qatar",lat:25.3,lng:51.2},
    my:{name:"Malaysia",lat:4.2,lng:101.9}
  };
  var keys=Object.keys(COUNTRIES), reduce=matchMedia("(prefers-reduced-motion: reduce)"), wide=matchMedia("(min-width:992px)");
  var stage=root.querySelector("[data-results-stage]"), intro=root.querySelector("[data-results-intro]"), slot=root.querySelector("[data-results-slot]");
  var gEl=root.querySelector("[data-results-globe]"), fades=[].slice.call(root.querySelectorAll("[data-results-fade]"));
  var wrapEl=root.querySelector(".results_list-wrap"), track=root.querySelector("[data-results-track]"), list=root.querySelector("[data-results-list]");
  // phones: the list shows ten names until "Show all universities" is pressed
  var more=root.querySelector("[data-results-more]"), moreLbl=root.querySelector("[data-results-more-label]"), T0=window.SFGT||String;
  if(more){ moreLbl.textContent=T0("Show all universities");
    more.addEventListener("click",function(){ var all=list.classList.toggle("is-all"); more.setAttribute("aria-expanded",String(all)); moreLbl.textContent=T0(all?"Show fewer":"Show all universities"); }); }
  var items=[].slice.call(list.children), N=items.length, layer=root.querySelector("[data-results-markers]");

  // two hidden copies around the real list make the loop seamless
  var clones=[0,1].map(function(){var c=list.cloneNode(true); c.removeAttribute("data-results-list"); c.setAttribute("aria-hidden","true"); c.classList.add("results_clone"); return c;});
  var all=[], loop=false;
  function setLoop(on){
    loop=on;
    if(on&&!clones[0].parentNode){track.insertBefore(clones[0],list); track.appendChild(clones[1]);}
    if(!on&&clones[0].parentNode){clones.forEach(function(c){c.remove();}); track.style.transform="";}
    all=on?[].slice.call(clones[0].children).concat(items,[].slice.call(clones[1].children)):items.slice();
  }

  var has={}; items.forEach(function(li){has[li.dataset.country]=true;});
  var markers=keys.map(function(k){
    var c=COUNTRIES[k], anchor=document.createElement("div"), fade=document.createElement("div"), m=document.createElement(has[k]?"button":"span");
    anchor.className="results_anchor"; fade.className="results_fade";
    if(has[k])anchor.style.zIndex=2;   // clickable countries stay above the plain markers crowded around them
    m.className="results_marker"+(c.start?" is-start":""); m.innerHTML='<span class="results_core"></span><span class="results_label body2"></span>'; m.lastChild.textContent=(window.SFGT||String)(c.name);
    if(has[k]){m.type="button"; m.tabIndex=-1; m.addEventListener("click",function(){goTo(k);});}   // the list itself is the accessible content
    m.addEventListener("mouseenter",function(){if(globe)globe.state.autoRotate=false;});
    m.addEventListener("mouseleave",function(){if(globe)globe.state.autoRotate=!reduce.matches;});
    fade.appendChild(m); anchor.appendChild(fade); layer.appendChild(anchor);
    return {k:k,anchor:anchor,fade:fade,el:m,core:m.firstChild};
  });

  var css=getComputedStyle(root), globe=window.DotGlobe(root.querySelector(".results_canvas"),{
    maskSrc:"assets/data/land-mask.png", color:css.getPropertyValue("--results-dot").trim()||"#F7F2E9", alpha:.9, maxDpr:1.5,
    start:{lat:30,lng:-4}, drag:wide.matches, parallax:wide.matches&&!reduce.matches,
    markers:keys.map(function(k){return {lat:COUNTRIES[k].lat,lng:COUNTRIES[k].lng};}),
    onFrame:function(ms){ms.forEach(function(p,i){var mk=markers[i];
      mk.anchor.style.transform="translate3d("+p.x.toFixed(1)+"px,"+p.y.toFixed(1)+"px,0) scale("+(p.scale/1.33/gs).toFixed(3)+")";
      mk.fade.style.opacity=p.front?1:0; mk.fade.style.transform="scale("+(p.front?1:.25)+")"; mk.el.style.pointerEvents=p.front?"":"none";});}
  });
  if(globe)globe.state.autoRotate=!reduce.matches;
  function recolor(){if(globe)globe.setColor(getComputedStyle(root).getPropertyValue("--results-dot"));}

  var setH=0, offset=0, picked=null, tween=null, resumeAt=0, lastT=0, on=false;
  // ---- scroll transition (desktop with motion only): the globe travels from the intro down to its slot ----
  var pin=false, gs=1, S0=0, sEnd=1, start=[0,0], end=[0,0], y0=0, y1=1;
  function clamp(x){return x<0?0:x>1?1:x;}
  function ease(x){return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;}   // easeInOutCubic
  function lerp(a,b,t){return a+(b-a)*t;}
  function measureStage(){
    pin=wide.matches&&!reduce.matches;
    root.classList.remove("is-pinned"); root.classList.toggle("is-travel",pin);
    gEl.style.transform=""; fades.forEach(function(el){el.style.opacity=el.style.transform=el.style.pointerEvents="";});
    if(!pin){gs=1; gEl.style.removeProperty("--g-size"); layer.style.opacity=layer.style.visibility=""; if(globe){globe.state.pointScale=1; globe.state.offTheta=0; globe.resize();} return;}
    var vw=root.clientWidth, vh=innerHeight, rr=root.getBoundingClientRect(), sr=slot.getBoundingClientRect(), cr=root.querySelector(".results_contain").getBoundingClientRect();
    S0=Math.round(Math.min(vw*1.23,2200));                      // the sphere fills ~85% of its box: ~1.05 × the viewport wide
    gEl.style.setProperty("--g-size",S0+"px");
    end=[sr.left-rr.left+sr.width/2, sr.top-rr.top+sr.height/2]; // positions inside the section, independent of scroll
    var sb=root.querySelector(".results_stats").getBoundingClientRect().bottom-rr.top;
    start=[vw/2, Math.max(vh*.7,sb+48)+S0*.855/2];               // sphere top below the stats, never over their captions
    sEnd=sr.width/S0;
    y0=rr.top+scrollY; y1=cr.top+scrollY;                       // from "intro at the top of the screen" to "list layout at the top"
    if(globe)globe.resize();
    stageUpdate();
  }
  function stageUpdate(){
    if(!pin)return;
    var p=clamp((scrollY-y0)/(y1-y0)), t=ease(p);
    gs=lerp(1,sEnd,t);
    gEl.style.transform="translate(-50%,-50%) translate("+lerp(start[0]-end[0],0,t).toFixed(1)+"px,"+lerp(start[1]-end[1],0,t).toFixed(1)+"px) rotate("+lerp(-18,0,t).toFixed(2)+"deg) scale("+gs.toFixed(4)+")";
    if(globe){globe.state.pointScale=1/gs; globe.state.offTheta=lerp(-1.1,0,t);}   // dots keep their on-screen size; it spins into place
    layer.style.opacity=p>.97?1:0; layer.style.visibility=p>.97?"":"hidden";   // markers only once the globe has landed
    var b=clamp((p-.55)/.4);                                     // list and heading settle in as the globe arrives
    fades.forEach(function(el){el.style.opacity=b; el.style.transform="translateY("+(32*(1-b)).toFixed(1)+"px)"; el.style.pointerEvents=b<.5?"none":"";});
  }
  addEventListener("scroll",stageUpdate,{passive:true});

  // ---- number roll on the result numbers (after cambium.com/impact): each digit rolls up from 0 on a strip of 0–9 ×2,
  //      rightmost digit first (40ms apart), figures 100ms apart left to right, 2.5s ease-out-cubic ----
  (function(){
    var grp=root.querySelector("[data-odometer-group]"); if(!grp||reduce.matches) return;
    var figs=[].slice.call(grp.querySelectorAll("[data-odometer]"));
    figs.forEach(function(f,fi){
      var txt=f.textContent.trim();
      var chars=txt.split(""), digits=chars.filter(function(c){return /\d/.test(c);}).length, k=0;
      f.innerHTML='<span class="sr-only">'+txt+'</span><span class="odo" aria-hidden="true">'+chars.map(function(c){
        if(!/\d/.test(c)) return '<span>'+c+'</span>';
        var d=+c, pos=d>0?d:10, strip=""; for(var v=0;v<20;v++) strip+="<span>"+(v%10)+"</span>";
        var delay=fi*.1+(digits-1-k)*.04; k++;
        return '<span class="odo_mask"><span class="odo_roll" data-pos="'+pos+'" style="--od:'+delay.toFixed(2)+'s">'+strip+'</span></span>';
      }).join("")+'</span>';
    });
    new IntersectionObserver(function(e,o){
      if(!e[0].isIntersecting) return; o.disconnect();
      grp.querySelectorAll(".odo_roll").forEach(function(r){r.style.transform="translateY(calc(-"+r.dataset.pos+" * var(--odo-h)))";});
    },{rootMargin:"0px 0px -20% 0px"}).observe(grp);   // starts when the row's top reaches 80% of the screen
  })();

  function measure(){
    measureStage();
    setLoop(wide.matches&&!reduce.matches);
    paint(); if(!loop)return;
    setH=0; for(var i=0;i<N;i++)setH+=items[i].offsetHeight;
    offset=setH+items[0].offsetHeight/2-wrapEl.clientHeight/2;   // start on the real list's first university, centred
  }
  function wrap(y){return((y-setH*.5)%setH+setH)%setH+setH*.5;}
  function nearest(){
    var mid=offset+wrapEl.clientHeight/2, best=0, bd=1e9, y=0;
    for(var k=0;k<all.length;k++){var h=all[k].offsetHeight, d=Math.abs(y+h/2-mid); if(d<bd){bd=d;best=k;} y+=h;}
    return best;
  }
  function paint(){
    all.forEach(function(li){li.classList.toggle("is-active",li.dataset.country===picked);});
    markers.forEach(function(m){var a=m.k===picked; m.el.classList.toggle("is-active",a); m.core.classList.toggle("is-active",a); if(m.el.tagName==="BUTTON")m.el.setAttribute("aria-pressed",a);});
  }
  function goTo(k){
    var idx=items.findIndex(function(li){return li.dataset.country===k;}); if(idx<0)return;
    picked=picked===k?null:k; paint(); if(!picked)return;
    if(!loop){var li=items[idx]; scrollTo({top:li.getBoundingClientRect().top+scrollY-innerHeight/2+li.offsetHeight/2,behavior:reduce.matches?"auto":"smooth"}); return;}
    var cur=nearest(), to=idx; [idx,idx+N,idx+2*N].forEach(function(c){if(Math.abs(c-cur)<Math.abs(to-cur))to=c;});
    var y=0; for(var j=0;j<to;j++)y+=all[j].offsetHeight;
    tween={from:offset,to:y+all[to].offsetHeight/2-wrapEl.clientHeight/2,t0:performance.now(),dur:900}; resumeAt=Infinity;
  }
  function tick(t){
    var dt=lastT?Math.min(t-lastT,100):16.7; lastT=t;
    if(loop){
      if(tween){var p=Math.min(1,(t-tween.t0)/tween.dur); offset=tween.from+(tween.to-tween.from)*(1-Math.pow(1-p,4)); if(p===1){tween=null; resumeAt=t+1000;}}
      else if(t>=resumeAt)offset+=.3*dt/(1000/60);
      if(!tween)offset=wrap(offset);
      track.style.transform="translate3d(0,"+(-offset).toFixed(2)+"px,0)";
    }
    stageUpdate();
    if(on)requestAnimationFrame(tick); else lastT=0;
  }
  // only animate while the section is on screen
  new IntersectionObserver(function(e){var vis=e[0].isIntersecting; if(globe)globe.running=vis; if(vis&&!on){on=true;requestAnimationFrame(tick);} on=vis;}).observe(root);
  addEventListener("resize",function(){var f=loop?(offset-setH*.5)/setH:0; measure(); if(loop)offset=wrap(setH*.5+f*setH);});
  wide.addEventListener("change",measure);
  reduce.addEventListener("change",function(){measure(); if(globe)globe.state.autoRotate=!reduce.matches;});
  new MutationObserver(recolor).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]});
  new MutationObserver(recolor).observe(root,{attributes:true,attributeFilter:["data-palette"]});
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change",recolor);
  (document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(measure);
  measure();
})();
