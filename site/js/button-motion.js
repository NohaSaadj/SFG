// ===== Button and text-link motion (after cambium.com) =====
(function(){
  document.querySelectorAll(".button-primary,.how_cta").forEach(function(a){
    var def=document.createElement("span"); def.className="btn-roll_def";
    while(a.firstChild) def.appendChild(a.firstChild);
    var hov=document.createElement("span"); hov.className="btn-roll_hov"; hov.setAttribute("aria-hidden","true");
    var hin=document.createElement("span"); hin.className="btn-roll_hov-in"; hov.appendChild(hin);
    a.appendChild(def); a.appendChild(hov); a.classList.add("btn-roll");
    function sync(){ hin.innerHTML=def.innerHTML; hin.querySelectorAll(".sr-only,[id]").forEach(function(n){ if(n.classList.contains("sr-only")) n.remove(); else n.removeAttribute("id"); }); hin.querySelectorAll("[data-i18n]").forEach(function(n){n.removeAttribute("data-i18n");}); }
    sync(); a.addEventListener("pointerenter",sync);   // the label can change language, so copy it on each hover
  });
  function links(){ document.querySelectorAll(".how_link,.partners_join,.voices_open,.footer_col a,.sb_credit").forEach(function(a){
    if(a.querySelector(".link-draw_text")) return;
    var t=document.createElement("span"); t.className="link-draw_text";
    [].slice.call(a.childNodes).forEach(function(n){ if(n.nodeName.toLowerCase()!=="svg") t.appendChild(n); });
    a.insertBefore(t,a.firstChild); a.classList.add("link-draw");
  }); }
  links(); document.addEventListener("DOMContentLoaded",links);   // the story deck adds its credit link later
})();
