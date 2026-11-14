/* Mentor voices: previous / next show one mentor at a time (no autoplay).
   Hooks: [data-mentors] [data-mentor] [data-mentors-prev] [data-mentors-next] [data-mentors-current] [data-mentors-status] */
(function () {
  var sec = document.querySelector("[data-mentors]"); if (!sec) return;
  var slides = [].slice.call(sec.querySelectorAll("[data-mentor]")), k = 0;
  var prev = sec.querySelector("[data-mentors-prev]"), next = sec.querySelector("[data-mentors-next]");
  var status = sec.querySelector("[data-mentors-status]");
  var bys = [].slice.call(sec.querySelectorAll("[data-mentor-by]")), fill = sec.querySelector("[data-mentors-fill]");
  var seen = false;
  function reveal() { if (!window.SFGReveal) return; SFGReveal.play([].slice.call(slides[k].querySelectorAll("[data-split]")).concat([].slice.call(bys[k].querySelectorAll("[data-split]")))); }
  // Equal shape for every voice: find one width at which all quotes wrap to the same number of lines, and all
  // follow-ups too, so each slide has the same line count (the text is justified to fill those lines).
  function lines(el) { return Math.round(el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight)); }
  function lineFill(el, w) {   // how full the fullest-to-emptiest non-last line is (1 = touches the edge)
    var r = document.createRange(); r.selectNodeContents(el);
    var rows = {}; [].forEach.call(r.getClientRects(), function (q) { var k = Math.round(q.top); rows[k] = (rows[k] || 0) + q.width; });
    var ws = Object.keys(rows).sort(function (x, y) { return x - y; }).map(function (k) { return rows[k]; });
    ws.pop(); return ws.length ? Math.min.apply(null, ws) / w : 1;
  }
  function equalize() {
    [".mentors_line", ".mentors_more"].forEach(function (sel) {
      var els = [].slice.call(sec.querySelectorAll(sel)); if (!els.length) return;
      els.forEach(function (el) { el.style.maxWidth = sel === ".mentors_more" ? "64ch" : ""; el.style.minHeight = ""; });   // widest allowed: 64ch for the follow-up
      var max = els[0].getBoundingClientRect().width, w, best = null, bestFill = -1;
      els.forEach(function (el) { el.style.textAlign = "start"; });   // measure the natural lines
      for (w = Math.floor(max); w >= max * .5; w -= 2) {   // widths at which every slide wraps to the same number of lines…
        els.forEach(function (el) { el.style.maxWidth = w + "px"; });
        var n = lines(els[0]);
        if (!els.every(function (el) { return lines(el) === n; })) continue;
        var f = Math.min.apply(null, els.map(function (el) { return lineFill(el, w); }));
        if (f > bestFill + .005) { bestFill = f; best = w; }   // …and of those, the one whose lines are already fullest, so justifying opens the least space
      }
      els.forEach(function (el) { el.style.textAlign = ""; });
      els.forEach(function (el) { el.style.maxWidth = (best || Math.floor(max)) + "px"; });
      if (!best) { var h = Math.max.apply(null, els.map(function (el) { return el.getBoundingClientRect().height; })); els.forEach(function (el) { el.style.minHeight = h + "px"; }); }   // no such width: at least the same height
    });
  }
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(equalize);
  var rq; addEventListener("resize", function () { clearTimeout(rq); rq = setTimeout(equalize, 150); });
  new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { o.disconnect(); seen = true; equalize(); reveal(); } }, { rootMargin: "0px 0px -12% 0px" }).observe(sec.querySelector(".mentors_grid"));
  function show(n, say) {
    var was = k;
    k = Math.max(0, Math.min(slides.length - 1, n));
    slides.forEach(function (s, i) { s.classList.toggle("is-current", i === k); if (i === k) s.removeAttribute("inert"); else s.setAttribute("inert", ""); });
    bys.forEach(function (b, i) { b.classList.toggle("is-current", i === k); });
    fill.style.width = ((k + 1) / slides.length * 100) + "%";
    prev.disabled = k === 0; next.disabled = k === slides.length - 1;
    if (say) status.textContent = slides[k].getAttribute("aria-label");
    if (seen && k !== was) reveal();
  }
  prev.addEventListener("click", function () { show(k - 1, true); if (prev.disabled) next.focus(); });
  next.addEventListener("click", function () { show(k + 1, true); if (next.disabled) prev.focus(); });
  show(0, false);
})();
