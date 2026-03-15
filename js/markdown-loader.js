function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildConferenceTimeline(markdown) {
  const lines = markdown
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const groups = [];
  let currentGroup = null;

  for (const line of lines) {
    if (line.startsWith("### ")) {
      const year = line.replace("### ", "").trim();
      currentGroup = { year, items: [] };
      groups.push(currentGroup);
      continue;
    }

    if (line.startsWith("- ") && currentGroup) {
      const raw = line.replace("- ", "").trim();
      const parts = raw.split("|").map((part) => part.trim());

      const [type = "", title = "", location = ""] = parts;

      currentGroup.items.push({
        type,
        title,
        location,
      });
    }
  }

  if (!groups.length) {
    return marked.parse(markdown);
  }

  const groupsHtml = groups
    .map((group) => {
      const itemsHtml = group.items
        .map(
          (item) => `
            <article class="conference-item">
              <div class="conference-item-head">
                <span class="conference-badge">${escapeHtml(item.type)}</span>
              </div>

              <h3 class="conference-title">${escapeHtml(item.title)}</h3>

              <p class="conference-meta">
                <span class="conference-location">${escapeHtml(item.location)}</span>
              </p>
            </article>
          `
        )
        .join("");

      return `
        <section class="conference-year-group">
          <div class="conference-year-column">
            <div class="conference-year">${escapeHtml(group.year)}</div>
          </div>

          <div class="conference-items-column">
            <div class="conference-group-card">
              ${itemsHtml}
            </div>
          </div>
        </section>
      `;
    })
    .join("");

  return `<div class="conference-timeline">${groupsHtml}</div>`;
}

function getAwardIcon(type = "") {
  const normalized = type.toLowerCase();

  if (normalized.includes("research visit")) return "🔭";
  if (normalized.includes("travel")) return "✈️";
  if (normalized.includes("grant")) return "💰";
  if (normalized.includes("scholarship")) return "🏅";
  if (normalized.includes("fellowship")) return "🎓";
  if (normalized.includes("olympiad")) return "🧠";
  if (normalized.includes("award")) return "⭐";
  if (normalized.includes("selection")) return "📘";

  return "🏆";
}

function buildAwardsSection(markdown) {
  const lines = markdown
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const sections = [];
  let currentSection = null;

  for (const line of lines) {
    if (line.startsWith("### ")) {
      const heading = line.replace("### ", "").trim();
      currentSection = { heading, items: [] };
      sections.push(currentSection);
      continue;
    }

    if (line.startsWith("- ") && currentSection) {
      const raw = line.replace("- ", "").trim();
      const parts = raw.split("|").map((part) => part.trim());

      if (currentSection.heading === "Featured") {
        const [type = "", title = "", institution = "", year = "", description = ""] = parts;
        currentSection.items.push({
          type,
          title,
          institution,
          year,
          description,
        });
      } else if (currentSection.heading === "Olympiads & Contests") {
        const [type = "", title = "", year = "", description = ""] = parts;
        currentSection.items.push({
          type,
          title,
          institution: "",
          year,
          description,
        });
      } else {
        const [type = "", title = "", institution = "", description = ""] = parts;
        currentSection.items.push({
          type,
          title,
          institution,
          year: currentSection.heading,
          description,
        });
      }
    }
  }

  if (!sections.length) {
    return marked.parse(markdown);
  }

  const featuredSection = sections.find((section) => section.heading === "Featured");
  const olympiadSection = sections.find(
    (section) => section.heading === "Olympiads & Contests"
  );
  const yearSections = sections.filter(
    (section) =>
      section.heading !== "Featured" && section.heading !== "Olympiads & Contests"
  );

  const featuredHtml = featuredSection
    ? `
      <div class="awards-featured">
        <div class="awards-subhead">Featured Recognition</div>
        <div class="awards-featured-grid">
          ${featuredSection.items
            .map(
              (item) => `
                <article class="award-feature-card">
                  <div class="award-feature-top">
                    <span class="award-icon">${getAwardIcon(item.type)}</span>
                    <span class="award-chip">${escapeHtml(item.type)}</span>
                    <span class="award-feature-year">${escapeHtml(item.year)}</span>
                  </div>

                  <h3 class="award-feature-title">${escapeHtml(item.title)}</h3>
                  <p class="award-feature-org">${escapeHtml(item.institution)}</p>
                  <p class="award-feature-desc">${escapeHtml(item.description)}</p>
                </article>
              `
            )
            .join("")}
        </div>
      </div>
    `
    : "";

  const timelineHtml = yearSections.length
    ? `
      <div class="awards-timeline">
        ${yearSections
          .map(
            (section) => `
              <section class="awards-year-group">
                <div class="awards-year-column">
                  <div class="awards-year">${escapeHtml(section.heading)}</div>
                </div>

                <div class="awards-items-column">
                  <div class="awards-group-card">
                    ${section.items
                      .map(
                        (item) => `
                          <article class="award-item">
                            <div class="award-item-top">
                              <span class="award-icon">${getAwardIcon(item.type)}</span>
                              <span class="award-chip">${escapeHtml(item.type)}</span>
                            </div>

                            <h3 class="award-title">${escapeHtml(item.title)}</h3>

                            ${
                              item.institution
                                ? `<p class="award-org">${escapeHtml(item.institution)}</p>`
                                : ""
                            }

                            ${
                              item.description
                                ? `<p class="award-desc">${escapeHtml(item.description)}</p>`
                                : ""
                            }
                          </article>
                        `
                      )
                      .join("")}
                  </div>
                </div>
              </section>
            `
          )
          .join("")}
      </div>
    `
    : "";

  const olympiadHtml = olympiadSection
    ? `
      <div class="awards-olympiads">
        <div class="awards-subhead">Olympiads & Contests</div>
        <div class="awards-olympiad-list">
          ${olympiadSection.items
            .map(
              (item) => `
                <article class="award-mini-card">
                  <div class="award-mini-top">
                    <span class="award-icon">${getAwardIcon(item.type)}</span>
                    <span class="award-chip">${escapeHtml(item.type)}</span>
                    <span class="award-mini-year">${escapeHtml(item.year)}</span>
                  </div>
                  <h3 class="award-mini-title">${escapeHtml(item.title)}</h3>
                  <p class="award-mini-desc">${escapeHtml(item.description)}</p>
                </article>
              `
            )
            .join("")}
        </div>
      </div>
    `
    : "";

  return `
    <div class="awards-layout">
      ${featuredHtml}
      ${timelineHtml}
      ${olympiadHtml}
    </div>
  `;
}

