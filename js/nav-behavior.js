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

      main.scrollTo({
        top: target.offsetTop,
        behavior: "smooth",
      });

      // replay hero animation when Home is clicked
      if (targetId === "#home") {
        setTimeout(() => {
          if (window.restartHeroReveal) {
            window.restartHeroReveal();
          }
        }, 150);
      }
    });
  });

  function updateActiveLink() {
    let currentId = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (main.scrollTop >= sectionTop) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentId}`) {
        link.classList.add("active");
      }
    });
  }

  function updateNavScrolled() {
    if (main.scrollTop > 20) {
      nav.classList.add("nav-scrolled");
    } else {
      nav.classList.remove("nav-scrolled");
    }
  }

  main.addEventListener("scroll", () => {
    updateActiveLink();
    updateNavScrolled();
  });

  updateActiveLink();
  updateNavScrolled();
}

window.initNavBehavior = initNavBehavior;
