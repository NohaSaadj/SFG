// ===== Nav links: noho.ink's letter cascade on hover =====
window.SFGCascade=function(){
  document.querySelectorAll(".header_nav-link").forEach(function(a){
    var h=a.hasAttribute("data-i18n")?a:a.querySelector("[data-i18n]:not(.sr-only)"); if(!h||h.querySelector(".cascade")) return;
    var t=h.textContent, latin=/^[\x00-\x7F’]*$/.test(t);
    var parts=latin?t.split(""):t.split(/(\s+)/);   // Arabic stays joined: it rolls word by word
    var line=function(){return parts.map(function(c,i){return '<span class="cascade_l" style="--i:'+i+'">'+c.replace(/&/g,"&amp;").replace(/</g,"&lt;")+'</span>';}).join("");};
    h.innerHTML='<span class="sr-only"></span><span class="cascade" aria-hidden="true"><span class="cascade_a">'+line()+'</span><span class="cascade_b">'+line()+'</span></span>';
    h.firstChild.textContent=t;
  });
};
SFGCascade();
