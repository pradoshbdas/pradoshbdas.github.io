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

      // recursively load nested partials inside newly inserted content
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

function hideLoader() {
  const loader = document.getElementById("page-loader");
  if (loader) {
    loader.classList.add("hide");
  }
  document.body.classList.remove("loading");
  window.dispatchEvent(new Event("site:ready"));
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadPartials();

  if (window.loadMarkdownSections) {
    await window.loadMarkdownSections(document);
  }

  if (window.startHeroAnimation) {
    await window.startHeroAnimation();
  }

  if (window.initHeroReplayOnView) {
    window.initHeroReplayOnView();
  }

  if (window.initNavBehavior) {
    window.initNavBehavior();
  }

  if (window.initThemeToggle) {
    window.initThemeToggle();
  }

  // let DOM paint and layout settle before revealing page
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        hideLoader();
        scrollToRequestedSection();
      }, 200);
    });
  });
});