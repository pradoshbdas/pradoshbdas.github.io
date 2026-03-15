async function loadMarkdownSections(root = document) {
  const sections = root.querySelectorAll("[data-md]");

  for (const section of sections) {
    const path = section.getAttribute("data-md");

    try {
      const response = await fetch(path);

      if (!response.ok) {
        throw new Error(`Failed to load ${path}`);
      }

      const markdown = await response.text();
      section.innerHTML = marked.parse(markdown);
    } catch (error) {
      section.innerHTML = `
        <p style="color:#fca5a5;">
          Could not load <code>${path}</code>.
          Make sure the file exists and you are using a local server.
        </p>
      `;
      console.error("Markdown load error:", error);
    }
  }
}

window.loadMarkdownSections = loadMarkdownSections;

function hideLoader() {
  const loader = document.getElementById("page-loader");
  if (loader) {
    loader.classList.add("hide");
  }
}

window.addEventListener("load", hideLoader);