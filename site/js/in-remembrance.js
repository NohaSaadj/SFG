/* In remembrance: the prints settle once when the section comes into view.
   Hooks: [data-memory] */
(function () {
  var sec = document.querySelector("[data-memory]");
  if (!sec) return;
  if (!("IntersectionObserver" in window)) { sec.classList.add("is-in"); return; }
  new IntersectionObserver(function (es, o) {
    if (es[0].isIntersecting) { sec.classList.add("is-in"); o.disconnect(); }
  }, { threshold: 0.25 }).observe(sec);
})();
