(function () {
  const astroFacts = [

    // ── Original Astronomy Facts ───────────────────────────────

    "If the Sun suddenly disappeared, Earth wouldn't notice for about 8 minutes and 20 seconds.",

    "Whether the Milky Way and Andromeda will collide within the next 10 billion years remains uncertain.",

    "TON 618 is so massive that it contains the mass of about 66 billion Suns.",

    "The Great Attractor contributes to the motion of our galaxy through space at hundreds of kilometres per second.",

    "UY Scuti is so enormous that billions of Suns could fit inside it, based on some historical size estimates.",

    "The Phoenix Cluster's central galaxy has been estimated to form hundreds of new stars every year.",

    "The Boötes Void is about 330 million light-years wide and contains remarkably few galaxies.",

    "Light from the Andromeda Galaxy takes approximately 2.5 million years to reach Earth.",

    "Saturn is so low-density that it would float in a large enough ocean.",

    "A teaspoon of neutron star matter would weigh about a billion tons.",

    "The James Webb Space Telescope observes galaxies whose light has travelled for over 13 billion years.",

    "Some exoplanets may experience winds carrying molten silicate droplets at thousands of kilometres per hour.",


    // ── Extreme Black Holes and Cosmic Phenomena ──────────────

    "A pair of black-hole jets called Porphyrion stretches across 23 million light-years.",

    "A fast radio burst released 30 years of the Sun's energy output in less than a millisecond.",

    "The black hole powering quasar J0529-4351 gains roughly one solar mass every day.",

    "The accretion disc surrounding quasar J0529-4351 is approximately seven light-years across.",

    "A black-hole merger briefly emitted more gravitational-wave power than the light from every star in the observable Universe.",

    "A gamma-ray burst from nearly two billion light-years away measurably disturbed Earth's ionosphere.",


    // ── Extreme Stars and Compact Objects ─────────────────────

    "Two white dwarfs orbit each other every 6.91 minutes, with their entire binary fitting inside Saturn.",

    "The fastest known pulsar rotates 716 times every second.",

    "Neutrinos from Supernova 1987A were detected about two hours before its first visible-light observation.",

    "The star S2 reaches nearly 3% of the speed of light near the Milky Way's central black hole.",

    "Astronomers predicted when a gravitationally lensed supernova would appear again, then observed it as expected.",


    // ── Galactic Archaeology and Stellar Chemistry ────────────

    "The star SMSS J031300 has an iron abundance less than one ten-millionth of the Sun's.",

    "The chemical composition of an ancient Milky Way star may preserve the signature of just one early supernova.",

    "Gaia revealed a snail-shaped spiral in stellar phase space, showing that the Milky Way's disc is still dynamically disturbed.",

    "The Milky Way's stellar halo is elongated and tilted rather than approximately spherical.",

    "The Milky Way's disc is warped, potentially because of repeated encounters with a smaller galaxy.",

    "Astronomers identified freshly synthesised strontium in the aftermath of a neutron-star merger.",


    // ── The Early Universe and Galaxy Evolution ───────────────

    "JWST confirmed the galaxy MoM-z14 at redshift 14.44, only 280 million years after the Big Bang.",

    "A galaxy observed just 280 million years after the Big Bang already shows unexpectedly strong nitrogen enrichment.",

    "JWST has revealed an unexpectedly large population of bright galaxies in the very early Universe."

  ];

  // ── Loader fact ──────────────────────────────────────────────
  const loaderEl = document.getElementById("astro-fact-text");
  let loaderLast = -1, loaderInterval = null, loaderTimeout = null;

  function randomIndex(exclude) {
    let i;
    do { i = Math.floor(Math.random() * astroFacts.length); }
    while (i === exclude && astroFacts.length > 1);
    return i;
  }

  function rotateFact(el, getLast, setLast, getTimeout, setTimeoutRef) {
    el.classList.add("fade-out");
    const t = setTimeout(() => {
      const i = randomIndex(getLast());
      setLast(i);
      el.textContent = astroFacts[i];
      el.classList.remove("fade-out");
    }, 380);
    setTimeoutRef(t);
  }

  function startAstroFacts() {
    if (loaderInterval || !loaderEl) return;
    const i = randomIndex(loaderLast);
    loaderLast = i;
    loaderEl.textContent = astroFacts[i];
    loaderEl.classList.remove("fade-out");
    loaderInterval = setInterval(() => {
      rotateFact(
        loaderEl,
        () => loaderLast,
        (v) => { loaderLast = v; },
        () => loaderTimeout,
        (t) => { loaderTimeout = t; }
      );
    }, 2000);
  }

  function stopAstroFacts() {
    clearInterval(loaderInterval); loaderInterval = null;
    clearTimeout(loaderTimeout);  loaderTimeout  = null;
  }

  function hideAstroFacts() {
    stopAstroFacts();
    if (loaderEl) loaderEl.classList.add("fade-out");
  }

  window.startAstroFacts = startAstroFacts;
  window.stopAstroFacts  = stopAstroFacts;
  window.hideAstroFacts  = hideAstroFacts;

  // ── Hero fact (starts after loader is gone) ───────────────────
  // ── Hero fact (typewriter) ────────────────────────────────────
  let heroLast = -1;
  let heroInterval = null;
  let typeTimeout = null;

  function typeWriter(el, sentence, done) {
    const text = '\u201C' + sentence + '\u201D';
    el.textContent = '';
    let i = 0;

    function tick() {
      if (i < text.length) {
        el.textContent += text[i];
        i++;
        typeTimeout = setTimeout(tick, 30);
      } else if (done) {
        done();
      }
    }
    tick();
  }

  function eraseWriter(el, done) {
    function tick() {
      const t = el.textContent;
      if (t.length > 0) {
        el.textContent = t.slice(0, -1);
        typeTimeout = setTimeout(tick, 15);
      } else if (done) {
        done();
      }
    }
    tick();
  }

  function showNextFact(el) {
    const next = randomIndex(heroLast);
    heroLast = next;
    typeWriter(el, astroFacts[next], () => {
      heroInterval = setTimeout(() => {
        eraseWriter(el, () => showNextFact(el));
      }, 4000);
    });
  }

  function startHeroFact() {
    const heroEl = document.getElementById('hero-fact');
    if (!heroEl) return;
    showNextFact(heroEl);
  }

  window.startHeroFact = startHeroFact;

  window.startHeroFact = startHeroFact;
})();
