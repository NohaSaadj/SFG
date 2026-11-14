/*! SFG Student Voices v1.0.0
    Noho-stories deck: on desktop the section pins and each card slides over the previous one, leaving 20% of it
    showing; the last card lands flush with the right grid margin. One viewport of scroll per card. A covered card
    peeks 10% on hover; a green "Read" bubble follows the pointer over the cards. Any card opens its full story
    in a side panel with previous / next. Below 992px, with reduced motion or without JS: a swipe strip.
    Hooks: [data-voices] [data-voices-pin] [data-voices-deck] [data-voices-list] [data-voices-item] [data-voices-open]
           [data-voices-story] [data-voices-prev] [data-voices-next]
           [data-voices-cursor] [data-voices-dialog] [data-voices-d-*] */
(function () {
  "use strict";
  var section = document.querySelector("[data-voices]");
  if (!section || window.__sfgVoices) return; window.__sfgVoices = true;

  var pin = section.querySelector("[data-voices-pin]");
  var deck = section.querySelector("[data-voices-deck]");
  var list = section.querySelector("[data-voices-list]");
  var items = [].slice.call(section.querySelectorAll("[data-voices-item]"));
  var n = items.length;
  var desktop = matchMedia("(min-width: 992px)");
  var reduced = matchMedia("(prefers-reduced-motion: reduce)");
  var finePointer = matchMedia("(hover: hover) and (pointer: fine)");

  // ---- Pinned deck ---------------------------------------------------------
  var spacer = document.createElement("div");
  spacer.className = "voices_spacer";
  section.parentNode.insertBefore(spacer, section);
  spacer.appendChild(section);

  var on = false, w = 0, cw = 0, padL = 0, lastTarget = 0, start = 0, dist = 0, rtl = false, sgn = 1;
  var target = 0, shown = 0, raf = 0, current = -1;
  var hover = items.map(function () { return { p: 0, to: 0 }; });
  function ease(t) { return 1 - (1 - t) * (1 - t); }   // power1.out, per card, as in GSAP's default

  function measure() {
    var want = desktop.matches && !reduced.matches;
    section.classList.toggle("is-pinned", want);
    on = want;
    if (!on) {
      spacer.style.height = section.style.position = section.style.top = section.style.minHeight = "";
      items.forEach(function (it) { it.style.left = it.style.insetInlineStart = it.style.transform = ""; it.firstElementChild.style.width = it.firstElementChild.style.transform = ""; });
      onStrip();
      return;
    }
    var vh = innerHeight;
    section.style.minHeight = vh + "px";
    w = items[0].offsetWidth;
    cw = deck.clientWidth;
    padL = parseFloat(getComputedStyle(deck).paddingInlineStart);
    rtl = getComputedStyle(deck).direction === "rtl"; sgn = rtl ? -1 : 1;   // in Arabic the deck starts at the right and the cards travel the other way
    items.forEach(function (it, i) { it.style.left = ""; it.style.insetInlineStart = i * w + "px"; });
    // the last card lands with its right edge on the right grid margin (the list starts at the left margin)
    lastTarget = (cw - 2 * padL - w) - (n - 1) * w;
    dist = (n - 1) * vh;
    spacer.style.height = vh + dist + "px";
    section.style.position = "sticky";
    section.style.top = "0px";
    start = spacer.getBoundingClientRect().top + scrollY;
    onScroll();
    shown = target;
    render();
  }

  function xFor(i, T) {
    var x = 0;
    for (var s = 1; s <= Math.min(i, n - 1); s++) {
      if (T <= s - 1) break;
      var from = -0.8 * w * (s - 1);
      var to = (s === n - 1 && i === n - 1) ? lastTarget : -0.8 * w * s;
      x = from + (to - from) * ease(Math.min(1, T - (s - 1)));
    }
    return x;
  }

  function setCurrent(k) {
    if (k === current) return;
    current = k;
    prev.disabled = k <= 0; next.disabled = k >= n - 1;
  }

  function render() {
    var T = shown * (n - 1);
    items.forEach(function (it, i) {
      var h = hover[i];
      h.p += (h.to - h.p) * 0.2;
      if (Math.abs(h.to - h.p) < 1e-3) h.p = h.to;
      var grow = 0.1 * w * h.p;
      it.style.transform = "translate3d(" + sgn * xFor(i, T) + "px,0,0)";
      it.firstElementChild.style.transform = grow ? "translate3d(" + -sgn * grow + "px,0,0)" : "";
    });
    // how much of each card is uncovered (1 = all of it); below half, its quote fades to 55%
    items.forEach(function (it, i) {
      var a = it.firstElementChild.getBoundingClientRect(), nx = i === n - 1 ? null : items[i + 1].getBoundingClientRect();
      var seen = !nx ? 1 : (rtl ? a.right - nx.right : nx.left - a.left) / w;
      var k = Math.min(1, Math.max(0, (seen - 0.25) / 0.5));
      it.style.setProperty("--voices-seen", (0.55 + 0.45 * k).toFixed(3));   // 55% floor keeps 3.6:1 (large text needs 3:1)
    });
    setCurrent(Math.min(n - 1, Math.round(T)));
  }

  function onScroll() {
    if (!on) return;
    target = Math.min(1, Math.max(0, (scrollY - start) / dist));
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function tick() {
    raf = 0;
    if (!on) return;
    shown += (target - shown) * 0.1;   // the Lenis-style glide (lerp .1)
    var settled = Math.abs(target - shown) < 1e-4 && hover.every(function (h) { return h.p === h.to; });
    if (Math.abs(target - shown) < 1e-4) shown = target;
    render();
    if (!settled) raf = requestAnimationFrame(tick);
  }

  // Covered cards peek: widen 10% to the left (not the first or last card)
  items.forEach(function (it, i) {
    if (i === 0 || i === n - 1) return;
    var card = it.firstElementChild;
    card.addEventListener("mouseenter", function () {
      if (!on || !finePointer.matches) return;
      var c = card.getBoundingClientRect(), nx = items[i + 1].getBoundingClientRect();
      if (rtl ? c.right - 0.9 * w < nx.right : c.left + 0.9 * w > nx.left) { hover[i].to = 1; onScroll(); if (!raf) raf = requestAnimationFrame(tick); }
    });
    card.addEventListener("mouseleave", function () { hover[i].to = 0; if (!raf) raf = requestAnimationFrame(tick); });
  });

  // ---- Strip mode (phones, tablets, reduced motion) -------------------------
  function onStrip() {
    if (on) return;
    var x = list.scrollLeft, best = 0, d = Infinity;
    items.forEach(function (it, i) { var dd = Math.abs(it.offsetLeft - items[0].offsetLeft - x); if (dd < d) { d = dd; best = i; } });
    setCurrent(best);
  }
  list.addEventListener("scroll", onStrip, { passive: true });

  // ---- Go to a card (arrows, keyboard focus) ------------------------------
  function goTo(k) {
    k = Math.max(0, Math.min(n - 1, k));
    var smooth = reduced.matches ? "auto" : "smooth";
    if (on) scrollTo({ top: start + dist * (k / (n - 1)), behavior: smooth });
    else list.scrollTo({ left: items[k].offsetLeft - items[0].offsetLeft, behavior: smooth });
  }
  var prev = section.querySelector("[data-voices-prev]"), next = section.querySelector("[data-voices-next]");
  prev.addEventListener("click", function () { goTo(current - 1); });
  next.addEventListener("click", function () { goTo(current + 1); });
  items.forEach(function (it, i) {
    it.addEventListener("focusin", function () { if (on && i !== current) goTo(i); });
  });


  // ---- "Read" bubble cursor ------------------------------------------------
  var cur = section.querySelector("[data-voices-cursor]");
  if (finePointer.matches && !reduced.matches) {
    section.classList.add("has-cursor");
    var cx = 0, cy = 0, tx = 0, ty = 0, moving = 0, big = false;
    function follow() {
      cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
      cur.style.transform = "translate3d(" + cx + "px," + cy + "px,0) translate(-50%,-50%)";
      moving = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.3 ? requestAnimationFrame(follow) : 0;
    }
    function look(x, y) {
      var el = document.elementFromPoint(x, y);
      var over = !!(el && el.closest(".voices_card") && section.contains(el));
      if (over !== big) { big = over; cur.classList.toggle("is-big", over); cur.classList.toggle("is-on", over); }
    }
    document.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      if (!big) { cx = e.clientX; cy = e.clientY; }
      tx = e.clientX; ty = e.clientY; look(tx, ty);
      if (!moving) moving = requestAnimationFrame(follow);
    }, { passive: true });
    addEventListener("scroll", function () { if (tx || ty) look(tx, ty); }, { passive: true });
    document.addEventListener("pointerleave", function () { big = false; cur.classList.remove("is-big", "is-on"); });
  }

  // ---- Full story panel ----------------------------------------------------
  var dlg = section.querySelector("[data-voices-dialog]");
  var dName = dlg.querySelector("[data-voices-d-name]"), dStudy = dlg.querySelector("[data-voices-d-study]"), dUni = dlg.querySelector("[data-voices-d-uni]");
  var dStatus = dlg.querySelector("[data-voices-d-status]");
  var dPhoto = dlg.querySelector("[data-voices-d-photo]"), dPlace = dlg.querySelector("[data-voices-d-placeholder]"), dInit = dlg.querySelector("[data-voices-d-initials]");
  var dSch = dlg.querySelector("[data-voices-d-scholarship]"), dStory = dlg.querySelector("[data-voices-d-story]");
  var dScroll = dlg.querySelector("[data-voices-d-scroll]");
  var dPrev = dlg.querySelector("[data-voices-d-prev]"), dNext = dlg.querySelector("[data-voices-d-next]");
  var openIdx = 0, opener = null;
  // Wheel scrolling in the panel eases like Noho's (Lenis, lerp .1); keys, scrollbar and touch stay native
  var fine = matchMedia("(pointer:fine)"), glideTo = 0, glideAt = 0, glideRaf = 0;
  function glide() {
    glideAt += (glideTo - glideAt) * 0.1;
    if (Math.abs(glideTo - glideAt) < 0.5) glideAt = glideTo;
    dScroll.scrollTop = glideAt;
    glideRaf = glideAt === glideTo ? 0 : requestAnimationFrame(glide);
  }
  function stopGlide() { cancelAnimationFrame(glideRaf); glideRaf = 0; }
  dScroll.addEventListener("wheel", function (e) {
    if (!fine.matches || reduced.matches || e.ctrlKey) return;
    e.preventDefault();
    if (!glideRaf) glideTo = glideAt = dScroll.scrollTop;
    var dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? dScroll.clientHeight : 1);
    glideTo = Math.max(0, Math.min(dScroll.scrollHeight - dScroll.clientHeight, glideTo + dy));
    if (!glideRaf) glideRaf = requestAnimationFrame(glide);
  }, { passive: false });
  dScroll.addEventListener("keydown", stopGlide);
  dScroll.addEventListener("pointerdown", stopGlide);
  function fill(k) {
    openIdx = k;
    var it = items[k];
    var fig = it.querySelector(".voices_card");
    dSch.textContent = fig.getAttribute("data-voices-scholarship");   // programme and scholarship live only in the panel
    dName.textContent = it.querySelector(".voices_name").textContent;
    dStudy.textContent = fig.getAttribute("data-voices-study");
    dUni.textContent = it.querySelector(".voices_uni").textContent;
    var photo = fig.getAttribute("data-voices-photo");
    dPhoto.hidden = !photo; dPlace.hidden = !!photo;
    if (photo) { dPhoto.src = photo; dPhoto.alt = fig.getAttribute("data-voices-photo-alt") || ""; } else dPhoto.removeAttribute("src");
    dInit.textContent = dName.textContent.split(/\s+/).map(function (w) { return w.charAt(0); }).slice(0, 2).join("");
    dStory.innerHTML = "";
    dStory.appendChild(it.querySelector("[data-voices-story]").content.cloneNode(true));
    stopGlide(); dScroll.scrollTop = 0;
    dPrev.disabled = k === 0; dNext.disabled = k === n - 1;
  }
  items.forEach(function (it, i) {
    it.querySelector("[data-voices-open]").addEventListener("click", function () {
      opener = this; fill(i); dStatus.textContent = "";
      document.documentElement.classList.add("voices-lock");
      dlg.showModal();
    });
  });
  function announce() { var T = window.SFGT || String; dStatus.textContent = T("Story") + " " + (openIdx + 1) + " " + T("of") + " " + n + ": " + dName.textContent; }   // focus stays on the arrow, so say what changed
  var dArt = dlg.querySelector(".voices_article"), dCur = dlg.querySelector("[data-voices-d-curtain]"), busy = false;
  function swap(k, after) {   // noho.ink: text out, curtain up over the photo, swap, curtain off the top, text writes in
    if (reduced.matches) { fill(k); after(); return; }
    if (busy) return; busy = true;
    dArt.classList.remove("is-back"); dArt.classList.add("is-out");
    dCur.classList.remove("is-leave"); void dCur.offsetWidth; dCur.classList.add("is-cover");
    setTimeout(function () {
      fill(k); after();
      dCur.classList.remove("is-cover"); dCur.classList.add("is-leave");
      dArt.classList.remove("is-out"); dArt.classList.add("is-back");
      if (window.SFGReveal) { dName._orig = null; SFGReveal.play([dName]); }
      setTimeout(function () { dCur.style.transition = "none"; dCur.classList.remove("is-leave"); void dCur.offsetWidth; dCur.style.transition = ""; dArt.classList.remove("is-back"); busy = false; }, 650);
    }, 520);
  }
  dPrev.addEventListener("click", function () { if (openIdx > 0) swap(openIdx - 1, function () { announce(); (openIdx === 0 ? dNext : dPrev).focus(); }); });
  dNext.addEventListener("click", function () { if (openIdx < n - 1) swap(openIdx + 1, function () { announce(); (openIdx === n - 1 ? dPrev : dNext).focus(); }); });
  dlg.querySelector("[data-voices-close]").addEventListener("click", function () { dlg.close(); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });   // click on the scrim
  dlg.addEventListener("close", function () {
    document.documentElement.classList.remove("voices-lock");
    if (opener) {
      // return focus to the card of the story last read
      var b = items[openIdx].querySelector("[data-voices-open]");
      b.classList.add("is-quiet");   // focus returns quietly: no ring until the next key press
      b.focus({ preventScroll: true });   // in the pinned deck, focusin then glides to that card
      var wake = function () { b.classList.remove("is-quiet"); document.removeEventListener("keydown", wake, true); b.removeEventListener("blur", away); };
      var away = function () { setTimeout(function () { if (document.activeElement !== b) wake(); }); };   // a window switch keeps focus on b
      setTimeout(function () { document.addEventListener("keydown", wake, true); b.addEventListener("blur", away); });
    }
  });

  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", measure);
  desktop.addEventListener("change", measure);
  reduced.addEventListener("change", measure);
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(measure);
  measure();
})();
