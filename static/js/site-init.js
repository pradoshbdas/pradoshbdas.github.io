document.addEventListener("DOMContentLoaded", () => {
  if (window.startAstroFacts) {
    window.startAstroFacts();
  }

  if (window.initNavBehavior) {
    window.initNavBehavior();
  }

  if (window.initThemeToggle) {
    window.initThemeToggle();
  }

  if (window.startHeroAnimation) {
    window.startHeroAnimation();
  }

  if (window.initHeroReplayOnView) {
    window.initHeroReplayOnView();
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (typeof window.startSunZoom === "function") {
          window.startSunZoom();
        }
      }, 250);
    });
  });
});
