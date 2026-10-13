document.addEventListener("DOMContentLoaded", () => {
  const skipIntro = document.documentElement.classList.contains("skip-intro");

  if (window.initNavBehavior) window.initNavBehavior();
  if (window.initThemeToggle) window.initThemeToggle();
  if (window.initMobileMenu) window.initMobileMenu();
  if (window.initBackToTop) window.initBackToTop();

  if (skipIntro) {
    document.body.classList.remove("loading");
    document.body.classList.add("page-ready");
    // The hero is already visible via skip-intro CSS. Rotate its subtitle
    // without restarting the first-visit entrance animation.
    if (window.startWordRotation && window.getHeroWords) {
      window.startWordRotation(document.getElementById("changing-word"), window.getHeroWords());
    }
    if (window.startHeroFact) window.startHeroFact();
    return;
  }

  if (window.startAstroFacts) window.startAstroFacts();
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (typeof window.startSunZoom === "function") window.startSunZoom();
      }, 250);
    });
  });
});

function initMobileMenu() {
  const burger = document.getElementById("burger");
  const overlay = document.getElementById("mobile-menu-overlay");
  const menu = document.getElementById("mobile-menu");
  const closeBtn = document.getElementById("mobile-close");

  if (!burger) return;

  burger.addEventListener("click", () => {
    document.body.classList.toggle("mobile-menu-open");
  });

  overlay.addEventListener("click", () => {
    document.body.classList.remove("mobile-menu-open");
  });

  closeBtn.addEventListener("click", () => {
    document.body.classList.remove("mobile-menu-open");
  });
}

window.initMobileMenu = initMobileMenu;

function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;

  function toggleVisibility() {
    if (window.innerWidth <= 980 && window.scrollY > 300) {
      btn.classList.add("show");
    } else {
      btn.classList.remove("show");
    }
  }

  btn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  window.addEventListener("scroll", toggleVisibility);
  window.addEventListener("resize", toggleVisibility);

  toggleVisibility();
}

window.initBackToTop = initBackToTop;