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

  setTimeout(() => {
    scrollToRequestedSection();
  }, 100);
});
