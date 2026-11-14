// ===== Reveals · after cambium.com (split-text lines, media uncover, fade-up) =====
window.SFGReveal=(function(){
  var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  var STAGGER=0.08, DUR=1100;                     // seconds between lines, ms per line
  var esc=function(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;");};
  // Split a plain-text element into masked lines; returns how many lines it made
  function split(el,start){
    if(el._orig==null){el._orig=el.textContent.trim(); el._html=el.innerHTML;}   // keep inner markup (names kept whole, links) to restore after
    if(el.getAttribute("data-split")==="whole"){   // markup that must stay intact (e.g. the pen mark): one masked block
      el.innerHTML='<span class="st-line"><span class="st-in" style="--d:'+(start*STAGGER).toFixed(2)+'s">'+el._html+'</span></span>';
      el.setAttribute("aria-label",el._orig); el.classList.add("is-split"); return 1;
    }
    var words=wordsOf(el._html);
    el.innerHTML=words.map(function(w,i){return '<span class="st-w" data-i="'+i+'">'+w+'</span>';}).join(" ");
    var lines=[],top=null;
    [].forEach.call(el.querySelectorAll(".st-w"),function(w){
      var t=w.offsetTop; if(top===null||Math.abs(t-top)>4){lines.push([]);top=t;} lines[lines.length-1].push(words[+w.getAttribute("data-i")]);
    });
    el.innerHTML=lines.map(function(l,i){
      return '<span class="st-line"><span class="st-in" style="--d:'+((start+i)*STAGGER).toFixed(2)+'s">'+l.join(" ")+'</span></span>';
    }).join("");
    el.setAttribute("aria-label",el._orig); el.classList.add("is-split");
    return lines.length;
  }
  // Words as escaped HTML; a word inside .text-mark keeps its colour span while the lines rise
  function wordsOf(html){
    var box=document.createElement("div"); box.innerHTML=html; var ws=[], cur=-1, gap=true;
    (function walk(n,mark){[].forEach.call(n.childNodes,function(c){
      if(c.nodeType===1){ walk(c, mark||c.classList.contains("text-mark")); return; }
      if(c.nodeType!==3) return;
      c.textContent.split(/(\s+)/).forEach(function(p){
        if(!p) return; if(/^\s+$/.test(p)){gap=true; return;}
        var h=mark?'<span class="text-mark">'+esc(p)+'</span>':esc(p);
        if(gap||cur<0){ws.push(h); cur=ws.length-1; gap=false;} else ws[cur]+=h;
      });
    });})(box,false);
    return ws;
  }
  function settle(el){ if(el._orig!=null){el.innerHTML=el._html;el.removeAttribute("aria-label");} }
  // Play a group: each target's lines continue the stagger of the one before it (heading, then text)
  function play(targets,startAt){
    var n=startAt||0;
    targets.forEach(function(el){el.classList.remove("is-in");
      if(el.classList.contains("sec-dot")){   // a section label: the dot grows and the text slides in (cambium.com), then the headline's lines follow
        if(!el.querySelector(".sec-dot_text")) el.innerHTML='<span class="sec-dot_text">'+el.innerHTML+'</span>';
        el.classList.add("is-split"); el.style.setProperty("--dot-d",(n*STAGGER).toFixed(2)+"s"); n+=3; return;
      }
      n+=split(el,n);});
    void document.body.offsetWidth;
    requestAnimationFrame(function(){targets.forEach(function(el){el.classList.add("is-in");});});
    var ms=n*STAGGER*1000+DUR+100;
    clearTimeout(targets[0]&&targets[0]._t);
    if(targets[0]) targets[0]._t=setTimeout(function(){targets.forEach(settle);},ms);   // back to plain text, so resizing reflows normally
    return n;
  }
  function done(el){el.classList.add("is-split","is-in");}
  if(reduce){ document.querySelectorAll("[data-split],[data-reveal],[data-reveal-wipe],[data-reveal-media]").forEach(done); return {play:function(t){t.forEach(done);},observe:function(){} }; }

  var waiting=new Set();
  function fire(el){ io.unobserve(el); waiting.delete(el);
      if(el.hasAttribute("data-split-group")) play([].slice.call(el.querySelectorAll("[data-split]")));
      else if(el.hasAttribute("data-split")) play([el]);
      else el.classList.add("is-in"); }
  // The page's last lines can never pass the -12% bottom margin, so at the very bottom play whatever is on screen
  addEventListener("scroll",function(){
    if(innerHeight+scrollY<document.documentElement.scrollHeight-4) return;
    waiting.forEach(function(el){ var r=el.getBoundingClientRect(); if(r.top<innerHeight&&r.bottom>0) fire(el); });
  },{passive:true});
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(!e.isIntersecting) return; io.unobserve(e.target); waiting.delete(e.target); var el=e.target;
      if(el.hasAttribute("data-split-group")) play([].slice.call(el.querySelectorAll("[data-split]")));
      else if(el.hasAttribute("data-split")) play([el]);
      else el.classList.add("is-in");
    });
  },{rootMargin:"0px 0px -12% 0px",threshold:0});
  function observe(root){
    root=root||document;
    var add=function(el){io.observe(el);waiting.add(el);};
    root.querySelectorAll("[data-split-group]").forEach(function(g){ if(!g.closest("[data-split-manual]")) add(g);});
    root.querySelectorAll("[data-split]").forEach(function(el){ if(!el.closest("[data-split-group],[data-split-manual]")) add(el); });   // [data-split-manual]: the section plays these itself
    root.querySelectorAll("[data-reveal],[data-reveal-wipe],[data-reveal-media]").forEach(add);
  }
  (document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(function(){observe();});
  return {play:play,observe:observe};
})();
