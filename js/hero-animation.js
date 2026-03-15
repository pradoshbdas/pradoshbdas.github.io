let heroWordInterval = null;
let heroWordTimeout = null;

function restartHeroReveal() {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  hero.classList.remove("hero-loaded");

  // force reflow so animation can restart
  void hero.offsetWidth;

  hero.classList.add("hero-loaded");
}

function startWordRotation(element, words) {
  if (!element || !words.length) return;

  if (heroWordInterval) {
    clearInterval(heroWordInterval);
    heroWordInterval = null;
  }

  if (heroWordTimeout) {
    clearTimeout(heroWordTimeout);
    heroWordTimeout = null;
  }

  let index = 0;
  element.textContent = words[index];
  element.classList.remove("word-hidden");
  element.classList.add("word-visible");

  heroWordTimeout = setTimeout(() => {
    heroWordInterval = setInterval(() => {
      element.classList.remove("word-visible");
      element.classList.add("word-hidden");

      setTimeout(() => {
        index = (index + 1) % words.length;
        element.textContent = words[index];
        element.classList.remove("word-hidden");
        element.classList.add("word-visible");
      }, 300);
    }, 2500);
  }, 1500);
}

async function startHeroAnimation() {
  const hero = document.querySelector(".hero");
  const element = document.getElementById("changing-word");

  if (!hero) return;

  restartHeroReveal();

  if (!element) return;

  try {
    const response = await fetch("content/hero-words.md");
    if (!response.ok) {
      throw new Error("Failed to load hero words");
    }

    const text = await response.text();

    const words = text
      .split("\n")
      .map((line) => line.replace(/^- /, "").trim())
      .filter((line) => line.length > 0);

    startWordRotation(element, words);
  } catch (error) {
    console.error("Hero animation error:", error);
  }
}

function initHeroReplayOnView() {
  const hero = document.getElementById("home");
  if (!hero) return;

  let hasBeenVisible = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasBeenVisible) {
          hasBeenVisible = true;
          restartHeroReveal();
        }

        if (!entry.isIntersecting) {
          hasBeenVisible = false;
        }
      });
    },
    {
      threshold: 0.55,
    }
  );

  observer.observe(hero);
}

window.startHeroAnimation = startHeroAnimation;
window.restartHeroReveal = restartHeroReveal;
window.initHeroReplayOnView = initHeroReplayOnView;
