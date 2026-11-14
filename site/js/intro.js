/*! SFG Intro Story Roll v4.0.0 (scroll-controlled)
    After a 2s dark opening the story plays on its own; the wheel, trackpad, touch or arrow keys speed it up or play it
    back. The paragraph hides from mid-screen up, keywords lift into a two-line sentence that moves straight to start
    alignment, the last photo zooms out, then fades to 15% while the closing line rises into the sentence's place.
    Hooks: [data-intro] [data-intro-bgs] [data-intro-viewport] [data-intro-text] [data-poem] [data-target-row] [data-target-center] [data-target-start]
           [data-intro-begin] [data-intro-cue] [data-intro-sr] [data-skip-intro] [data-lang-toggle] [data-menu-trigger] */
(function () {
  "use strict";
  if (window.__sfgIntro) return; window.__sfgIntro = true;

  // keyword: 1 = part of the hidden sentence. Keywords may sit inside a word (lim|its, kn|own).
  var POEM = {
    en: [
      [1, "A"],
      [0, " student in Gaza writes a personal statement between power cuts. The internet drops; the draft is saved again. Twelve universities are gone, so the classroom lives on a phone, and hope survives on a "],
      [1, "highly"],
      [0, " unreliable signal. Every sentence is "],
      [1, "educated"],
      [0, " guesswork, until a mentor thousands of miles away reads it and writes back: tell me more. The journey can take a year or more. Doors close. Deadlines pass. Still, from shelters and borrowed rooms across "],
      [1, "Palestine,"],
      [0, " they apply again. What was broken can be "],
      [1, "rebuilt"],
      [0, ", word "],
      [1, "by"],
      [0, " word, draft by draft. They refuse the lim"],
      [1, "its"],
      [0, " placed on them. Their names are not yet kn"],
      [1, "own"],
      [0, ". They are not statistics. They are "],
      [1, "students."]
    ],
    // Draft translation, to be reviewed by a native Arabic editor. Whole words only (no split ligatures).
    ar: [
      [0, "في غزة، تكتب طالبةٌ بيانها الشخصي بين انقطاعين للكهرباء. ينقطع الإنترنت؛ فتحفظ المسودة من جديد. اثنتا عشرة جامعة لم تعد قائمة، فصار الصفّ يعيش على هاتف، والأمل ينجو على إشارة ضعيفة جدًا. كل جملة تخمينٌ مدروس، حتى يقرأها مرشدٌ على بُعد آلاف الأميال ويردّ: أخبرني المزيد. قد تستغرق الرحلة عامًا أو أكثر. تُغلق أبواب، وتفوت مواعيد. ومع ذلك، من الملاجئ والغرف المستعارة في أنحاء "],
      [1, "فلسطين"],
      [0, "، يتقدّمون من جديد بعقولٍ "],
      [1, "متعلّمة"],
      [0, " لا تنكسر. والمدينة التي تهدّمت "],
      [1, "يعيد"],
      [0, " "],
      [1, "بناءها"],
      [0, " أبناؤها، كلمةً كلمة، ومسودةً بعد مسودة. يرفضون الحدود المفروضة عليهم. أسماؤهم لم تُعرف بعد. ليسوا أرقامًا. إنهم "],
      [1, "طلابها."]
    ]
  };

  var I18N = {
    en: {
      skipToContent: "Skip to main content", brandLine1: "Scholarships for Ghazza", brandLine2: "Supporting education through mentorship",
      navAbout: "About", navHow: "How it works", navVoices: "Testimonials", navMentors: "Mentors", navStudents: "Student handbook", newTab: " (opens in a new tab)", navCta: "Become a mentor",
      menu: "Menu", skip: "Skip intro", outro: "Here’s how the story begins.", cue: "Scroll",
      partnersTitle: "Our partners", partnersJoin: "Become a partner",
      sentence: "A highly educated Palestine, rebuilt by its own students.",
      toggleLabel: "Switch to Arabic", title: "Scholarships for Ghazza · Mentorship for students from Gaza"
    },
    ar: {
      skipToContent: "انتقل إلى المحتوى الرئيسي", brandLine1: "منح لغزة", brandLine2: "ندعم التعليم بالإرشاد",
      navAbout: "من نحن", navHow: "كيف نعمل", navVoices: "قصص النجاح", navMentors: "المرشدون", navStudents: "دليل الطالب", newTab: " (يفتح في نافذة جديدة)", navCta: "كن مرشدًا",
      menu: "القائمة", skip: "تخطَّ المقدمة", outro: "هكذا تبدأ الحكاية.", cue: "مرّر للأسفل",
      partnersTitle: "شركاؤنا", partnersJoin: "كن شريكًا",
      sentence: "فلسطين متعلّمة، يعيد بناءها طلابها.",
      toggleLabel: "Switch to English", title: "منح لغزة · إرشاد لطلاب غزة"
    }
  };

  // ---- Timeline ---------------------------------------------------------
  // After a 2s dark opening, everything is driven by one scroll position `s` (in px of wheel/touch travel).
  // Scrolling down moves the story forward, scrolling up plays it back. Segments, in order:
  //   ROLL    paragraph rises through the middle; each keyword lifts out as it crosses the centre line
  //   GATHER  the collected words come down together into the middle of the page (paragraph type)
  //   HOLD    sentence complete; the last photo is at its closest zoom
  //   SIDE    the last photo zooms out while the words glide to start alignment
  //   FADE    photo → 15%, sentence → 0, closing line rises from the bottom into the sentence's place
  var OPENING_MS = 2000, ENTRY_MS = 1000;   // entry matches the 1s transition used everywhere in the intro
  // Autoplay pace, per part of the intro
  var AUTO = {
    rollLinesPerSecond: 2.0,      // the paragraph: twice as fast as before (two lines a second)
    // every transition lasts the same: TRANSITION seconds
    gatherSeconds: 1.0,           // the sentence moving to the left (with the photo zoom-out)
    holdSeconds: 1.0,             // the settled sentence
    fadeSeconds: 1.0,             // photo → 15%, sentence → 0, closing line rises
    photoChangeSeconds: 1.0       // each photo crossfade; all four photos get the same time on screen
  };
  var ROLL_WHEEL = 0.7;           // scrolling through the paragraph by hand is also a little gentler
  var AUTO_RESUME_MS = 1400;      // after scrolling back, autoplay waits this long before carrying on
  var ZOOM = 0.12, PHOTO_FLOOR = 0.15;
  var SEG = { fly: 0.35, gather: 0.6, hold: 0.6, side: 0, fade: 1.0 };      // × viewport height (the move to the left and the zoom-out share "gather")
  var LIFT_LINE = 0.55;                          // keywords lift out where the paragraph starts to hide
  var MASK = { from: 46, to: 58, open: 0.3 };    // paragraph hidden above 46% of the screen, fully visible from 58%
  var BREAK_AFTER = { en: 3, ar: 1 };            // the sentence is set on two lines: break after this word

  var root = document.documentElement;
  var q = function (s) { return document.querySelector(s); };
  var header = q("#site-header"), intro = q("[data-intro]"), bgList = q("[data-intro-bgs]"), textLayer = q("[data-intro-text]");
  var viewport = q("[data-intro-viewport]"), poemEl = q("[data-poem]");
  var tRow = q("[data-target-row]"), tCenter = q("[data-target-center]"), tStart = q("[data-target-start]");
  var begin = q("[data-intro-begin]"), cue = q("[data-intro-cue]"), skipBtn = q("[data-skip-intro]"), srEl = q("[data-intro-sr]");
  var pics = Array.prototype.slice.call(bgList.querySelectorAll(".intro_bg"));
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var lang = "en", keys = [], flies = [], M = null;
  var s = 0, target = 0, entered = false, locked = true, finished = false;

  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function ease(x) { x = clamp(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
  function smooth(x) { x = clamp(x); return x * x * (3 - 2 * x); }
  function lerp(a, b, k) { return a + (b - a) * k; }

  // ---- Build ------------------------------------------------------------
  function build() {
    poemEl.textContent = "";
    var lead = true;
    POEM[lang].forEach(function (seg) {
      if (seg[0]) {
        var k = document.createElement("span");
        k.className = "poem_key" + (lead ? " is-lead" : "");
        k.textContent = seg[1];
        poemEl.appendChild(k);
        if (/[.]$/.test(seg[1])) lead = false;
        return;
      }
      seg[1].split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { poemEl.appendChild(document.createTextNode(part)); return; }
        var w = document.createElement("span");
        w.className = "poem_word" + (lead ? " is-lead" : "");
        w.textContent = part;
        poemEl.appendChild(w);
        if (/[.]$/.test(part)) lead = false;   // the opening shows the first sentence only
      });
    });
    keys = Array.prototype.slice.call(poemEl.querySelectorAll(".poem_key"));
    var words = keys.map(function (k) { return k.textContent; });
    [tRow, tCenter, tStart].forEach(function (el) { el.textContent = ""; });
    flies.forEach(function (f) { f.remove(); }); flies = [];
    words.forEach(function (w, i) {
      [tRow, tCenter, tStart].forEach(function (el) {
        var b = document.createElement("span"); b.textContent = w; el.appendChild(b);
        if (i === BREAK_AFTER[lang]) el.appendChild(document.createElement("br"));
        else if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
      });
      var f = document.createElement("span"); f.className = "intro_fly h1"; f.textContent = w; f.setAttribute("aria-hidden", "true");
      document.body.appendChild(f); flies.push(f);
    });
    srEl.textContent = poemEl.textContent + " " + I18N[lang].sentence + " " + I18N[lang].outro;
  }

  // ---- Measure (all positions the timeline needs) -------------------------
  function measure() {
    var vh = window.innerHeight, mid = vh * 0.5;
    textLayer.style.transform = "translate3d(0,0,0)";
    var lead = Array.prototype.slice.call(poemEl.querySelectorAll(".is-lead"));
    var leadTop = Math.min.apply(null, lead.map(function (e) { return e.getBoundingClientRect().top; }));
    var leadBottom = Math.max.apply(null, lead.map(function (e) { return e.getBoundingClientRect().bottom; }));
    var y0 = mid - (leadTop + leadBottom) / 2;              // the first sentence sits in the middle
    var flyFs = parseFloat(getComputedStyle(flies[0]).fontSize);
    var F = vh * SEG.fly;
    var src = keys.map(function (k) {
      var r = k.getBoundingClientRect();
      return { left: r.left, h: r.height, launch: Math.max(1, y0 + r.top + r.height / 2 - vh * LIFT_LINE) };
    });
    function rects(el, scale) {
      return Array.prototype.map.call(el.querySelectorAll("span"), function (c) { var r = c.getBoundingClientRect(); return { left: r.left, cy: r.top + r.height / 2, k: scale }; });
    }
    function scaleOf(el) { return parseFloat(getComputedStyle(el).fontSize) / flyFs; }
    var rowScale = scaleOf(tRow);
    var roll = src[src.length - 1].launch + F + vh * 0.05;
    var m = {
      vh: vh, mid: mid, lift: vh * LIFT_LINE, y0: y0, F: F, src: src,
      row: rects(tRow, rowScale), center: rects(tCenter, scaleOf(tCenter)), start: rects(tStart, scaleOf(tStart)),
      flyH: flies.map(function (f) { return f.offsetHeight; }),
      roll: roll,
      lh: parseFloat(getComputedStyle(poemEl).lineHeight) || 48
    };
    m.gather0 = roll;                 m.gather1 = m.gather0 + vh * SEG.gather;
    m.side0 = m.gather1 + vh * SEG.hold; m.side1 = m.side0 + vh * SEG.side;
    m.fade0 = m.side1;                m.end = m.fade0 + vh * SEG.fade;
    M = m;
    s = Math.min(s, M.end); target = Math.min(target, M.end);
    if (skipPending) { skipPending = false; setTimeout(jumpToEnd); }
  }

  function place(i, p, op) {
    var f = flies[i], h = M.flyH[i];
    f.style.transform = "translate(" + p.left.toFixed(1) + "px," + (p.cy - h * p.k / 2).toFixed(1) + "px) scale(" + p.k.toFixed(4) + ")";
    f.style.opacity = op;
  }
  function mix(a, b, k) { return { left: lerp(a.left, b.left, k), cy: lerp(a.cy, b.cy, k), k: lerp(a.k, b.k, k) }; }

  // ---- Render the whole intro for scroll position s ---------------------
  function render() {
    if (!M) return;
    var n = keys.length;

    // Paragraph roll; the hiding line slides from the top of the screen down to the middle as the roll begins
    var mk = smooth(s / (M.vh * MASK.open));
    viewport.style.setProperty("--mask-from", (MASK.from * mk).toFixed(2) + "%");
    viewport.style.setProperty("--mask-to", (MASK.to * mk).toFixed(2) + "%");
    var y = M.y0 - Math.min(s, M.roll);
    textLayer.style.transform = "translate3d(0," + y.toFixed(1) + "px,0)";
    poemEl.style.opacity = (1 - clamp((s - M.gather0) / (M.vh * SEG.gather * 0.4))).toFixed(3);

    // Hidden-sentence words
    var stg = 0.05, fadeK = clamp((s - M.fade0) / (M.vh * SEG.fade * 0.55));
    for (var i = 0; i < n; i++) {
      var sc = M.src[i], out = s >= sc.launch;
      keys[i].classList.toggle("is-out", out);
      flies[i].classList.toggle("is-on", out);
      if (!out) continue;
      var from = { left: sc.left, cy: M.lift, k: 1 };
      var p = mix(from, M.row[i], ease((s - sc.launch) / M.F));
      var g = ease((s - M.gather0) / (M.vh * SEG.gather) * (1 + n * stg) - i * stg);
      if (g > 0) p = mix(M.row[i], M.start[i], g);
      place(i, p, (1 - fadeK).toFixed(3));
    }

    // Photos: equal share each, slow zoom in, smooth crossfade into the next; the last zooms out under the sentence
    // Worked out in autoplay seconds, not scroll distance, so each photo change takes the same time
    var T = timeAt(s), slotT = timeAt(M.gather1) / pics.length, w = AUTO.photoChangeSeconds;
    pics.forEach(function (img, i) {
      var startAt = i * slotT - (i ? w / 2 : 0);
      var op = i === 0 ? 1 : smooth((T - startAt) / w);
      var z = 1 + ZOOM * clamp((T - startAt) / (slotT + w));
      if (i === pics.length - 1) {
        z = 1 + ZOOM * clamp((T - startAt) / (timeAt(M.gather0) - startAt));   // closest when the sentence completes
        z = lerp(z, 1, ease((s - M.gather0) / (M.vh * SEG.gather)));         // zooms out while the sentence moves left
      }
      img.style.opacity = op.toFixed(3);
      var flip = lang === "ar" && img.hasAttribute("data-mirror-rtl") ? -1 : 1;
      img.style.transform = "scale(" + (flip * z).toFixed(4) + "," + z.toFixed(4) + ")";
    });
    var f5 = clamp((s - M.fade0) / (M.vh * SEG.fade));
    if (entered) bgList.style.opacity = (1 - (1 - PHOTO_FLOOR) * smooth(f5)).toFixed(3);

    // Closing line rises from the bottom into the sentence's place
    var b = ease((f5 - 0.5) / 0.5);
    begin.style.opacity = b.toFixed(3);
    begin.style.transform = "translateY(calc(-50% + " + ((1 - b) * M.vh * 0.55).toFixed(1) + "px))";

    cue.classList.toggle("is-on", entered && (s < 30 || s >= M.end - 1));
    var done = s >= M.end - 0.5;
    if (done !== finished) { finished = done; intro.classList.toggle("is-finished", done); }
    if (done && locked && target >= M.end) setLocked(false);
  }

  function setLocked(v) { locked = v; root.classList.toggle("is-locked", v); if (v) window.scrollTo(0, 0); }

  var lastTick = 0, holdAuto = 0;
  function timeAt(x) {                          // autoplay seconds needed to reach timeline position x (roll + gather)
    var rr = M.lh * AUTO.rollLinesPerSecond, gr = (M.gather1 - M.gather0) / AUTO.gatherSeconds;
    return x <= M.roll ? x / rr : M.roll / rr + (x - M.roll) / gr;
  }
  function autoRate(at) {                       // px of timeline per second at position `at`
    if (at < M.roll) return M.lh * AUTO.rollLinesPerSecond;
    if (at < M.gather1) return (M.gather1 - M.gather0) / AUTO.gatherSeconds;
    if (at < M.fade0) return Math.max(1, M.fade0 - M.gather1) / AUTO.holdSeconds;
    return (M.end - M.fade0) / AUTO.fadeSeconds;
  }
  function loop(now) {
    var dt = Math.min(0.05, ((now || 0) - (lastTick || now || 0)) / 1000); lastTick = now;
    if (entered && locked && M && target < M.end && now > holdAuto) {
      target = Math.min(M.end, target + autoRate(target) * dt);
    }
    var d = target - s;
    s = Math.abs(d) < 0.3 ? target : s + d * 0.14;
    render();
    requestAnimationFrame(loop);
  }

  // ---- Input: forward and back ------------------------------------------
  function push(d) {
    if (!entered || !M) return;
    if (!locked) {
      if (window.scrollY <= 0 && d < 0) { setLocked(true); }   // scrolling back up into the intro replays it backwards
      else return;
    }
    if (d < 0) holdAuto = performance.now() + AUTO_RESUME_MS;   // going back pauses autoplay briefly
    if (target < M.roll) d *= ROLL_WHEEL;
    target = Math.max(0, Math.min(M.end, target + d));
  }
  window.addEventListener("wheel", function (e) {
    var d = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaY;
    push(Math.max(-160, Math.min(160, d)));
  }, { passive: true });
  var touchY = null;
  window.addEventListener("touchstart", function (e) { touchY = e.touches[0].clientY; }, { passive: true });
  window.addEventListener("touchmove", function (e) {
    if (touchY == null) return; var d = touchY - e.touches[0].clientY; touchY = e.touches[0].clientY; push(d * 1.6);
  }, { passive: true });
  window.addEventListener("keydown", function (e) {
    if (["ArrowDown", "PageDown", " "].indexOf(e.key) > -1) push(e.key === "ArrowDown" ? 90 : 300);
    if (["ArrowUp", "PageUp"].indexOf(e.key) > -1) push(e.key === "ArrowUp" ? -90 : -300);
  });

  // ---- Opening, skip, language ------------------------------------------
  function enter(instant) {
    poemEl.classList.remove("is-first");
    bgList.classList.add("is-in"); header.classList.add("is-ready"); skipBtn.classList.add("is-in");
    setTimeout(function () { bgList.classList.add("is-live"); entered = true; }, instant ? 0 : ENTRY_MS);
  }

  var skipPending = false;   // Skip can be pressed before the intro is first measured: jump as soon as it is
  function jumpToEnd() { if (!M) { skipPending = true; return; } target = s = M.end; render(); setLocked(false); }

  skipBtn.addEventListener("click", function (e) {
    e.preventDefault();
    if (finished) { if (window.SFGScrollTo) SFGScrollTo(q("#about")); else q("#about").scrollIntoView(); return; }
    if (!entered) enter(true);
    entered = true; jumpToEnd();
  });

  function applyStrings() {
    var dict = I18N[lang];
    root.lang = lang; root.dir = lang === "ar" ? "rtl" : "ltr";
    document.title = dict.title;
    document.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = dict[el.getAttribute("data-i18n")]; });
    if (window.SFGCascade) SFGCascade();
    q("[data-lang-toggle]").setAttribute("aria-label", "EN ع, " + dict.toggleLabel);   // the name starts with the visible text (WCAG 2.5.3)
    pics.forEach(function (img) {
      if (!img.hasAttribute("data-mirror-rtl")) return;
      if (!img.dataset.posLtr) img.dataset.posLtr = img.style.objectPosition;
      img.style.objectPosition = lang === "ar" ? img.dataset.posRtl : img.dataset.posLtr;
    });
  }
  q("[data-lang-toggle]").addEventListener("click", function () {   // the whole page changes language: reload, then return to the same place
    try {
      localStorage.setItem("sfg-lang", lang === "ar" ? "en" : "ar");
      if (finished) sessionStorage.setItem("sfg-restore", String(Math.round(scrollY)));
    } catch (e) {}
    var u = new URL(location.href); u.searchParams.set("lang", lang === "ar" ? "en" : "ar"); location.replace(u.href);   // the address always names the language shown
  });

  // ---- Menu + header state ----------------------------------------------
  var trigger = q("[data-menu-trigger]");
  // The open menu covers the page, so the page behind it is inert; focus moves into the menu and back to the trigger
  var mainEl = q("#main-content"), panel = q("#menu-panel");
  function setMenu(open, refocus) {
    document.body.classList.toggle("is-menu-open", open);
    trigger.setAttribute("aria-expanded", String(open));
    mainEl.inert = open;
    if (open) { var first = panel.querySelector("a"); if (first) setTimeout(function () { first.focus(); }, 50); }
    else if (refocus) trigger.focus();
  }
  function closeMenu() { setMenu(false, false); }
  trigger.addEventListener("click", function () { setMenu(!document.body.classList.contains("is-menu-open"), true); });
  document.querySelectorAll(".menu-panel a").forEach(function (a) { a.addEventListener("click", closeMenu); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && document.body.classList.contains("is-menu-open")) setMenu(false, true); });
  window.addEventListener("scroll", function () { header.classList.toggle("is-solid", window.scrollY > window.innerHeight - 80); }, { passive: true });
  var rz; window.addEventListener("resize", function () { clearTimeout(rz); rz = setTimeout(function () { var r = M ? s / M.end : 0; measure(); if (M) s = target = r * M.end; }, 120); });

  lang = window.SFGLang === "ar" ? "ar" : "en";   // decided once by js/i18n-ar.js (?lang=, then the saved choice)
  applyStrings();
  // Boot after fonts settle so measurements are right.
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () {
    build(); measure();
    var back = null; try { back = sessionStorage.getItem("sfg-restore"); sessionStorage.removeItem("sfg-restore"); } catch (e) {}
    if (back !== null) { enter(true); entered = true; jumpToEnd(); render(); requestAnimationFrame(function () { scrollTo(0, +back); }); return; }   // after a language switch
    if (reduce) { enter(true); entered = true; jumpToEnd(); render(); return; }
    setLocked(true); render(); requestAnimationFrame(loop);
    setTimeout(function () { enter(false); }, OPENING_MS);
  });
})();
