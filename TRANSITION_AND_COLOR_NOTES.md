# Transition & page palette changes

- Intro only eligible on the **first homepage visit in each tab session**. Session flag is set **before** animation starts, so reloading midway cannot replay it.
- Internal pages do not even render the solar loader markup; this is a robust safeguard against replay.
- Home and About keep their original palette. Research=teal, Publications=violet, Conferences=amber-orange, Awards=gold, Gallery=rose, Outreach=green, Contact=blue.
- Palette variables are scoped by `data-portfolio-page` on `<html>`; light-mode foregrounds are darker for contrast.
- To manually retest the intro in a tab, run `sessionStorage.removeItem("pradosh-intro-seen")` in browser devtools, then navigate to Home and refresh.
- Production build and visual checks should be run after upload (`hugo --minify`, browser test desktop/mobile).
