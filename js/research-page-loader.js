function initResearchPageLoader() {
  const content = document.getElementById("research-content");
  const title = document.getElementById("research-page-title");
  const subtitle = document.getElementById("research-page-subtitle");

  if (!content || !title || !subtitle) return;

  const params = new URLSearchParams(window.location.search);
  const topic = params.get("topic");

  const topicMeta = {
    "galactic-archaeology": {
      title: "Galactic Archaeology",
      subtitle: "Formation history of the Milky Way through stellar populations and chemical evolution.",
    },
    "ml-spectroscopy": {
      title: "Machine Learning for Stellar Spectroscopy",
      subtitle: "Data-driven methods for extracting stellar parameters and abundance information.",
    },
    "chemical-tagging": {
      title: "Chemical Tagging",
      subtitle: "Tracing stellar origins and shared formation environments through abundance patterns.",
    },
    "accretion-structures": {
      title: "Accretion Structures",
      subtitle: "Accretion disks, mass transfer, and compact-object environments.",
    },
  };

  if (!topic) {
    title.textContent = "Research";
    subtitle.textContent = "No research topic selected.";
    content.innerHTML = "<p>No research topic selected.</p>";
    return;
  }

  const file = `content/research/${topic}.md`;
  const meta = topicMeta[topic];

  if (meta) {
    title.textContent = meta.title;
    subtitle.textContent = meta.subtitle;
    document.title = `${meta.title} | Pradosh Barun Das`;
  } else {
    title.textContent = "Research";
    subtitle.textContent = "Loading research topic...";
  }

  fetch(file)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load ${file}`);
      }
      return response.text();
    })
    .then((markdown) => {
      if (typeof marked !== "undefined") {
        content.innerHTML = marked.parse(markdown);
      } else {
        content.textContent = markdown;
      }
    })
    .catch((error) => {
      content.innerHTML = `
        <p style="color:#b91c1c;">
          Could not load <code>${file}</code>.
        </p>
      `;
      console.error("Research page load error:", error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.initThemeToggle) {
    window.initThemeToggle();
  }
  initResearchPageLoader();
});
