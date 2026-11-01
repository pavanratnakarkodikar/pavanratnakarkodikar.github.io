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
  $("#featured-count").textContent = pad(featured.length, 3);
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
      <span class="reel-cap mono"><b class="num">${pad(i + 1, 3)}</b> ${esc(r.title)} — ${esc(r.client)}.<br>${esc(r.note || "")}</span>
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
  const placeFrame = () => {
    const hero = document.querySelector(".hero-d"), frame = document.querySelector(".pd-frame");
    if (!hero || !frame || !hero.offsetParent) return;
    if (innerWidth < 760) { // phones: KODIKAR stretched tall, portrait in the O

      // KODIKAR stays upright, fitted to the width, then stretched to fill everything under the credit block;
      // the portrait then takes the O's place at the stretched size
      const word = hero.querySelector(".pd-name .fit"), credit = hero.querySelector(".pd-credit");
      const top = credit.getBoundingClientRect().bottom - hero.getBoundingClientRect().top + 22;
      const avail = hero.clientHeight - top - 14;
      word.style.transform = "";
      const h = word.getBoundingClientRect().height;
      word.style.transform = `scaleY(${Math.max(1, avail / h).toFixed(3)})`;
      const hr2 = hero.getBoundingClientRect(), o = hero.querySelectorAll(".pd-l")[+(hero.querySelector(".pd-name").dataset.swap || 0)].getBoundingClientRect();
      const p2 = o.width * 0.12;
      frame.style.left = o.left - hr2.left - p2 + "px";
      frame.style.width = o.width + p2 * 2 + "px";
      frame.style.top = o.top - hr2.top + "px";
      frame.style.height = o.height + "px";
      return;
    }
    hero.querySelector(".pd-name .fit").style.transform = ""; // no stretch on wide screens
    frame.style.top = "";
    const swap = +(hero.querySelector(".pd-name").dataset.swap || 0); // which letter the portrait replaces (1 = the O in KODIKAR)
    const letter = hero.querySelectorAll(".pd-l")[swap];
    const hr = hero.getBoundingClientRect(), lr = letter.getBoundingClientRect();
    const pad = lr.width * 0.06;
    frame.style.left = lr.left - hr.left - pad + "px";
    frame.style.width = lr.width + pad * 2 + "px";
    frame.style.height = Math.min(hr.height * 0.86, (hr.bottom - lr.top) * 1.32) + "px";
  };
  const layout = () => { fitAll(); placeFrame(); };
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
