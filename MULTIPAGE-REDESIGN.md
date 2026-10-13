# Multi-page portfolio redesign

The original landing hero is retained verbatim in `layouts/partials/sections/home.html`.
The academic sections were moved from the long scrolling homepage to dedicated Hugo section pages.

- `/` — original hero plus short cards linking to other pages
- `/about/` — biography and academic journey
- `/research/` — existing research collection, with individual project pages
- `/conferences/` — filterable conference card explorer
- `/awards/` — featured distinctions and categorized award explorer
- `/publications/` — publication list
- `/gallery/` — photo gallery
- `/outreach/` — outreach activities
- `/contact/` — profile links and contact details

## Run locally

Install Hugo (extended or standard) and run `hugo server` from the project folder. Open `http://localhost:1313/`.
Use `hugo --minify` to build. GitHub Actions workflow remains in place.

Original content remains in `data/*.json`; no academic entries have been removed.
Section layouts use `layouts/partials/sections/` to simplify future updates.
