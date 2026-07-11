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
| Venue             | `venue.mp4`, `venue.webm`, `venue.jpg`, `venue.png` (already included) |

Tips:
- Videos are shown muted, looping, and autoplaying (`js/app.js`) so any short
  clip works well as a "living photo."
- Keep videos short and compressed (a few MB) since this is a static site with
  no server-side processing — large files will slow down first load.
- If neither a video nor an image is found for a scene, the original animated
  gradient placeholder stays in place, so the page never breaks.
