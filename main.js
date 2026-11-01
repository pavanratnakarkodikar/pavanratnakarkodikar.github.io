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
    frame.classList.toggle("is-open", t > 0.98);
  };
  const placeFrame = () => {
    const hero = document.querySelector(".hero-d"), frame = document.querySelector(".pd-frame");
    if (!hero || !frame || !hero.offsetParent) return;
    const word = hero.querySelector(".pd-name .fit");
    const letterOf = () => hero.querySelectorAll(".pd-l")[+(hero.querySelector(".pd-name").dataset.swap || 0)]; // 1 = the O in KODIKAR
    let l, w, h;
    if (innerWidth < 760) {
      // phones: KODIKAR upright, fitted to the width, then stretched to fill everything under the credit block
      const credit = hero.querySelector(".pd-credit");
      const top = credit.getBoundingClientRect().bottom - hero.getBoundingClientRect().top + 22;
      word.style.transform = "";
      word.style.transform = `scaleY(${Math.max(1, (hero.clientHeight - top - 14) / word.getBoundingClientRect().height).toFixed(3)})`;
      const hr = hero.getBoundingClientRect(), o = letterOf().getBoundingClientRect(), p = o.width * 0.12;
      l = o.left - hr.left - p; w = o.width + p * 2; h = o.height;
      frame.style.top = o.top - hr.top + "px";
    } else {
      word.style.transform = ""; // no stretch on wide screens
      frame.style.top = "";
      const hr = hero.getBoundingClientRect(), lr = letterOf().getBoundingClientRect(), p = lr.width * 0.06;
      // height from the word's layout box (not its on-screen rect, which the entrance animation is still moving)
      l = lr.left - hr.left - p; w = lr.width + p * 2; h = Math.min(hr.height * 0.86, word.offsetHeight * 1.27);
    }
    frame.style.height = h + "px";
    const fw = Math.max(w, Math.min(h * 0.8, hero.clientWidth - 32));
    const fl = Math.min(Math.max(l + w / 2 - fw / 2, 16), hero.clientWidth - 16 - fw);
    frame._geo = { l, w, fw, fl };
    stretchTo(frame, frame._t || 0);
  };

  // Drag the photo sideways to stretch the O open (either direction); release snaps it open or shut; a tap toggles
  const pdFrame = document.querySelector(".pd-frame");
  if (pdFrame) {
    let x0 = 0, t0 = 0, dragging = false;
    pdFrame.addEventListener("pointerdown", (e) => {
      x0 = e.clientX; t0 = pdFrame._t || 0; dragging = false;
      pdFrame.setPointerCapture(e.pointerId);
    });
    pdFrame.addEventListener("pointermove", (e) => {
      if (!pdFrame.hasPointerCapture(e.pointerId) || !pdFrame._geo) return;
      const dx = Math.abs(e.clientX - x0);
      if (!dragging && dx < 6) return;
      dragging = true; pdFrame.classList.add("is-dragging");
      const span = Math.max(1, pdFrame._geo.fw - pdFrame._geo.w);
      stretchTo(pdFrame, Math.min(1, Math.max(0, t0 + (t0 < 0.5 ? 1 : -1) * (dx * 2) / span)));
    });
    const release = () => {
      pdFrame.classList.remove("is-dragging");
      stretchTo(pdFrame, dragging ? ((pdFrame._t || 0) > 0.5 ? 1 : 0) : (t0 > 0.5 ? 0 : 1));
    };
    pdFrame.addEventListener("pointerup", release);
    pdFrame.addEventListener("pointercancel", () => { pdFrame.classList.remove("is-dragging"); stretchTo(pdFrame, t0); });
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
