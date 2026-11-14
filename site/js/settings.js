// ===== Display settings: "Save battery" panel (after noho.ink's energy menu) =====
// Two switches, for the whole page: Reduce motion and Dark mode. The choice is kept on this device.
// Motion: CSS media rules for prefers-reduced-motion are re-pointed to the reader's choice (so every section's own
// reduced-motion styles apply), and js/boot.js answered every script's matchMedia the same way before they ran.
// Changing motion reloads at the same scroll position, because each section reads it once when it starts.
(function () {
  var root = document.documentElement, motion = window.SFGMotion, T = window.SFGT || String;

  // 1. CSS: re-point (prefers-reduced-motion) media rules
  if (motion) {
    var reduce = motion === "reduce";
    [].forEach.call(document.styleSheets, function (sh) {
      var rules; try { rules = sh.cssRules; } catch (e) { return; }   // other origins (Google Fonts) cannot be read; they hold no motion
      (function walk(list) {
        [].forEach.call(list, function (r) {
          if (r.media && /prefers-reduced-motion/.test(r.media.mediaText)) {
            var t = r.media.mediaText, wantsReduce = /reduce/.test(t);
            var rest = t.replace(/\(\s*prefers-reduced-motion\s*:\s*(reduce|no-preference)\s*\)/g, "").replace(/^\s*and\s+|\s+and\s*$/g, "").replace(/\band\s+and\b/g, "and").trim();
            var on = wantsReduce === reduce;
            r.media.mediaText = on ? (rest || "all") : "not all";
          }
          if (r.cssRules) walk(r.cssRules);
        });
      })(rules);
    });
  }

  // 2. The panel
  var btn = document.querySelector("[data-prefs-toggle]"), panel = document.getElementById("prefs-panel");
  if (!btn || !panel) return;
  var sw = { motion: panel.querySelector('[data-pref="motion"]'), theme: panel.querySelector('[data-pref="theme"]') };
  var sysReduce = matchMedia("(prefers-reduced-motion: reduce)").matches, sysDark;
  try { sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches; } catch (e) { sysDark = false; }
  function isDark() { var t = root.getAttribute("data-theme"); return t ? t === "dark" : sysDark; }
  function paint() {
    var m = sysReduce, d = isDark();
    sw.motion.setAttribute("aria-checked", String(m)); sw.theme.setAttribute("aria-checked", String(d));
    var lvl = (m ? 1 : 0) + (d ? 1 : 0);   // a simple usage badge, like noho's
    panel.querySelectorAll("[data-prefs-level]").forEach(function (b) { b.textContent = T(lvl === 2 ? "Low" : lvl === 1 ? "Medium" : "High"); b.setAttribute("data-level", lvl); });
  }
  function open(on) {
    if (on) { var h = document.getElementById("site-header"); panel.style.top = Math.round(h.getBoundingClientRect().bottom) + "px"; }   // just under the header, tall or compact
    panel.hidden = !on; btn.setAttribute("aria-expanded", String(on));
    if (on) { paint(); sw.motion.focus(); }
  }
  btn.addEventListener("click", function () { open(panel.hidden); });
  panel.querySelector("[data-prefs-close]").addEventListener("click", function () { open(false); btn.focus(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) { open(false); btn.focus(); } });
  document.addEventListener("pointerdown", function (e) { if (!panel.hidden && !panel.contains(e.target) && !btn.contains(e.target)) open(false); });
  sw.theme.addEventListener("click", function () {
    var next = isDark() ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("sfg-theme", next); } catch (e) {}
    paint();
  });
  sw.motion.addEventListener("click", function () {
    try {
      localStorage.setItem("sfg-motion", sysReduce ? "full" : "reduce");
      sessionStorage.setItem("sfg-restore", String(Math.round(scrollY)));
      sessionStorage.setItem("sfg-prefs-open", "1");
    } catch (e) {}
    location.reload();
  });
  paint();
  try { if (sessionStorage.getItem("sfg-prefs-open")) { sessionStorage.removeItem("sfg-prefs-open"); open(true); } } catch (e) {}
})();
