(() => {
  const data = window.PORTFOLIO;
  const $ = (s) => document.querySelector(s);
  const thumb = (id, q = "maxresdefault") => `https://i.ytimg.com/vi/${id}/${q}.jpg`;
  const esc = (s = "") => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const pad = (n) => String(n).padStart(2, "0");
  const img = (id, eager) =>
    `<img src="${thumb(id)}" alt="" loading="${eager ? "eager" : "lazy"}" onerror="this.onerror=null;this.src='${thumb(id, "hqdefault")}'">`;

  const featured = data.youtube.filter((v) => v.featured);
  const rest = data.youtube.filter((v) => !v.featured);

  // Featured rows
  $("#featured-count").textContent = `(${pad(featured.length)})`;
  $("#featured").innerHTML = featured.map((v, i) => `
    <article class="feat reveal">
      <button class="feat-media" data-yt="${v.id}" aria-label="Play ${esc(v.title)}">
        ${img(v.id, i === 0)}
        <span class="halftone" aria-hidden="true"></span>
        <span class="mono feat-num">${pad(i + 1)}</span>
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
        <span class="mono">${pad(featured.length + i + 1)}</span>
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
      <span class="reel-cap mono"><b>${pad(i + 1)}/</b> ${esc(r.title)} — ${esc(r.client)}.<br>${esc(r.note || "")}</span>
    </a>`).join("");

  $("#tools-list").innerHTML = data.tools.map((t) =>
    `<li><a href="${t.url}" target="_blank" rel="noopener">${esc(t.name)}</a></li>`).join("");

  $("#year").textContent = new Date().getFullYear();

  // Fit giant words to their container width
  const fitAll = () => document.querySelectorAll(".fit").forEach((el) => {
    el.style.fontSize = "100px";
    const w = el.parentElement.clientWidth;
    el.style.fontSize = (100 * w) / el.scrollWidth + "px";
  });
  fitAll();
  document.fonts && document.fonts.ready.then(fitAll);
  addEventListener("resize", fitAll);

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
