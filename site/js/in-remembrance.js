/* In remembrance: the prints settle once when the section comes into view.
   Hooks: [data-memory] */
(function () {
  var sec = document.querySelector("[data-memory]");
  if (!sec) return;
  // phones: the photo row scrolls sideways, so it must be reachable and named for keyboard and screen-reader users
  var row = sec.querySelector(".memory_prints"), small = matchMedia("(max-width: 767px)"), T = window.SFGT || String;
  function a11y() {
    if (small.matches) { row.setAttribute("tabindex", "0"); row.setAttribute("role", "region"); row.setAttribute("aria-label", T("Photos of our mentees, scroll sideways")); }
    else { row.removeAttribute("tabindex"); row.removeAttribute("role"); row.removeAttribute("aria-label"); }
  }
  if (row) { a11y(); small.addEventListener("change", a11y); }
  if (!("IntersectionObserver" in window)) { sec.classList.add("is-in"); return; }
  new IntersectionObserver(function (es, o) {
    if (es[0].isIntersecting) { sec.classList.add("is-in"); o.disconnect(); }
  }, { threshold: 0.25 }).observe(sec);
})();
