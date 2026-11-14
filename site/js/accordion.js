// ===== Become a mentor: a topic's points write in when it opens =====
// Open / close after cambium.com: the body slides open or shut (grid rows 0fr ↔ 1fr, .6s) and the + turns into −.
// The native <details> stays open while it closes, so the motion is seen, then closes for real.
document.querySelectorAll(".join_item").forEach(function(d){
  var sum=d.querySelector(".join_sum"), body=d.querySelector(".join_body"), t=null;
  if(d.open) d.classList.add("is-open");
  sum.addEventListener("click",function(e){
    e.preventDefault(); clearTimeout(t);
    if(!d.classList.contains("is-open")){
      d.open=true; void body.offsetHeight; d.classList.add("is-open");
    } else {
      d.classList.remove("is-open");
      t=setTimeout(function(){ if(!d.classList.contains("is-open")) d.open=false; },matchMedia("(prefers-reduced-motion: reduce)").matches?0:600);
    }
  });
  d.addEventListener("toggle",function(){
    if(d.open&&!d.classList.contains("is-open")) d.classList.add("is-open");   // opened another way (find in page)
    if(d.open&&window.SFGReveal) SFGReveal.play([].slice.call(d.querySelectorAll("[data-split]")));
  });
});
