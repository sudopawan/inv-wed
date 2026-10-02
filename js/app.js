// #UPWAN — Pawan & Upasana wedding invitation
// Envelope open animation, ceremony media loader, music toggle.

(() => {
  'use strict';

  const ACCENT = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#D4AF37';
  const PETAL_PALETTE = ['#E8963A', '#C9A227', ACCENT, '#B5442E'];

  // ---- ELEMENTS -------------------------------------------------------------
  const flap = document.getElementById('envelopeFlap');
  const glow = document.getElementById('envelopeGlow');
  const sealBtn = document.getElementById('sealBtn');
  const sealHalo = document.getElementById('sealHalo');
  const sealBurst = document.getElementById('sealBurst');
  const sealParticles = document.getElementById('sealParticles');
  const page1Hint = document.getElementById('page1Hint');
  const page1 = document.getElementById('page1');
  const page2 = document.getElementById('page2');
  const petalShower = document.getElementById('petalShower');
  const greetingOverlay = document.getElementById('greetingOverlay');
  const backBtn = document.getElementById('backBtn');

  let opened = false;

  // ---- ENVELOPE OPEN SEQUENCE ------------------------------------------------
  function handleSealClick() {
    if (opened) return;
    opened = true;

    sealBtn.classList.add('cracking');
    sealHalo.classList.add('cracking');
    sealBurst.classList.add('cracking');
    spawnBurstParticles();
    page1Hint.classList.add('fade');

    setTimeout(() => {
      flap.classList.add('opened');
      glow.classList.add('opened');
    }, 150);

    setTimeout(() => {
      petalShower.classList.remove('hidden');
      spawnPetals();
    }, 1500);

    setTimeout(() => {
      greetingOverlay.classList.remove('hidden');
    }, 2500);

    // Give the greeting a real, unhurried moment on screen, then let it
    // dissolve at the same instant page 2 starts fading in behind it and
    // the envelope (page1) starts fading out on top of it — a layered
    // crossfade rather than an abrupt cut between scenes.
    setTimeout(() => {
      greetingOverlay.classList.add('fade-out');

      page2.classList.remove('hidden');
      page2.scrollTop = 0;
      page1.classList.add('exiting');
      // #page2 was display:none until now, so the scratch canvases (sized
      // from their own bounding box) need to be (re)painted at their real size.
      requestAnimationFrame(refreshScratchCanvasSizes);
      // Start the music automatically now that the guest has "arrived" on
      // page 2 — the seal tap that got them here counts as the user gesture
      // browsers require before allowing audio with sound, so this isn't
      // blocked the way a plain autoplay-on-load attempt would be. If a
      // browser blocks it anyway, fail silently and leave the music button
      // in its normal paused state for the guest to start manually.
      if (bgAudio && bgAudio.paused) {
        bgAudio.play().then(() => { if (musicBtn) musicBtn.classList.remove('paused'); }).catch(() => {});
      }
    }, 3650);

    // Only fully detach each element (display:none / hidden) once its own
    // fade transition has actually had time to finish — added as separate,
    // later timeouts so the CSS transitions above get to render instead of
    // being overwritten in the same tick.
    setTimeout(() => {
      greetingOverlay.classList.add('hidden');
      greetingOverlay.classList.remove('fade-out');
    }, 3650 + 700);

    setTimeout(() => {
      page1.classList.add('hidden');
      page1.classList.remove('exiting');
    }, 3650 + 850);
  }

  function handleBack() {
    opened = false;
    page2.classList.add('hidden');
    page1.classList.remove('hidden');
    page1.classList.remove('exiting');
    petalShower.classList.add('hidden');
    petalShower.innerHTML = '';
    greetingOverlay.classList.add('hidden');
    greetingOverlay.classList.remove('fade-out');
    sealBtn.classList.remove('cracking');
    sealHalo.classList.remove('cracking');
    sealBurst.classList.remove('cracking');
    page1Hint.classList.remove('fade');
    flap.classList.remove('opened');
    glow.classList.remove('opened');
    sealParticles.innerHTML = '';
  }

  sealBtn.addEventListener('click', handleSealClick);
  backBtn.addEventListener('click', handleBack);

  // ---- PARTICLE BURST (seal crack) -------------------------------------------
  function spawnBurstParticles() {
    sealParticles.innerHTML = '';
    const n = 10;
    for (let i = 0; i < n; i++) {
      const left = 8 + Math.round(Math.sin(i * 1.7) * 40) + 40;
      const dx = Math.round(Math.sin(i * 2.3) * 30);
      const size = 3 + (i % 4);
      const delay = (i * 0.09).toFixed(2);
      const dur = (1 + (i % 4) * 0.18).toFixed(2);

      const el = document.createElement('div');
      el.className = 'seal-particle';
      el.style.left = left + '%';
      el.style.width = size + 'px';
      el.style.height = size + 'px';
      el.style.setProperty('--dx', dx + 'px');
      el.style.animation = `particleFloat ${dur}s ease-out ${delay}s forwards`;
      sealParticles.appendChild(el);
    }
  }

  // ---- FALLING PETALS ---------------------------------------------------
  function spawnPetals() {
    petalShower.innerHTML = '';
    const n = 28;
    for (let i = 0; i < n; i++) {
      const left = Math.round((i / n) * 100 + Math.sin(i * 3.1) * 5);
      const sway = Math.round(Math.sin(i * 1.9) * 40);
      const size = 10 + (i % 4) * 3;
      const delay = (Math.abs(Math.sin(i * 2.7)) * 1.1).toFixed(2);
      const dur = (1.6 + (i % 5) * 0.22).toFixed(2);
      const color = PETAL_PALETTE[i % PETAL_PALETTE.length];
      const rot = Math.round(Math.sin(i) * 40);

      const el = document.createElement('div');
      el.className = 'petal';
      el.style.left = left + '%';
      el.style.width = size + 'px';
      el.style.height = (size * 0.72) + 'px';
      el.style.background = color;
      el.style.transform = `rotate(${rot}deg)`;
      el.style.setProperty('--sway', sway + 'px');
      el.style.animation = `petalFall ${dur}s ease-in ${delay}s forwards`;
      petalShower.appendChild(el);
    }
  }

  // ---- MEDIA SLOTS (progressive enhancement) ---------------------------------
  // add_placeholder: drop assets/media/<slot>.mp4 (or .webm / .jpg / .png) in and refresh —
  // see assets/media/README.md for the exact filenames expected.
  const MEDIA_EXTENSIONS = {
    video: ['mp4', 'webm'],
    image: ['jpg', 'jpeg', 'png', 'webp'],
  };

  function loadMediaSlot(slotEl) {
    const name = slotEl.getAttribute('data-slot');
    if (!name) return;
    tryNext([...MEDIA_EXTENSIONS.video.map(ext => ({ ext, type: 'video' })),
             ...MEDIA_EXTENSIONS.image.map(ext => ({ ext, type: 'image' }))], 0);

    function tryNext(list, idx) {
      if (idx >= list.length) return; // keep placeholder
      const { ext, type } = list[idx];
      const src = `assets/media/${name}.${ext}`;

      if (type === 'video') {
        const video = document.createElement('video');
        video.src = src;
        video.muted = true;
        video.loop = true;
        video.autoplay = true;
        video.playsInline = true;
        video.addEventListener('loadeddata', () => swapIn(video), { once: true });
        video.addEventListener('error', () => tryNext(list, idx + 1), { once: true });
      } else {
        const img = new Image();
        img.src = src;
        img.addEventListener('load', () => swapIn(cloneAsImg(src)), { once: true });
        img.addEventListener('error', () => tryNext(list, idx + 1), { once: true });
      }
    }

    function cloneAsImg(src) {
      const img = document.createElement('img');
      img.src = src;
      img.alt = slotEl.getAttribute('data-alt') || '';
      return img;
    }

    function swapIn(mediaEl) {
      const placeholder = slotEl.querySelector('.media-slot-placeholder');
      if (placeholder) placeholder.remove();
      slotEl.appendChild(mediaEl);
    }
  }

  document.querySelectorAll('.media-slot').forEach(loadMediaSlot);

  // ---- MUSIC TOGGLE ---------------------------------------------------------
  const musicBtn = document.getElementById('musicBtn');
  const bgAudio = document.getElementById('bgAudio');
  if (musicBtn && bgAudio) {
    musicBtn.addEventListener('click', () => {
      if (bgAudio.paused) {
        bgAudio.play().then(() => musicBtn.classList.remove('paused')).catch(() => {});
      } else {
        bgAudio.pause();
        musicBtn.classList.add('paused');
      }
    });
  }

  // ---- SAVE THE DATE: SCRATCH TILES + CONGRATULATIONS CELEBRATION ------------
  const congratsCelebration = document.getElementById('congratsCelebration');
  const congratsConfetti = document.getElementById('congratsConfetti');
  const savedateScene = document.getElementById('savedateScene');
  const scratchTiles = document.querySelectorAll('.scratch-tile');
  let scratchedCount = 0;
  let congratsShown = false;
  const scratchPaintFns = [];

  const CONFETTI_COLORS = ['#E8963A', '#C9A227', '#B5442E', '#E0728F', '#FFF8EC', ACCENT];

  // Four party-poppers, one per screen corner, each firing a fan of confetti
  // up/down and inward with a burst-then-gravity-fall arc — not a uniform
  // rain of petals from the top.
  const POPPER_ORIGINS = [
    { style: { left: '0', bottom: '0' }, dirX: 1, dirY: -1, delay: 0 },
    { style: { right: '0', bottom: '0' }, dirX: -1, dirY: -1, delay: 0 },
    { style: { left: '0', top: '0' }, dirX: 1, dirY: 1, delay: 0.18 },
    { style: { right: '0', top: '0' }, dirX: -1, dirY: 1, delay: 0.18 },
  ];

  function spawnCongratsConfetti() {
    congratsConfetti.innerHTML = '';
    const perOrigin = 26; // no text alongside it anymore, so the burst itself carries the celebration

    POPPER_ORIGINS.forEach((origin) => {
      for (let i = 0; i < perOrigin; i++) {
        const shapeRoll = i % 3;
        const el = document.createElement('div');
        el.className = 'congrats-confetti-piece ' + (shapeRoll === 0 ? 'petal' : shapeRoll === 1 ? 'dot' : 'diamond');

        const size = 8 + (i % 5) * 3;
        const color = CONFETTI_COLORS[(i + POPPER_ORIGINS.indexOf(origin)) % CONFETTI_COLORS.length];

        const burstX = origin.dirX * (60 + Math.random() * 110);
        const burstY = origin.dirY * (90 + Math.random() * 150);
        const fallX = burstX + origin.dirX * (10 + Math.random() * 50);
        const fallY = burstY + (150 + Math.random() * 170); // gravity always pulls down
        const rot1 = (Math.random() < 0.5 ? -1 : 1) * (80 + Math.random() * 260);
        const rot2 = rot1 + (Math.random() < 0.5 ? -1 : 1) * (80 + Math.random() * 260);
        const dur = (1.6 + Math.random()).toFixed(2);
        const delay = (origin.delay + Math.random() * 0.25).toFixed(2);

        Object.assign(el.style, origin.style);
        el.style.width = size + 'px';
        el.style.height = (shapeRoll === 1 ? size : size * 0.75) + 'px';
        el.style.background = color;
        el.style.setProperty('--bx', burstX.toFixed(0) + 'px');
        el.style.setProperty('--by', burstY.toFixed(0) + 'px');
        el.style.setProperty('--fx', fallX.toFixed(0) + 'px');
        el.style.setProperty('--fy', fallY.toFixed(0) + 'px');
        el.style.setProperty('--rot1', rot1.toFixed(0) + 'deg');
        el.style.setProperty('--rot2', rot2.toFixed(0) + 'deg');
        el.style.setProperty('--fly-dur', dur + 's');
        el.style.setProperty('--fly-delay', delay + 's');
        congratsConfetti.appendChild(el);
      }
    });
  }

  function celebrate() {
    if (congratsShown || !congratsCelebration) return;
    congratsShown = true;
    congratsCelebration.classList.remove('hidden');
    spawnCongratsConfetti();

    setTimeout(() => {
      congratsCelebration.classList.add('hidden');
      congratsConfetti.innerHTML = '';
    }, 3200);
  }

  function revealTileInstantly(tile) {
    const canvas = tile.querySelector('.scratch-canvas');
    if (!canvas || canvas.classList.contains('done')) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.classList.add('done');
    scratchedCount++;
  }

  // Canvases are sized from their own bounding box, but #page2 is display:none
  // until the envelope opens — sizing them at load time would bake in a 0x0
  // canvas. Re-run this once the scene is actually visible.
  function refreshScratchCanvasSizes() {
    scratchPaintFns.forEach(({ canvas, paint }) => {
      if (canvas.classList.contains('done')) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0 && canvas.width !== rect.width) {
        paint();
      }
    });
  }

  scratchTiles.forEach((tile) => {
    const canvas = tile.querySelector('.scratch-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let scratching = false;

    function paintGoldTile() {
      const rect = tile.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return; // still hidden, nothing to size yet
      canvas.width = rect.width;
      canvas.height = rect.height;

      const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      g.addColorStop(0, '#e3c158');
      g.addColorStop(0.5, '#fff8dc');
      g.addColorStop(1, '#996515');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(60, 10, 5, 0.28)';
      ctx.font = 'bold 11px Jost, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✦ SCRATCH ✦', canvas.width / 2, canvas.height / 2 + 4);
    }
    paintGoldTile();
    scratchPaintFns.push({ canvas, paint: paintGoldTile });
    window.addEventListener('resize', paintGoldTile);

    function getPointerPos(e) {
      const r = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: clientX - r.left, y: clientY - r.top };
    }

    // A soft, feathered brush (radial gradient alpha falloff) reads as real
    // foil scratching instead of a hard-edged hole-punch circle.
    const BRUSH_RADIUS = 20;
    let wipeCount = 0;
    let lastPos = null;

    function eraseDisc(x, y) {
      const brush = ctx.createRadialGradient(x, y, 0, x, y, BRUSH_RADIUS);
      brush.addColorStop(0, 'rgba(0,0,0,1)');
      brush.addColorStop(0.65, 'rgba(0,0,0,1)');
      brush.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = brush;
      ctx.beginPath();
      ctx.arc(x, y, BRUSH_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }

    function wipeAt(x, y) {
      if (canvas.classList.contains('done')) return;
      ctx.globalCompositeOperation = 'destination-out';

      // Stamping only at the pointer's exact position leaves gaps between
      // fast-moving events — fill the segment from the last point too, so a
      // quick swipe scratches a continuous line instead of dotted circles.
      if (lastPos) {
        const dist = Math.hypot(x - lastPos.x, y - lastPos.y);
        const steps = Math.ceil(dist / (BRUSH_RADIUS * 0.5));
        for (let s = 1; s <= steps; s++) {
          eraseDisc(lastPos.x + ((x - lastPos.x) * s) / steps, lastPos.y + ((y - lastPos.y) * s) / steps);
        }
      } else {
        eraseDisc(x, y);
      }
      lastPos = { x, y };

      // Scanning every pixel of the canvas on every single pointer move was
      // making the scratch feel laggy — sample a stride of pixels and only
      // check progress every few strokes instead of on every event.
      wipeCount++;
      if (wipeCount % 3 === 0) checkScratchAmount();
    }

    function checkScratchAmount() {
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let sampled = 0;
      let cleared = 0;
      for (let i = 3; i < pixels.length; i += 4 * 4) {
        sampled++;
        if (pixels[i] < 40) cleared++;
      }

      if (cleared / sampled > 0.4) {
        canvas.classList.add('done');
        scratchedCount++;
        if (scratchedCount === scratchTiles.length) celebrate();
      }
    }

    function startScratch(e) {
      scratching = true;
      lastPos = null;
      const p = getPointerPos(e);
      wipeAt(p.x, p.y);
    }
    function moveScratch(e) {
      if (!scratching) return;
      const p = getPointerPos(e);
      wipeAt(p.x, p.y);
    }
    function endScratch() {
      scratching = false;
      lastPos = null;
    }

    canvas.addEventListener('mousedown', startScratch);
    canvas.addEventListener('mousemove', moveScratch);
    window.addEventListener('mouseup', endScratch);

    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startScratch(e); }, { passive: false });
    canvas.addEventListener('touchmove', (e) => { e.preventDefault(); moveScratch(e); }, { passive: false });
    canvas.addEventListener('touchend', endScratch);
  });

  // If the guest scrolls past the Save the Date scene without scratching every
  // tile, reveal the rest instantly and show the congratulations popup anyway.
  // Only counts once the scene has genuinely been seen (page2 visible) — an
  // observer's first callback on a still-hidden element reports
  // isIntersecting: false, which would otherwise fire this before the
  // envelope is even opened.
  //
  // Scrolling past silently reveals the remaining tiles but does NOT run the
  // full-screen popper celebration — that overlay lasts a few seconds and,
  // since the guest has already moved on to the next scene by the time it
  // plays, it was showing up on top of Haldi instead of Save the Date. The
  // celebration is reserved for guests who actually scratch all 3 tiles
  // (i.e. while they're still looking at this scene).
  if (savedateScene && scratchTiles.length) {
    let savedateWasVisible = false;
    const savedateObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          savedateWasVisible = true;
        } else if (savedateWasVisible && scratchedCount < scratchTiles.length) {
          scratchTiles.forEach(revealTileInstantly);
        }
      });
    }, { threshold: 0.15 });
    savedateObserver.observe(savedateScene);
  }

  // ---- ADD TO CALENDAR (Google Calendar links, one per ceremony scene) ------
  const CEREMONY_EVENTS = {
    haldi: { title: 'Haldi Ceremony — Pawan & Upasana', start: '2026-11-20T10:00:00+05:30', end: '2026-11-20T12:00:00+05:30' },
    sangeet: { title: 'Sangeet — Pawan & Upasana', start: '2026-11-20T17:00:00+05:30', end: '2026-11-20T20:00:00+05:30' },
    vivah: { title: 'Shubh Vivah — Pawan & Upasana', start: '2026-11-21T11:00:00+05:30', end: '2026-11-21T14:00:00+05:30' },
    reception: { title: 'Grand Reception — Pawan & Upasana', start: '2026-11-22T12:00:00+05:30', end: '2026-11-22T16:00:00+05:30' },
  };
  // add_placeholder: fallback venue, only used if a scene has no .scene-address of its own.
  const VENUE_LOCATION = 'Hotel Neelesh Inn, Bhimtal Lake, Nainital District, Uttarakhand';

  function toGCalDate(iso) {
    return new Date(iso).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  document.querySelectorAll('.calendar-link').forEach((link) => {
    const event = CEREMONY_EVENTS[link.getAttribute('data-cal')];
    if (!event) return;
    // Groom-side Haldi runs at a different venue than the rest of the ceremonies,
    // so the calendar location is read from that scene's own .scene-address rather
    // than a single site-wide constant.
    const addressEl = link.closest('.scene')?.querySelector('.scene-address');
    const location = addressEl?.textContent.trim() || VENUE_LOCATION;
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${toGCalDate(event.start)}/${toGCalDate(event.end)}`,
      location,
      details: "Join us as we celebrate! #UPWAN",
    });
    link.href = `https://calendar.google.com/calendar/render?${params.toString()}`;
  });

  // ---- PER-CEREMONY COUNTDOWNS (one on each scene, own target time) ---------
  const pad2 = (n) => String(n).padStart(2, '0');
  const countdowns = Array.from(document.querySelectorAll('[data-countdown]')).map((el) => ({
    el,
    target: new Date(CEREMONY_EVENTS[el.getAttribute('data-countdown')]?.start).getTime(),
    dEl: el.querySelector('[data-cd="d"]'),
    hEl: el.querySelector('[data-cd="h"]'),
    mEl: el.querySelector('[data-cd="m"]'),
    sEl: el.querySelector('[data-cd="s"]'),
  })).filter((cd) => !Number.isNaN(cd.target));

  function tickCountdowns() {
    const now = Date.now();
    countdowns.forEach(({ target, dEl, hEl, mEl, sEl }) => {
      const diff = target - now;
      if (diff <= 0) {
        dEl.textContent = hEl.textContent = mEl.textContent = sEl.textContent = '00';
        return;
      }
      dEl.textContent = pad2(Math.floor(diff / 86400000));
      hEl.textContent = pad2(Math.floor((diff % 86400000) / 3600000));
      mEl.textContent = pad2(Math.floor((diff % 3600000) / 60000));
      sEl.textContent = pad2(Math.floor((diff % 60000) / 1000));
    });
  }
  if (countdowns.length) {
    tickCountdowns();
    setInterval(tickCountdowns, 1000);
  }

  // ---- SCENE ENTRANCE ANIMATION + SIDE DOT-NAV -------------------------------
  const allScenes = document.querySelectorAll('.scene');
  const sceneDotsContainer = document.getElementById('sceneDots');
  const sceneDots = [];
  if (sceneDotsContainer) {
    allScenes.forEach((scene, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'scene-dot';
      dot.setAttribute('aria-label', `Go to section ${i + 1}`);
      dot.addEventListener('click', () => scene.scrollIntoView({ behavior: 'smooth' }));
      sceneDotsContainer.appendChild(dot);
      sceneDots.push(dot);
    });
  }

  const sceneObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('in-view', entry.isIntersecting);
      if (entry.isIntersecting) {
        const idx = Array.prototype.indexOf.call(allScenes, entry.target);
        sceneDots.forEach((d, i) => d.classList.toggle('active', i === idx));
      }
    });
  }, { threshold: 0.35 });
  allScenes.forEach((scene) => sceneObserver.observe(scene));
})();
