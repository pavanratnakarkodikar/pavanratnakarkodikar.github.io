# RK portfolio

Plain HTML/CSS/JS. You don't need to build anything or install any tools.

## Edit
- **Videos, reels, tools** → `content.js` (for YouTube, paste the ID after `youtu.be/`; `featured: true` puts a video in the big rows at the top)
- **Text (bio, contact, languages)** → `index.html`
- **Colours / fonts** → top of `style.css` (`--red` and `--paper` are your palette)
- **Dark mode** → the ◐ button in the top bar switches themes and remembers the choice. Link straight to it with `?theme=dark`. Dark colours are in the "dark theme" block near the end of `style.css`
- **Media** → `assets/` (hero.mp4 = top film + poster strip, profile.mp4 = poster photo, reel posters)

## Preview locally
    python3 -m http.server 8000
then open http://localhost:8000

## Host for free (your own domain)
- **Netlify**: drag this folder onto app.netlify.com/drop
- **Vercel / Cloudflare Pages / GitHub Pages**: push this folder to a repo and connect it
Then add your custom domain in that host's settings.
