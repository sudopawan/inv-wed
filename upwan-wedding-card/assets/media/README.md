# Ceremony media

<!-- add_placeholder: haldi, sangeet, vivah, reception media files go in this folder -->

Drop your own photos or short looping videos in this folder using the filenames
below. The page automatically checks for each one (video first, then image) and
swaps it in over the animated placeholder — no code changes needed, just add the
file and refresh.

| Scene            | Expected filename (first match wins)                          |
|-------------------|----------------------------------------------------------------|
| Haldi             | `haldi.mp4`, `haldi.webm`, `haldi.jpg`, `haldi.png`             |
| Sangeet           | `sangeet.mp4`, `sangeet.webm`, `sangeet.jpg`, `sangeet.png`     |
| Shubh Vivah       | `vivah.mp4`, `vivah.webm`, `vivah.jpg`, `vivah.png`             |
| Grand Reception   | `reception.mp4`, `reception.webm`, `reception.jpg`, `reception.png` |

The Venue scene doesn't show a photo or map — it's text-only (a short Bhimtal
description, directions link, and travel tips), so a `venue.*` file in this
folder isn't used by the page (safe to remove if it's just taking up space in
the repo).

Tips:
- Videos are shown muted, looping, and autoplaying (`js/app.js`) so any short
  clip works well as a "living photo."
- Keep videos short and compressed (a few MB) since this is a static site with
  no server-side processing — large files will slow down first load.
- If neither a video nor an image is found for a scene, the original animated
  gradient placeholder stays in place, so the page never breaks.
