let heroWordInterval = null;
let heroWordTimeout = null;

function initNavBehavior() {
  const main = document.querySelector("main");
  const nav = document.querySelector(".nav");
  const navLinks = document.querySelectorAll('.nav a[href^="#"]');
  const sections = document.querySelectorAll("main section[id]");
  if (!main || !nav || !navLinks.length || !sections.length) return;

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      main.scrollTo({ top: target.offsetTop, behavior: "smooth" });
      if (targetId === "#home") {
        setTimeout(() => restartHeroReveal(), 150);
      }
    });
  });

  function updateActiveLink() {
    let currentId = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (main.scrollTop >= sectionTop) currentId = section.id;
    });
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentId}`) link.classList.add("active");
    });
  }

  function updateNavScrolled() {
    nav.classList.toggle("nav-scrolled", main.scrollTop > 20);
  }

  main.addEventListener("scroll", () => {
    updateActiveLink();
    updateNavScrolled();
  });
  updateActiveLink();
  updateNavScrolled();
}

function initThemeToggle() {
  const toggleBtn = document.getElementById("theme-toggle");
  if (!toggleBtn) return;

  function enableThemeTransition() {
    document.documentElement.classList.add("theme-transition");
    setTimeout(() => document.documentElement.classList.remove("theme-transition"), 400);
  }

  function updateIcon(theme) {
    toggleBtn.textContent = theme === "dark" ? "☀️" : "🌙";
    toggleBtn.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
  }

  function setTheme(theme) {
    enableThemeTransition();
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    updateIcon(theme);
  }

  const initialTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", initialTheme);
  updateIcon(initialTheme);

  toggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    setTheme(currentTheme === "dark" ? "light" : "dark");
  });
}

function restartHeroReveal() {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  hero.classList.remove("hero-loaded");
  void hero.offsetWidth;
  hero.classList.add("hero-loaded");
}

function getHeroWords() {
  const dataEl = document.getElementById("hero-words-data");
  const fallback = ["Science Enthusiast", "Researcher"];
  if (!dataEl) return fallback;
  try {
    const parsed = JSON.parse(dataEl.textContent);
    if (Array.isArray(parsed) && parsed.length) {
      return parsed.map(word => String(word).trim()).filter(Boolean);
    }
    if (typeof parsed === "string" && parsed.trim()) {
      return parsed.split(",").map(word => word.trim()).filter(Boolean);
    }
    return fallback;
  } catch (error) {
    console.error("Failed to parse hero words JSON:", error);
    return fallback;
  }
}

function startWordRotation(element, words) {
  if (!element || !Array.isArray(words) || !words.length) return;

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

function startHeroAnimation() {
  const hero = document.querySelector(".hero");
  const element = document.getElementById("changing-word");
  if (!hero) return;
  restartHeroReveal();
  if (!element) return;
  const words = getHeroWords();
  startWordRotation(element, words);
}

function initHeroReplayOnView() {
  const hero = document.getElementById("home");
  if (!hero) return;
  let hasBeenVisible = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasBeenVisible) {
        hasBeenVisible = true;
        restartHeroReveal();
      }
      if (!entry.isIntersecting) hasBeenVisible = false;
    });
  }, { threshold: 0.55 });
  observer.observe(hero);
}

// Burger menu
(function () {
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('nav-links');
  if (!burger || !navLinks) return;

  burger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  });

  // close on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', false);
    });
  });

  // close on outside click
  document.addEventListener('click', (e) => {
    if (!burger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', false);
    }
  });
})();



window.initNavBehavior = initNavBehavior;
window.initThemeToggle = initThemeToggle;
window.restartHeroReveal = restartHeroReveal;
window.startHeroAnimation = startHeroAnimation;
window.initHeroReplayOnView = initHeroReplayOnView;
