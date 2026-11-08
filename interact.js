// Interactive layer: timecode HUD, melting wordmark, custom cursor,
// magnetic buttons, scroll-driven ticker, tilt cards, text scramble.
(() => {
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const pad = (n) => String(n).padStart(2, "0");

  // ── Timecode HUD + progress bar ──────────────────────────
  const bar = Object.assign(document.createElement("div"), { className: "progress" });
  const hud = Object.assign(document.createElement("div"), { className: "hud mono" });
  hud.innerHTML = '<span class="hud-rec">● REC</span><span class="hud-tc">00:00:00:00</span>';
  document.body.append(bar, hud);
  const tcEl = hud.querySelector(".hud-tc");
  const RUNTIME = 150; // seconds of "timeline" the full page maps to, at 24 fps
  const timecode = (p) => {
    const f = Math.round(p * RUNTIME * 24);
    return `00:${pad(Math.floor(f / 1440) % 60)}:${pad(Math.floor(f / 24) % 60)}:${pad(f % 24)}`;
  };

  // ── Ticker: driven by JS so scroll speed & direction push it ──
  const track = $(".ticker-track");
  document.documentElement.classList.add("js-ticker");
  let tickX = 0, tickDir = 1;

  // ── Cursor ───────────────────────────────────────────────
  let mx = -100, my = -100, cx = -100, cy = -100;
  let cursor;
  if (fine && !calm) {
    document.documentElement.classList.add("has-cursor");
    cursor = Object.assign(document.createElement("div"), { className: "cursor" });
    cursor.innerHTML = '<span class="cursor-label"></span>';
    document.body.append(cursor);
    const label = cursor.firstChild;

    $$(".feat-media").forEach((el) => (el.dataset.cursor = "Play"));
    $$(".idx-row").forEach((el) => (el.dataset.cursor = "Play"));
    $$(".reel").forEach((el) => (el.dataset.cursor = "Watch ↗︎"));

    document.addEventListener("pointerover", (e) => {
      const t = e.target.closest("[data-cursor]");
      cursor.classList.toggle("is-label", !!t);
      if (t) label.textContent = t.dataset.cursor;
    });
    document.addEventListener("mouseleave", () => cursor.classList.add("is-hidden"));
    document.addEventListener("mouseenter", () => cursor.classList.remove("is-hidden"));
  }
  addEventListener("pointermove", (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });

  const film = $(".hero-film");

  // ── Magnetic buttons ─────────────────────────────────────
  if (fine && !calm) {
    $$(".pill, .theme-toggle, .rail-ig").forEach((el) => {
      el.classList.add("magnetic");
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${dx * 0.35}px, ${dy * 0.45}px)`;
      });
      el.addEventListener("pointerleave", () => (el.style.transform = ""));
    });
  }

  // ── Tilt on featured thumbnails ──────────────────────────
  if (fine && !calm) {
    $$(".feat-media").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(1200px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg)`;
      });
      el.addEventListener("pointerleave", () => (el.style.transform = ""));
    });
  }

  // ── Text scramble on nav links ───────────────────────────
  const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/_#";
  const scramble = (el) => {
    if (el._busy) return;
    el._busy = true;
    const final = el.dataset.text || (el.dataset.text = el.textContent);
    el.style.width = el.offsetWidth + "px";
    let frame = 0;
    const total = 14;
    const step = () => {
      el.textContent = [...final].map((c, i) =>
        c === " " || i < (frame / total) * final.length ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]
      ).join("");
      if (++frame <= total) requestAnimationFrame(step);
      else { el.textContent = final; el.style.width = ""; el._busy = false; }
    };
    step();
  };
  if (!calm) $$(".top-nav a, .contact-nav a, .reel-more").forEach((el) => {
    el.classList.add("scramble");
    el.addEventListener("pointerenter", () => scramble(el));
  });

  // ── Frame loop ───────────────────────────────────────────
  let lastY = scrollY, lastT = performance.now(), vel = 0;

  const loop = (t) => {
    const dt = Math.min(64, t - lastT); lastT = t;
    const y = scrollY;
    const v = (y - lastY) / Math.max(dt, 1); lastY = y;
    vel = lerp(vel, v, 0.2);
    if (Math.abs(v) > 0.05) tickDir = v > 0 ? 1 : -1;

    // progress + timecode
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? clamp(y / max, 0, 1) : 0;
    bar.style.transform = `scaleX(${p})`;
    tcEl.textContent = timecode(p);

    if (!calm) {
      // hero film grows to full width as it scrolls into view
      const fr = film.getBoundingClientRect();
      const q = clamp((innerHeight - fr.top) / innerHeight, 0, 1);
      film.style.setProperty("--grow", (0.9 + q * 0.1).toFixed(4));

      // ticker follows scroll direction and speeds up with scroll velocity
      if (track) {
      const half = track.scrollWidth / 2;
      tickX -= tickDir * (0.6 + Math.min(Math.abs(vel) * 6, 14)) * (dt / 16);
      if (tickX <= -half) tickX += half;
      if (tickX > 0) tickX -= half;
      const skew = clamp(-vel * 3, -12, 12);
      track.style.transform = `translateX(${tickX}px) skewX(${skew}deg)`;
      }

      // cursor follows with a little lag
      if (cursor) {
        cx = lerp(cx, mx, 0.5); cy = lerp(cy, my, 0.5);
        cursor.style.transform = `translate(${cx}px, ${cy}px)`;
      }
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
})();
