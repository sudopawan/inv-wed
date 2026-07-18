# #UPWAN — Pawan & Upasana Wedding Invitation

A single-page, mobile-first wedding invitation: a gold wax-seal envelope that
opens into a scroll-snap journey through each ceremony, ending with the venue
and an RSVP that opens WhatsApp with a pre-filled message.

Plain HTML/CSS/JS — no build step, no dependencies. Open `index.html` directly
or deploy it as-is to GitHub Pages.

## Structure

```
index.html            Markup for both pages (envelope + ceremony scenes)
css/style.css          All styling, animations, and color variables
js/app.js               Envelope open sequence, media loader, RSVP, music toggle
assets/audio/           Background music (aaj-se-teri.mp4)
assets/media/           Ceremony photos/videos (see assets/media/README.md)
```

## Customize

**Names, dates, venue, copy** — edit the text directly in `index.html`; each
ceremony is its own `<section class="scene ...">` block.

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

**RSVP WhatsApp number** — open `js/app.js` and replace the
`RSVP_WHATSAPP_NUMBER` constant near the top with the family's WhatsApp number
(country code + number, digits only).

**Music** — currently `assets/audio/aaj-se-teri.mp4`. Replace it with a
different track any time (keep the same filename, or update the `<source>`
path/type in `index.html`).

**Countdown + Add to Calendar** — each ceremony scene has its own live
countdown and a "+ Add to Calendar" link right under its date, both driven by
the `CEREMONY_EVENTS` object in `js/app.js` — update it if any ceremony's
date/time changes, and update `VENUE_LOCATION` if
the venue does.

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
