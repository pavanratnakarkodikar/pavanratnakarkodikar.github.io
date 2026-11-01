# RK portfolio

Plain HTML/CSS/JS. You don't need to build anything or install any tools.

## Edit
- **Videos, reels, tools** → `content.js` (for YouTube, paste the ID after `youtu.be/`; `featured: true` puts a video in the big rows at the top)
- **Text (bio, contact, languages)** → `index.html`
- **Colours / fonts** → top of `style.css` (`--red` and `--paper` are your palette)
- **Brand** → follows `../brand/rk-brand-guidelines.pdf`: bolt (top bar, favicon, pre-roll) and rk. (hero) never side by side
- **Display font** → Kaneda Gothic Bold once web-licensed: add its `.woff2` to `assets/`, an `@font-face` named "Kaneda Gothic" in `style.css`, and it replaces the Anton stand-in
- **Dark mode** → the ◐ button in the top bar switches themes and remembers the choice. Link straight to it with `?theme=dark`. Dark colours are in the "dark theme" block near the end of `style.css`
- **Media** → `assets/` (hero.mp4 = top film + poster strip, profile.mp4 = poster photo, reel posters)

## Preview locally
    python3 -m http.server 8000
then open http://localhost:8000

## Live site
https://pavanratnakarkodikar.github.io (GitHub Pages, from the `main` branch of
github.com/pavanratnakarkodikar/pavanratnakarkodikar.github.io)

To publish changes: commit and push to `main`; Pages rebuilds in about a minute.
Without git, you can also edit or upload files directly on the repo's GitHub page.
