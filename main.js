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
  // Motion in the style of Apple's interfaces: a critically damped spring (SwiftUI-style response / damping),
  // so it accelerates and settles smoothly with almost no bounce, keeps the speed of your hand when you let go,
  // and can be grabbed again mid-move. The portrait eases from a slight zoom to rest as it opens.
  const pdFrame = document.querySelector(".pd-frame");
  if (pdFrame) {
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let x0 = 0, t0 = 0, dragging = false, raf = 0, lastT = 0, vel = 0, v = 0;
    const response = 0.62, damping = 0.9;                                  // seconds, fraction of critical
    const k = Math.pow((2 * Math.PI) / response, 2), c = (4 * Math.PI * damping) / response;
    const show = (t) => { stretchTo(pdFrame, t); pdFrame.style.setProperty("--reveal", Math.min(1, Math.max(0, t)).toFixed(4)); };
    const animateTo = (target, v0 = 0) => {
      cancelAnimationFrame(raf);
      if (still) { show(target); return; }
      let t = pdFrame._t || 0, prev = performance.now(); v = v0;
      const step = (now) => {
        let dt = Math.min(0.05, (now - prev) / 1000); prev = now;
        while (dt > 0) { const h = Math.min(dt, 1 / 240); v += (k * (target - t) - c * v) * h; t += v * h; dt -= h; }
        if (Math.abs(v) < 0.005 && Math.abs(target - t) < 0.001) { v = 0; show(target); return; }
        show(t);
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    // the entrance animation holds the frame's transform; release it once it has played so it can be grabbed straight away
    pdFrame.addEventListener("animationend", () => (pdFrame.style.animation = "none"));
    pdFrame.addEventListener("pointerdown", (e) => {
      cancelAnimationFrame(raf); v = 0;
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
      show(Math.min(1, Math.max(0, t0 + (t0 < 0.5 ? 1 : -1) * (dx * 2) / span)));
      const now = performance.now();
      vel = ((pdFrame._t - before) / Math.max(1, now - lastT)) * 1000; lastT = now;
    });
    const release = () => {
      pdFrame.classList.remove("is-dragging");
      if (dragging) {
        // carry the hand's momentum into the spring; a quick flick decides the direction on its own
        const t = pdFrame._t || 0;
        animateTo(Math.abs(vel) > 1.5 ? (vel > 0 ? 1 : 0) : t > 0.5 ? 1 : 0, Math.max(-8, Math.min(8, vel)));
      } else {
        animateTo(t0 > 0.5 ? 0 : 1);
      }
    };
    pdFrame.addEventListener("pointerup", release);
    pdFrame.addEventListener("pointercancel", () => { pdFrame.classList.remove("is-dragging"); animateTo(t0); });
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
  box.addEventListener("close", () => { player.innerHTML = ""; window.lenis && lenis.start(); });
  new MutationObserver(() => box.open && window.lenis && lenis.stop()).observe(box, { attributes: true, attributeFilter: ["open"] });
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

  // Reveal on scroll: titles and blocks glide up as they enter; rows in a list follow each other a beat apart
  document.querySelectorAll(".sec-title, .label-row, .about-copy, .about-facts, .profile, .contact-meta, .contact-title, .contact-mail, .contact-grid")
    .forEach((el) => el.classList.add("reveal"));
  document.querySelectorAll("#idx > li").forEach((el, i) => { el.classList.add("reveal"); el.style.setProperty("--d", (i % 6) * 0.05 + "s"); });
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
})();

// Smooth scrolling with inertia, like Apple's pages: the wheel and trackpad glide and ease to a stop.
// Touch screens keep their native scrolling, which is already smooth. Off for reduced motion.
(() => {
  if (!window.Lenis || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const lenis = (window.lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 }));
  const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
  // in-page links glide to their section with an ease-out, landing just under the sticky header
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href"), target = id === "#" ? 0 : document.querySelector(id);
    if (target === null) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: target ? -document.querySelector(".top").offsetHeight : 0, duration: 1.4, easing: (x) => 1 - Math.pow(1 - x, 4) });
  });
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
