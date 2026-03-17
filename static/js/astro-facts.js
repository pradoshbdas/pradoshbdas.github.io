(function () {
  const astroFacts = [
    "If the Sun suddenly disappeared, Earth wouldn’t notice for about 8 minutes and 20 seconds.",
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

  const factEl = document.getElementById("astro-fact-text");
  if (!factEl) return;

  let lastFact = -1;
  let intervalId = null;
  let timeoutId = null;

  function randomFactIndex() {
    let index;
    do {
      index = Math.floor(Math.random() * astroFacts.length);
    } while (index === lastFact && astroFacts.length > 1);

    lastFact = index;
    return index;
  }

  function rotateFact() {
    factEl.classList.add("fade-out");

    timeoutId = setTimeout(() => {
      factEl.textContent = astroFacts[randomFactIndex()];
      factEl.classList.remove("fade-out");
    }, 350);
  }

  function startAstroFacts() {
    if (intervalId) return;
    factEl.textContent = astroFacts[randomFactIndex()];
    factEl.classList.remove("fade-out");
    intervalId = setInterval(rotateFact, 2000);
  }

  function stopAstroFacts() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  }

  function hideAstroFacts() {
    stopAstroFacts();
    factEl.classList.add("fade-out");
  }

  window.startAstroFacts = startAstroFacts;
  window.stopAstroFacts = stopAstroFacts;
  window.hideAstroFacts = hideAstroFacts;
})();
