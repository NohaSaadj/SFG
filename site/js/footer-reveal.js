/* Footer reveal: its content rises into place as the footer comes into view. Hooks: [data-footer] [data-footer-inner] */
(function () {
  var f = document.querySelector("[data-footer]"), inner = f && f.querySelector("[data-footer-inner]");
  if (!inner || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var raf = 0;
  function tick() {
    raf = 0;
    var r = f.getBoundingClientRect(), vh = innerHeight;
    var p = Math.max(0, Math.min(1, (vh - r.top) / Math.min(r.height, vh)));   // 0 when the footer's top reaches the screen's bottom, 1 when it is in full view
    inner.style.transform = "translate3d(0," + ((1 - p) * -30).toFixed(2) + "%,0)";
  }
  addEventListener("scroll", function () { if (!raf) raf = requestAnimationFrame(tick); }, { passive: true });
  addEventListener("resize", tick); tick();
})();
