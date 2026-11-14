// ===== How it works · the illustrations play when they come into view =====
(function(){
  var plan=[   // [selector inside the card, motion]; listed in the order they play
    [".is-form",[[".how_card-top","in"],[".how_field","in"],[".how_field .how_bar","grow"],[".how_chip","pop"]]],
    [".is-match",[[".how_person:first-of-type","left"],[".how_person:last-of-type","right"],[".how_tag","pop"]]],
    [".is-list",[[".how_card-top","in"],[".how_rows li","in"]]],
    [".is-doc",[[".how_card-top","in"],[":scope > .how_bar","grow"],[".how_note","in"]]],
    [".is-submit",[[".how_rows li","in"],[".how_check","pop"],[".how_done .h5","in"]]]
  ];
  var medias=[].slice.call(document.querySelectorAll(".how_media"));
  plan.forEach(function(p){
    var card=document.querySelector(".how_card"+p[0]); if(!card) return; var n=0;
    p[1].forEach(function(step){ card.querySelectorAll(step[0]).forEach(function(el){
      el.classList.add("how-a"); el.setAttribute("data-a",step[1]); el.style.setProperty("--how-k","how-"+step[1]); el.style.setProperty("--a",n++);
    }); });
    card.style.setProperty("--pen-d",(.15+n*.12+.4).toFixed(2)+"s");   // the red pen marks after the lines are down
  });
  if(!("IntersectionObserver" in window)){ medias.forEach(function(m){m.classList.add("is-play");}); return; }
  var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("is-play"); io.unobserve(e.target); } }); },{threshold:.4});
  medias.forEach(function(m){io.observe(m);});
})();
