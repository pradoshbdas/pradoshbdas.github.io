async function loadPartials(root = document) {
  const includeTargets = root.querySelectorAll("[data-include]");

  for (const target of includeTargets) {
    const file = target.getAttribute("data-include");

    try {
      const response = await fetch(file);

      if (!response.ok) {
        throw new Error(`Failed to load ${file}`);
      }

      const html = await response.text();

      const wrapper = document.createElement("div");
      wrapper.innerHTML = html.trim();

      const insertedNodes = Array.from(wrapper.childNodes);

      target.replaceWith(...insertedNodes);

      for (const node of insertedNodes) {
        if (node.nodeType === 1) {
          await loadPartials(node);
        }
      }
    } catch (error) {
      const errorDiv = document.createElement("div");
      errorDiv.style.color = "#b91c1c";
      errorDiv.style.padding = "1rem";
      errorDiv.innerHTML = `Could not load <code>${file}</code>`;
      target.replaceWith(errorDiv);

      console.error("Partial load error:", error);
    }
  }
}

function revealFallback() {
  const loader = document.getElementById("page-loader");
  const flash = document.getElementById("white-flash");

  if (window.stopAstroFacts) {
    window.stopAstroFacts();
  }

  if (flash) {
    flash.classList.add("active");
  }

  setTimeout(() => {
    if (loader) {
      loader.classList.add("hide");
    }

    document.body.classList.remove("loading");
    document.body.classList.add("page-ready");
  }, 150);

  setTimeout(async () => {
    if (flash) {
      flash.classList.remove("active");
    }

    if (window.startHeroAnimation) {
      await window.startHeroAnimation();
    }

    if (window.initHeroReplayOnView) {
      window.initHeroReplayOnView();
    }
  }, 300);
}

function triggerLoaderExit() {
  if (typeof window.startSunZoom === "function") {
    window.startSunZoom();
  } else {
    revealFallback();
  }

  window.dispatchEvent(new Event("site:ready"));
}

document.addEventListener("DOMContentLoaded", async () => {
  if (window.startAstroFacts) {
    window.startAstroFacts();
  }

  await loadPartials();

  if (window.loadMarkdownSections) {
    await window.loadMarkdownSections(document);
  }

  if (window.initNavBehavior) {
    window.initNavBehavior();
  }

  if (window.initThemeToggle) {
    window.initThemeToggle();
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        triggerLoaderExit();

        if (typeof scrollToRequestedSection === "function") {
          scrollToRequestedSection();
        }
      }, 200);
    });
  });
});