(function () {
  const astroFacts = [
    "If the Sun suddenly disappeared, Earth wouldn’t notice for ~8 minutes and 20 seconds.",
    "The Milky Way will collide with the Andromeda Galaxy in about 4–5 billion years, creating a new giant galaxy.",
    "The TON 618 is a black hole so massive that it contains the mass of about 66 billion Suns.",
    "The Great Attractor is a mysterious gravitational region so massive that it is pulling our entire galaxy cluster toward it at about 2 million km/h.",
    "The largest known star, UY Scuti, is so huge that about 5 billion Suns could fit inside it.",
    "The Phoenix Cluster creates stars at an insane rate of about 1,000 stars every year.",
    "The Bootes Void is an enormous region of space about 330 million light-years wide that contains almost nothing at all.",
    "Light from the Andromeda Galaxy takes 2.5 million years to reach Earth.",
    "The Saturn is so low-density that it would float if you had an ocean big enough.",
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

  function showNextFact() {
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

    intervalId = setInterval(showNextFact, 3500);
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

  window.startAstroFacts = startAstroFacts;
  window.stopAstroFacts = stopAstroFacts;
})();