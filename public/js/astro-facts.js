(function () {
  const astroFacts = [
    "If the Sun suddenly disappeared, Earth wouldn't notice for about 8 minutes and 20 seconds.",
    "The Milky Way will collide with the Andromeda Galaxy in about 4 to 5 billion years.",
    "TON 618 is so massive that it contains the mass of about 66 billion Suns.",
    "The Great Attractor is pulling our galaxy cluster at roughly 2 million km/h.",
    "UY Scuti is so huge that about 5 billion Suns could fit inside it.",
    "The Phoenix Cluster creates stars at a rate of about 1,000 stars every year.",
    "The Bootes Void is about 330 million light-years wide and contains almost nothing.",
    "Light from the Andromeda Galaxy takes 2.5 million years to reach Earth.",
    "Saturn is so low-density that it would float in a large enough ocean.",
    "A teaspoon of neutron star matter would weigh about a billion tons.",
    "The James Webb Space Telescope observes galaxies from over 13 billion years ago.",
    "Some exoplanets rain molten glass sideways at 7000 km/h."
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