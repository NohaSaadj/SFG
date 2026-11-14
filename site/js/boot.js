/* Runs in <head>, before first paint.
   1. html.js: lets CSS hide what the scripts will reveal (no flash of unrevealed content).
   2. The reader's display settings (js/settings.js): theme and reduced motion, applied before anything draws or animates.
      "Reduce motion" makes every script see prefers-reduced-motion: reduce, so each section takes its existing still path. */
(function () {
  var root = document.documentElement, motion = null, theme = null;
  root.classList.add("js");
  try { motion = localStorage.getItem("sfg-motion"); theme = localStorage.getItem("sfg-theme"); } catch (e) {}
  if (motion !== "reduce" && motion !== "full") {   // no choice yet: the system setting, or the browser's data saver
    var saveData = navigator.connection && navigator.connection.saveData;
    motion = saveData ? "reduce" : null;
  }
  if (theme === "dark" || theme === "light") root.setAttribute("data-theme", theme);
  window.SFGMotion = motion;   // "reduce", "full" or null (follow the system)
  if (!motion) return;
  var Q = /prefers-reduced-motion\s*:\s*(reduce|no-preference)/, native = window.matchMedia.bind(window);
  window.matchMedia = function (q) {
    var m = Q.exec(q);
    if (!m) return native(q);
    var on = (m[1] === "reduce") === (motion === "reduce");
    var mql = native(q);   // keep the real object's methods (addEventListener, …), answer with the reader's choice
    try { Object.defineProperty(mql, "matches", { value: on }); } catch (e) { return { matches: on, media: q, addEventListener: function () {}, removeEventListener: function () {}, addListener: function () {}, removeListener: function () {} }; }
    return mql;
  };
  if (motion === "reduce") root.classList.add("is-motion-reduced");
})();
