# Hugo-ready version of the site

## Run locally

```bash
hugo server
```

## Build

```bash
hugo
```

## Structure

- `content/` contains the research pages as Hugo content.
- `layouts/` contains the homepage, research list, and research single-page templates.
- `static/` contains the original CSS, JS, images, icons, PDF, robots.txt, and `.nojekyll`.

## Notes

- The homepage was preserved as a Hugo template so your current design stays intact.
- Research detail pages were converted into Hugo markdown content with HTML allowed.
- This is a source-structured Hugo project, ready to edit and deploy with Hugo.


## Easier content editing

Most homepage content now lives in `data/site.json`.
The long academic journey block lives in `content/snippets/academic-journey.md`.
That means you can update text-heavy sections without touching the Hugo templates.
