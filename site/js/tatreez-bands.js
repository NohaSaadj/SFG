// ===== Tatreez bands · as many whole motifs as fit between the margins, scaled evenly to fill the width =====
(function(){
  const TILE=367.2,bands=[...document.querySelectorAll("svg[data-tatreez-fit]")];
  function fit(){bands.forEach(b=>{
    const h=+b.getAttribute("data-tatreez-h")||25.2,n=Math.max(1,Math.round(b.parentElement.clientWidth*25.2/(h*TILE))),w=(n*TILE).toFixed(1);   /* data-tatreez-h: a thinner band (more, smaller motifs) */
    b.setAttribute("viewBox",`0 0 ${w} 25.2`);b.querySelector(":scope > rect").setAttribute("width",w);
  });}
  addEventListener("resize",fit);fit();
})();