function buildPublicationLinks(linkText = "") {
  const raw = String(linkText).trim();
  if (!raw) return "";

  const parts = raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  const linkItems = [];

  for (const part of parts) {
    if (part.startsWith("DOI=")) {
      const url = part.replace("DOI=", "").trim();
      linkItems.push({
        label: "DOI",
        href: url,
      });
    } else if (part.startsWith("ADS=")) {
      const code = part.replace("ADS=", "").trim();
      linkItems.push({
        label: "ADS",
        href: `https://ui.adsabs.harvard.edu/abs/${encodeURIComponent(code)}/abstract`,
      });
    } else if (part.startsWith("PDF=")) {
      const url = part.replace("PDF=", "").trim();
      linkItems.push({
        label: "PDF",
        href: url,
      });
    } else if (part.startsWith("Manuscript=")) {
      const url = part.replace("Manuscript=", "").trim();
      linkItems.push({
        label: "Manuscript",
        href: url,
      });
    } else if (part === "Manuscript") {
      linkItems.push({
        label: "Manuscript",
        href: "",
      });
    } else {
      linkItems.push({
        label: part,
        href: "",
      });
    }
  }

  if (!linkItems.length) return "";

  return `
    <div class="pub-links">
      ${linkItems
        .map((item) => {
          if (item.href) {
            return `
              <a class="pub-link-pill" href="${escapeHtml(item.href)}" target="_blank" rel="noopener noreferrer">
                ${escapeHtml(item.label)}
              </a>
            `;
          }

          return `
            <span class="pub-link-pill pub-link-pill-static">
              ${escapeHtml(item.label)}
            </span>
          `;
        })
        .join("")}
    </div>
  `;
}

function buildPublicationsSection(markdown) {
  const lines = markdown
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const sections = [];
  let currentSection = null;

  for (const line of lines) {
    if (line.startsWith("### ")) {
      const heading = line.replace("### ", "").trim();
      currentSection = { heading, items: [] };
      sections.push(currentSection);
      continue;
    }

    if (line.startsWith("- ") && currentSection) {
      const raw = line.replace("- ", "").trim();
      const parts = raw.split("|").map((part) => part.trim());

      const [title = "", authors = "", journal = "", links = ""] = parts;

      currentSection.items.push({
        title,
        authors,
        journal,
        links,
      });
    }
  }

  if (!sections.length) {
    return marked.parse(markdown);
  }

  const sectionsHtml = sections
    .map(
      (section) => `
        <section class="pub-group">
          <h2 class="pub-group-title">${escapeHtml(section.heading)}</h2>

          <div class="pub-list">
            ${section.items
              .map(
                (item) => `
                  <article class="pub-card">
                    <div class="pub-card-main">
                      <h3 class="pub-title">${escapeHtml(item.title)}</h3>

                      ${
                        item.authors
                          ? `<p class="pub-authors">${escapeHtml(item.authors)}</p>`
                          : ""
                      }

                      ${
                        item.journal
                          ? `<p class="pub-journal">${escapeHtml(item.journal)}</p>`
                          : ""
                      }
                    </div>

                    ${buildPublicationLinks(item.links)}
                  </article>
                `
              )
              .join("")}
          </div>
        </section>
      `
    )
    .join("");

  return `<div class="publications-layout">${sectionsHtml}</div>`;
}

