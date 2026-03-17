
const HERO_WORDS = ["Science Enthusiast", "Researcher"];
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

  main.addEventListener("scroll", () => { updateActiveLink(); updateNavScrolled(); });
  updateActiveLink(); updateNavScrolled();
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

function startWordRotation(element, words) {
  if (!element || !words.length) return;
  if (heroWordInterval) clearInterval(heroWordInterval);
  if (heroWordTimeout) clearTimeout(heroWordTimeout);
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
  }, 1200);
}

function startHeroAnimation() {
  const hero = document.querySelector(".hero");
  const element = document.getElementById("changing-word");
  if (!hero) return;
  restartHeroReveal();
  if (element) startWordRotation(element, HERO_WORDS);
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
  let lastFact = -1; let intervalId = null; let timeoutId = null;
  function randomFactIndex() { let index; do { index = Math.floor(Math.random() * astroFacts.length); } while (index === lastFact && astroFacts.length > 1); lastFact = index; return index; }
  function rotateFact() { factEl.classList.add("fade-out"); timeoutId = setTimeout(() => { factEl.textContent = astroFacts[randomFactIndex()]; factEl.classList.remove("fade-out"); }, 220); }
  window.startAstroFacts = function () { if (intervalId) return; factEl.textContent = astroFacts[randomFactIndex()]; factEl.classList.remove("fade-out"); intervalId = setInterval(rotateFact, 1800); };
  window.stopAstroFacts = function () { if (intervalId) clearInterval(intervalId); if (timeoutId) clearTimeout(timeoutId); intervalId = null; timeoutId = null; };
  window.hideAstroFacts = function () { window.stopAstroFacts(); factEl.classList.add("fade-out"); };
})();

(function () {
  const canvas = document.getElementById("solar-loader");
  const flash = document.getElementById("white-flash");
  const pageLoader = document.getElementById("page-loader");
  if (!canvas || !flash || !pageLoader) return;
  const ctx = canvas.getContext("2d");
  let width = window.innerWidth, height = window.innerHeight, cx = width/2, cy = height/2;
  let zooming = false, finished = false, sunRadius = 16;
  const planets = [
    { r: 42, size: 3, speed: 0.03, angle: 0.2, color: "#b7bcc5" },
    { r: 65, size: 4, speed: 0.022, angle: 1.8, color: "#f3c07d" },
    { r: 90, size: 5, speed: 0.016, angle: 3.7, color: "#71d4ff" },
    { r: 118, size: 4, speed: 0.012, angle: 2.6, color: "#e17962" },
    { r: 148, size: 8, speed: 0.008, angle: 5.1, color: "#d6b287" }
  ];
  function resizeCanvas() {
    width = window.innerWidth; height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
    ctx.setTransform(1,0,0,1,0,0); ctx.scale(dpr, dpr); cx = width/2; cy = height/2;
  }
  function drawStars() {
    const starCount = Math.min(90, Math.floor((width * height) / 18000));
    for (let i = 0; i < starCount; i++) {
      const x = (i * 137.5) % width, y = (i * 91.7) % height, alpha = 0.08 + (i % 5) * 0.03, size = (i % 3) + 1;
      ctx.beginPath(); ctx.arc(x, y, size * 0.5, 0, Math.PI * 2); ctx.fillStyle = `rgba(255,255,255,${alpha})`; ctx.fill();
    }
  }
  function drawSolarSystem() {
    if (finished) return;
    ctx.clearRect(0, 0, width, height); drawStars();
    planets.forEach((p) => {
      if (!zooming) p.angle += p.speed;
      ctx.beginPath(); ctx.arc(cx, cy, p.r, 0, Math.PI * 2); ctx.strokeStyle = "rgba(255,255,255,0.14)"; ctx.lineWidth = 1; ctx.stroke();
      const x = cx + Math.cos(p.angle) * p.r, y = cy + Math.sin(p.angle) * p.r;
      ctx.beginPath(); ctx.arc(x, y, p.size, 0, Math.PI * 2); ctx.fillStyle = p.color; ctx.fill();
    });
    const sunGlow = zooming ? Math.min(sunRadius * 0.22, 180) : 24;
    ctx.beginPath(); ctx.arc(cx, cy, sunRadius, 0, Math.PI * 2); ctx.fillStyle = "rgba(255,200,120,1)"; ctx.shadowColor = "rgba(255,180,70,0.95)"; ctx.shadowBlur = sunGlow; ctx.fill(); ctx.shadowBlur = 0;
    if (zooming) {
      const overlay = document.querySelector(".loader-overlay"); if (overlay) overlay.style.opacity = "0";
      sunRadius *= 1.16;
      const screenCoverRadius = Math.hypot(width, height);
      if (sunRadius > Math.min(width, height) * 0.33) flash.classList.add("active");
      if (sunRadius > screenCoverRadius * 1.05) {
        finished = true; if (window.stopAstroFacts) window.stopAstroFacts();
        pageLoader.classList.add("hide"); document.body.classList.remove("loading"); document.body.classList.add("page-ready");
        setTimeout(() => flash.classList.remove("active"), 180);
        setTimeout(() => { startHeroAnimation(); initHeroReplayOnView(); }, 120);
        return;
      }
    }
    requestAnimationFrame(drawSolarSystem);
  }
  resizeCanvas(); window.addEventListener("resize", resizeCanvas); drawSolarSystem();
  window.startSunZoom = function() { if (zooming || finished) return; if (window.stopAstroFacts) window.stopAstroFacts(); const overlay = document.querySelector(".loader-overlay"); if (overlay) overlay.style.display = "none"; setTimeout(() => { zooming = true; }, 20); };
})();

function scrollToRequestedSection() {
  const params = new URLSearchParams(window.location.search);
  const sectionId = params.get('section');
  const main = document.getElementById('main-content');
  if (!sectionId || !main) return;
  const target = document.getElementById(sectionId);
  if (target) main.scrollTo({ top: target.offsetTop, behavior: 'auto' });
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.startAstroFacts) window.startAstroFacts();
  initNavBehavior();
  initThemeToggle();
  requestAnimationFrame(() => {
    setTimeout(() => { if (window.startSunZoom) window.startSunZoom(); scrollToRequestedSection(); }, 80);
  });
});
