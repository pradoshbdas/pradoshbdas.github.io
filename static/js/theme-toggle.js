function initThemeToggle() {
  const toggleBtn = document.getElementById("theme-toggle");
  if (!toggleBtn) return;

  function enableThemeTransition() {
    document.documentElement.classList.add("theme-transition");
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transition");
    }, 400);
  }

  function setTheme(theme) {
    enableThemeTransition();
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    updateIcon(theme);
  }

  function getInitialTheme() {
    const savedTheme = localStorage.getItem("theme");

    // If user has previously chosen a theme, use it
    if (savedTheme) return savedTheme;

    // Otherwise default to dark
    return "dark";
  }

  function updateIcon(theme) {
    toggleBtn.textContent = theme === "dark" ? "☀️" : "🌙";
    toggleBtn.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
    );
  }

  // Set initial theme
  const initialTheme = getInitialTheme();
  document.documentElement.setAttribute("data-theme", initialTheme);
  updateIcon(initialTheme);

  // Toggle button
  toggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  });
}

window.initThemeToggle = initThemeToggle;
