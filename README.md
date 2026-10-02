# #UPWAN — Pawan & Upasana Wedding Invitation

A single-page, mobile-first wedding invitation: a gold wax-seal envelope that
opens into a scroll-snap journey through each ceremony. There's no separate
venue page — each ceremony scene carries its own address, "+ Add to Calendar"
link, and "Get Directions" link, since different ceremonies run at different
venues for some guests (see Audience-specific invites below).

Plain HTML/CSS/JS — no build step, no dependencies. Open `index.html` directly
or deploy it as-is to GitHub Pages.

## Structure

```
index.html            Markup for both pages (envelope + ceremony scenes) — full guest list, all 4 ceremonies
f/index.html            Friends invite  — Sangeet, Shubh Vivah & Reception (no Haldi)
br/index.html           Bride-side relatives invite — Haldi, Sangeet & Shubh Vivah (no Reception)
gr/index.html           Groom-side relatives invite — Haldi, Shubh Vivah & Reception (no Sangeet)
css/style.css          All styling, animations, and color variables (shared by every page above)
js/app.js               Envelope open sequence, media loader, music toggle (shared)
assets/audio/           Background music (aaj-se-teri.mp4)
assets/media/           Ceremony photos/videos (see assets/media/README.md)
```

### Audience-specific invites (`/f`, `/br`, `/gr`)

`f/index.html`, `br/index.html`, and `gr/index.html` are each a filtered copy of
the root `index.html`, with the ceremony `<section class="scene ...">` block(s)
that audience isn't invited to deleted outright (not just hidden) — the
envelope, Save the Date, and Thank You scenes stay the same for everyone.
Nothing else needs to change: `js/app.js` builds the side dot-nav,
per-ceremony countdowns, and "+ Add to Calendar" links by scanning whatever
scene sections actually exist in the page, so removing a section's HTML is
the only step needed.

Haldi and Reception currently run at a different venue (Hartapa) than Sangeet
and Shubh Vivah (Hotel Neelesh Inn) for some audiences — each ceremony scene's
`.scene-address` paragraph and its "Get Directions" link are set per-scene to
match, so the three pages don't necessarily agree on where a same-named
ceremony happens (e.g. Haldi is at Hartapa in `gr/` but at Neelesh in `br/`).
Check `.scene-address` and the `.direction-link` href together whenever a
ceremony's venue changes.

Each variant has a `<base href="../">` tag in its `<head>` so its
`css/style.css`, `js/app.js`, and `assets/...` references resolve back up to
the shared files at the repo root — do **not** add a `/` in front of those
paths or copy the shared files into `f/`, `br/`, `gr/`.

**Keeping them in sync:** since there's no build step, any edit to shared
content — names, dates, colors, music — has to be made in all 4 files
(`index.html`, `f/`, `br/`, `gr/`). Ceremony-specific details (date/time text,
address, directions link, that ceremony's media) only need editing in the
files that still contain that ceremony's scene — and only for the audiences
that ceremony is actually at that venue for.

Share the links as `https://<username>.github.io/<repo>/f/`,
`.../br/`, and `.../gr/`.

## Customize

**Names, dates, addresses, copy** — edit the text directly in `index.html`;
each ceremony is its own `<section class="scene ...">` block, with its own
`.scene-date` and `.scene-address` lines.

**Colors** — edit the CSS variables at the top of `css/style.css`:

```css
:root {
  --accent: #D4AF37;        /* gold accent — try #C9A227, #E8C77E, #B7935A */
  --envelope-deep: #3a0d13;  /* outer background */
  --envelope-bg: ...;        /* envelope/card gradient */
  --flap-bg: ...;            /* envelope flap gradient */
}
```

A "Deep Green" alternative palette is included as a commented block right
below — uncomment it (and remove the red one) to switch the whole invitation's
tone in one edit.

**Ceremony photos/videos** — drop files into `assets/media/` using the naming
convention documented in `assets/media/README.md` (e.g. `haldi.mp4` or
`haldi.jpg`). The page detects and swaps them in automatically; until then,
each scene shows an elegant animated placeholder.

**Music** — currently `assets/audio/aaj-se-teri.mp4`. Replace it with a
different track any time (keep the same filename, or update the `<source>`
path/type in `index.html`).

**Countdown + Add to Calendar + Get Directions** — each ceremony scene has its
own live countdown and, right under its date/address, an "+ Add to Calendar"
link and a "Get Directions" link (`.scene-links` wrapper). The calendar link's
title/time come from the `CEREMONY_EVENTS` object in `js/app.js` — update it
if a ceremony's date/time changes; its location is read straight from that
scene's own `.scene-address` text at runtime (`VENUE_LOCATION` in `js/app.js`
is only a fallback), so editing the address paragraph is enough to update the
calendar link too. The "Get Directions" link is a plain static link in the
HTML — update its `href` directly if a venue's map link changes.

## Run locally

Just open `index.html` in a browser, or serve it so relative asset paths and
autoplay policies behave exactly like production:

```bash
npx serve .
# or
python -m http.server 8000
```

## Deploy to GitHub Pages

1. Push this folder as a repo to GitHub (or a subfolder — adjust the Pages
   source accordingly).
2. In the repo's **Settings → Pages**, set the source to the branch you pushed
   (e.g. `main`) and the root folder.
3. GitHub will publish it at `https://<username>.github.io/<repo>/`.

No build step is required — it's plain static files.
