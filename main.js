(() => {
  const data = window.PORTFOLIO;
  const $ = (s) => document.querySelector(s);
  const thumb = (id, q = "maxresdefault") => `https://i.ytimg.com/vi/${id}/${q}.jpg`;
  const esc = (s = "") => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const pad = (n, w = 2) => String(n).padStart(w, "0");
  const img = (id, eager) =>
    `<img src="${thumb(id)}" alt="" loading="${eager ? "eager" : "lazy"}" onerror="this.onerror=null;this.src='${thumb(id, "hqdefault")}'">`;

  const featured = data.youtube.filter((v) => v.featured);
  const rest = data.youtube.filter((v) => !v.featured);

  // Featured rows
  $("#featured").innerHTML = featured.map((v, i) => `
    <article class="feat reveal">
      <button class="feat-media" data-yt="${v.id}" aria-label="Play ${esc(v.title)}">
        ${img(v.id, i === 0)}
        <span class="halftone" aria-hidden="true"></span>
        <span class="num feat-num">${pad(i + 1, 3)}</span>
      </button>
      <div class="feat-info">
        <div>
          <h3>${esc(v.title)}</h3>
          <p>${esc(v.subtitle || v.client)}</p>
        </div>
        <div class="feat-foot">
          <ul class="mono">${(v.tags || []).map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
          <button class="pill pill--solid" data-yt="${v.id}">Play ▶</button>
        </div>
      </div>
    </article>`).join("");

  // Index list
  $("#idx").innerHTML = rest.map((v, i) => `
    <li>
      <button class="idx-row" data-yt="${v.id}" data-thumb="${thumb(v.id, "hqdefault")}">
        <span class="num idx-num">${pad(featured.length + i + 1, 3)}</span>
        <span class="idx-title">${esc(v.title)}</span>
        <span class="mono idx-client">${esc(v.client)}</span>
        <span class="idx-play" aria-hidden="true">▶</span>
        <img class="idx-thumb" src="${thumb(v.id, "mqdefault")}" alt="" loading="lazy">
      </button>
    </li>`).join("");

  // Reels — editorial stagger
  $("#reels").innerHTML = data.reels.map((r, i) => `
    <a class="reel reel--${i + 1} reveal" href="${r.url}" target="_blank" rel="noopener">
      <span class="mono reel-more">Watch on Instagram ↗</span>
      <span class="reel-img"><img src="${r.poster}" alt="${esc(r.title)}" loading="lazy"></span>
      <span class="reel-cap mono"><b>${esc(r.title)}</b> — ${esc(r.client)}.<br>${esc(r.note || "")}</span>
    </a>`).join("");

  $("#tools-list").innerHTML = data.tools.map((t) =>
    `<li><a href="${t.url}" target="_blank" rel="noopener">${esc(t.name)}</a></li>`).join("");

  $("#year").textContent = new Date().getFullYear();

  // Fit giant words (hero option B) to their container width
  const fitAll = () => document.querySelectorAll(".fit").forEach((el) => {
    if (!el.offsetParent) return;
    el.style.fontSize = "100px";
    el.style.fontSize = (100 * el.parentElement.clientWidth) / el.scrollWidth + "px";
  });
  // Poster hero: the portrait frame replaces one letter of the name (RE·MA style)
  const pdWord = document.querySelector(".pd-name .fit");
  if (pdWord) pdWord.innerHTML = [...pdWord.textContent].map((c) => `<span class="pd-l">${c}</span>`).join("");
  // The frame's closed size (the letter) and open size (the full 4:5 portrait), stored for the stretch interaction
  const stretchTo = (frame, t) => {
    const g = frame._geo; if (!g) return;
    frame._t = t;
    frame.style.left = g.l + (g.fl - g.l) * t + "px";
    frame.style.width = g.w + (g.fw - g.w) * t + "px";
    frame.classList.toggle("is-open", t > 0.9);
  };
  const placeFrame = () => {
    // measurements are relative to the artboard, so the composition is the same at any screen size
    const hero = document.querySelector(".pd-board"), frame = document.querySelector(".pd-frame");
    if (!hero || !frame || !hero.offsetParent) return;
    const phone = innerWidth < 760;
    // KODIKAR is fitted to the width, then stretched so its LETTERS run from just under the name strip
    // to the bottom of the artboard. We measure the actual glyph outlines (via canvas text metrics),
    // not the line box, so it's right with Kaneda Gothic or the Anton fallback (Brave, and any visitor
    // without Kaneda, sees Anton, whose letters sit differently in the line box). Layout boxes
    // (offsetTop) are used for positions, so the entrance animation can't skew anything.
    const word = hero.querySelector(".pd-name .fit"), credit = hero.querySelector(".pd-credit"), name = hero.querySelector(".pd-name");
    word.style.transform = "";
    const top = credit.offsetTop + credit.offsetHeight + (phone ? 22 : hero.clientWidth * 0.022); // gap scales with the artboard
    const floor = hero.clientHeight - (phone ? 14 : 0);                                              // where the letters end
    const glyphs = () => {
      const cs = getComputedStyle(word), ctx = (placeFrame.ctx ||= document.createElement("canvas").getContext("2d"));
      ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const t = ctx.measureText(word.textContent), lh = word.offsetHeight;
      const base = (lh - (t.fontBoundingBoxAscent + t.fontBoundingBoxDescent)) / 2 + t.fontBoundingBoxAscent; // baseline inside the line box
      const boxTop = name.offsetTop + word.offsetTop;
      return { top: boxTop + base - t.actualBoundingBoxAscent, bottom: boxTop + base + t.actualBoundingBoxDescent, inBoxBottom: base + t.actualBoundingBoxDescent };
    };
    let gl = glyphs();
    // short windows: the width-fitted letters are already taller than the room, so shrink the word to fit
    if (gl.bottom - gl.top > floor - top) {
      word.style.fontSize = parseFloat(word.style.fontSize) * ((floor - top) / (gl.bottom - gl.top)) * 0.99 + "px";
      gl = glyphs();
    }
    const s = Math.max(1, (floor - top) / (gl.bottom - gl.top));
    // stretch from the letters' bottom edge, and move that edge onto the floor
    word.style.transformOrigin = `50% ${gl.inBoxBottom}px`;
    word.style.transform = `translateY(${(floor - gl.bottom).toFixed(1)}px) scaleY(${s.toFixed(3)})`;
    // the portrait fills the O: same letter height, the O's own width
    const oEl = hero.querySelectorAll(".pd-l")[+(name.dataset.swap || 0)];
    const oLeft = name.offsetLeft + word.offsetLeft + oEl.offsetLeft, oW = oEl.offsetWidth;
    const p = oW * (phone ? 0.12 : 0.06);
    const l = oLeft - p, w = oW + p * 2, h = floor - top;
    frame.style.top = top + "px";
    frame.style.height = h + "px";
    const fw = Math.max(w, Math.min(h * 0.8, hero.clientWidth - 32));
    const fl = Math.min(Math.max(l + w / 2 - fw / 2, 16), hero.clientWidth - 16 - fw);
    frame._geo = { l, w, fw, fl };
    stretchTo(frame, frame._t || 0);
  };

  // Drag the photo sideways to stretch the O open (either direction); release snaps it open or shut; a tap toggles.
  // The snap is animated like a cel animator would: a small wind-up the other way (anticipation), a smooth
  // ease in and out, a slight overshoot that settles (follow through), and the frame goes short and wide while it
  // travels fast, then a touch tall as it lands (squash and stretch, keeping its volume).
  const pdFrame = document.querySelector(".pd-frame");
  if (pdFrame) {
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let x0 = 0, t0 = 0, dragging = false, raf = 0, lastT = 0, vel = 0;
    const squash = (sy) => { pdFrame.style.transform = Math.abs(sy - 1) < 0.001 ? "" : `scale(${(1 / Math.sqrt(sy)).toFixed(4)}, ${sy.toFixed(4)})`; };
    const inOut = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
    const out = (p) => 1 - Math.pow(1 - p, 3);
    const animateTo = (target, windUp = true) => {
      cancelAnimationFrame(raf);
      const from = pdFrame._t || 0, dir = target > from ? 1 : -1, dist = Math.abs(target - from);
      if (still || dist < 0.001) { stretchTo(pdFrame, target); squash(1); return; }
      const A = windUp ? 170 : 0, M = 380 + 260 * dist, S = 320;          // ms: anticipation, move, settle
      const back = from - dir * 0.05, over = target + dir * 0.05 * dist;    // wind-up and overshoot points
      const start = performance.now();
      const step = (now) => {
        const e = now - start; let t, sy = 1;
        if (e < A) {                                     // anticipation: ease back a little, rising tall
          const p = inOut(e / A); t = from + (back - from) * p; sy = 1 + 0.035 * Math.sin(Math.PI * Math.min(1, e / A * 1.4));
        } else if (e < A + M) {                          // action: ease in, ease out, squash by speed
          const p = (e - A) / M, q = inOut(p), b0 = windUp ? back : from;
          t = b0 + (over - b0) * q;
          const speed = p < 0.5 ? 12 * p * p : 12 * (1 - p) * (1 - p); // derivative of the curve, peaks at 3
          sy = 1 - 0.1 * (speed / 3) * Math.min(1, dist * 1.5);
        } else if (e < A + M + S) {                      // follow through: settle from the overshoot, tall on landing
          const p = (e - A - M) / S; t = over + (target - over) * out(p);
          sy = 1 + 0.04 * Math.sin(Math.PI * p) * (1 - p) * Math.min(1, dist * 1.5);
        } else { stretchTo(pdFrame, target); squash(1); return; }
        stretchTo(pdFrame, t); squash(sy);
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    // the entrance animation holds the frame's transform; release it once it has played so the squash can run
    pdFrame.addEventListener("animationend", () => (pdFrame.style.animation = "none"));
    pdFrame.addEventListener("pointerdown", (e) => {
      cancelAnimationFrame(raf); squash(1);
      pdFrame.style.animation = "none";
      x0 = e.clientX; lastT = performance.now(); vel = 0;
      t0 = pdFrame._t || 0; dragging = false;
      pdFrame.setPointerCapture(e.pointerId);
    });
    pdFrame.addEventListener("pointermove", (e) => {
      if (!pdFrame.hasPointerCapture(e.pointerId) || !pdFrame._geo) return;
      const dx = Math.abs(e.clientX - x0);
      if (!dragging && dx < 6) return;
      dragging = true; pdFrame.classList.add("is-dragging");
      const span = Math.max(1, pdFrame._geo.fw - pdFrame._geo.w), before = pdFrame._t || 0;
      stretchTo(pdFrame, Math.min(1, Math.max(0, t0 + (t0 < 0.5 ? 1 : -1) * (dx * 2) / span)));
      const now = performance.now();
      vel = ((pdFrame._t - before) / Math.max(1, now - lastT)) * 1000; lastT = now;
    });
    const release = () => {
      pdFrame.classList.remove("is-dragging");
      if (dragging) {
        // carry the hand's momentum into the spring; a quick flick decides the direction on its own
        const t = pdFrame._t || 0;
        animateTo(Math.abs(vel) > 1.5 ? (vel > 0 ? 1 : 0) : t > 0.5 ? 1 : 0, false); // a quick flick decides on its own
      } else {
        animateTo(t0 > 0.5 ? 0 : 1);
      }
    };
    pdFrame.addEventListener("pointerup", release);
    pdFrame.addEventListener("pointercancel", () => { pdFrame.classList.remove("is-dragging"); animateTo(t0, false); });
  }

  // Contact: LET'S TALK fitted to the width, then stretched tall like the phone intro
  const stretchContact = () => {
    const ct = document.querySelector(".contact-title .fit");
    if (!ct) return;
    ct.style.transform = "";
    const h0 = ct.getBoundingClientRect().height;
    ct.style.transform = "scaleY(1.7)";
    ct.parentElement.style.height = h0 * 1.7 + "px";
  };

  const layout = () => { fitAll(); placeFrame(); stretchContact(); };
  layout();
  document.fonts && document.fonts.ready.then(layout);
  // the word rises in on load; measure again once it has landed
  const pdName = document.querySelector(".pd-name");
  if (pdName) pdName.addEventListener("animationend", layout);
  addEventListener("resize", layout);

  // Lightbox player
  const box = $("#lightbox"), player = $("#player");
  document.addEventListener("click", (e) => {
    const c = e.target.closest("[data-yt]");
    if (!c) return;
    player.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${c.dataset.yt}?autoplay=1&rel=0"
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    box.showModal();
  });
  box.addEventListener("close", () => (player.innerHTML = ""));
  $(".lightbox-close").addEventListener("click", () => box.close());
  box.addEventListener("click", (e) => { if (e.target === box) box.close(); });

  // Hover preview that follows the cursor on index rows (mouse only)
  const peek = $("#peek"), peekImg = peek.querySelector("img");
  if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll(".idx-row").forEach((row) => {
      row.addEventListener("mouseenter", () => { peekImg.src = row.dataset.thumb; peek.classList.add("on"); });
      row.addEventListener("mouseleave", () => peek.classList.remove("on"));
    });
    addEventListener("mousemove", (e) => {
      peek.style.transform = `translate(${e.clientX + 24}px, ${e.clientY - 90}px)`;
    });
  }

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
})();

// Light / dark toggle (remembered per visitor)
(() => {
  const root = document.documentElement, btn = document.getElementById("theme-toggle");
  const meta = document.querySelector('meta[name="theme-color"]');
  const apply = (t) => {
    if (t === "dark") root.dataset.theme = "dark"; else delete root.dataset.theme;
    meta.content = t === "dark" ? "#0c0c0c" : "#f9f9f9";
    btn.setAttribute("aria-label", t === "dark" ? "Switch to light mode" : "Switch to dark mode");
  };
  apply(root.dataset.theme || "light");
  btn.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    apply(next);
    try { localStorage.setItem("rk-theme", next); } catch (e) {}
  });
})();
