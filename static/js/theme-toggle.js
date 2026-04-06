function initThemeToggle() {
  const toggleBtn = document.getElementById("theme-toggle");
  if (!toggleBtn) return;

  const root = document.documentElement;

  function enableThemeTransition() {
    root.classList.add("theme-transition");
    setTimeout(() => {
      root.classList.remove("theme-transition");
    }, 400);
  }

  function updateIcon(theme) {
    toggleBtn.textContent = theme === "dark" ? "☀️" : "🌙";
    toggleBtn.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
    );
  }

  function updateThemeLogos(theme) {
    const macquarieLogo = document.querySelector(".institution-logo.macquarie");
    const esoLogo = document.querySelector(".institution-logo.eso");

    if (macquarieLogo) {
      macquarieLogo.src =
        theme === "dark"
          ? "/macquarie-light.png"
          : "/macquarie-dark.png";
    }

    if (esoLogo) {
      esoLogo.src =
        theme === "dark"
          ? "/eso-light.png"
          : "/eso-dark.png";
    }
  }

  function setTheme(theme) {
    enableThemeTransition();
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    updateIcon(theme);
    updateThemeLogos(theme);
  }

  function getInitialTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme;
    return "dark";
  }

  const initialTheme = getInitialTheme();
  root.setAttribute("data-theme", initialTheme);
  updateIcon(initialTheme);
  updateThemeLogos(initialTheme);

  toggleBtn.addEventListener("click", () => {
    const currentTheme = root.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  });
}

window.initThemeToggle = initThemeToggle;