function getOutreachIcon(category = "") {
  const normalized = category.toLowerCase();

  if (normalized.includes("leadership")) return "🌟";
  if (normalized.includes("service")) return "🤝";
  if (normalized.includes("scientific")) return "🔭";
  if (normalized.includes("organising")) return "📅";
  if (normalized.includes("teaching")) return "🧪";
  if (normalized.includes("mentoring")) return "🧭";
  if (normalized.includes("outreach")) return "🌌";

  return "✨";
}

function buildOutreachSection(markdown) {
  const lines = markdown
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const sections = [];
  let currentSection = null;

  for (const line of lines) {
    if (line.startsWith("### ")) {
      const heading = line.replace("### ", "").trim();
      currentSection = { heading, items: [] };
      sections.push(currentSection);
      continue;
    }

    if (line.startsWith("- ") && currentSection) {
      const raw = line.replace("- ", "").trim();
      const parts = raw.split("|").map((part) => part.trim());

      const [category = "", role = "", organization = "", year = "", description = ""] = parts;

      currentSection.items.push({
        category,
        role,
        organization,
        year,
        description,
      });
    }
  }

  if (!sections.length) {
    return marked.parse(markdown);
  }

  const featuredSection = sections.find((section) => section.heading === "Featured");
  const regularSections = sections.filter((section) => section.heading !== "Featured");

  const featuredHtml = featuredSection
    ? `
      <div class="outreach-featured">
        <div class="outreach-subhead">Featured Outreach & Service</div>
        <div class="outreach-featured-grid">
          ${featuredSection.items
            .map(
              (item) => `
                <article class="outreach-feature-card">
                  <div class="outreach-feature-top">
                    <span class="outreach-icon">${getOutreachIcon(item.category)}</span>
                    <span class="outreach-chip">${escapeHtml(item.category)}</span>
                    <span class="outreach-year">${escapeHtml(item.year)}</span>
                  </div>

                  <h3 class="outreach-title">${escapeHtml(item.role)}</h3>
                  <p class="outreach-org">${escapeHtml(item.organization)}</p>
                  <p class="outreach-desc">${escapeHtml(item.description)}</p>
                </article>
              `
            )
            .join("")}
        </div>
      </div>
    `
    : "";

  const sectionsHtml = regularSections
    .map(
      (section) => `
        <section class="outreach-group">
          <h2 class="outreach-group-title">${escapeHtml(section.heading)}</h2>

          <div class="outreach-list">
            ${section.items
              .map(
                (item) => `
                  <article class="outreach-card">
                    <div class="outreach-card-top">
                      <span class="outreach-icon">${getOutreachIcon(item.category)}</span>
                      <span class="outreach-chip">${escapeHtml(item.category)}</span>
                      <span class="outreach-year">${escapeHtml(item.year)}</span>
                    </div>

                    <h3 class="outreach-title">${escapeHtml(item.role)}</h3>
                    <p class="outreach-org">${escapeHtml(item.organization)}</p>
                    <p class="outreach-desc">${escapeHtml(item.description)}</p>
                  </article>
                `
              )
              .join("")}
          </div>
        </section>
      `
    )
    .join("");

  return `
    <div class="outreach-layout">
      ${featuredHtml}
      ${sectionsHtml}
    </div>
  `;
}

function renderMarkdownContent(path, markdown) {
  if (path.includes("content/conferences.md")) {
    return buildConferenceTimeline(markdown);
  }

  if (path.includes("content/awards.md")) {
    return buildAwardsSection(markdown);
  }

  if (path.includes("content/publications.md")) {
    return buildPublicationsSection(markdown);
  }

  if (path.includes("content/outreach.md")) {
    return buildOutreachSection(markdown);
  }

  return marked.parse(markdown);
}

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
      section.innerHTML = renderMarkdownContent(path, markdown);
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