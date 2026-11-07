# Design QA — Mohamed Irfan portfolio redesign

**Final result: passed**

Source visual truth: the portfolio as it existed before this pass, captured from `/tmp/portfolio-before/`, plus the owner-supplied portrait at `/home/irfan/Pictures/IMG-20240922-WA0110.jpg` and the cinematic editorial direction in the pasted brief. This is a redesign, so palette and composition changes are intentional. The source was not a pixel-matching mockup.

Implementation evidence: [hero before and after](qa/hero-before-after.webp), [desktop full page](qa/desktop.webp), [mobile full page](qa/mobile.webp), [mobile offline/reduced-motion state](qa/offline-mobile.webp). Source and implementation hero screenshots were each 1440 × 1000 CSS pixels at device scale factor 1, on the same route and at initial scroll position; the side-by-side evidence scales both equally to 800 × 556. Full-page implementation: 1440 × 6262. Mobile implementation: 390 × 7106 at device scale factor 1. The old full-page capture hid later sections until scrolling triggered its reveal effects, so it was not used for one-to-one later-section judgment.

## Findings and resolution

- **P1, resolved — About portrait stretched the section.** The first implementation screenshot showed the secondary portrait at the height of its HTML attribute, making the About scene unnecessarily tall. Fixed by setting explicit desktop and mobile crop heights. The revised desktop and mobile captures show the portrait as a compact editorial inset and the page remains readable.
- **P2, resolved — Project imagery retained the previous ocean theme.** The first gallery capture used underwater artwork that conflicted with the new engineering direction. Replaced it with a dark bronze connected-systems image and labeled it as conceptual art. The revised full-page capture shows a cohesive gallery. It is not passed off as a real product screenshot.
- **P2, resolved — GitHub failure left the gallery empty.** A verified public repository snapshot now keeps eight real projects and their actual links available when both the local proxy and direct GitHub API fail. The offline state names the snapshot date.

## Fidelity and usability review

- **Typography:** Space Grotesk creates a strong name and section hierarchy, DM Sans keeps body copy readable, and italic Instrument Serif supplies the editorial accent; browser font checks confirmed that italic face loaded. System fallbacks remain readable if Google Fonts are blocked. The 1440 px and 390 px captures show no clipped display words.
- **Layout and spacing:** Desktop uses a split portrait hero and distinct chapter layouts. Mobile recomposes each section into a single reading flow; 320, 390, 768, 1024, and 1920 px browser widths had no horizontal document overflow.
- **Color and contrast:** Charcoal, ivory, and muted bronze replace the former saturated underwater palette. Body text and controls remain legible across the dark sections and the warm contact finale. Focus outlines use the bronze accent.
- **Assets:** The supplied person's face, pose, and clothing remain recognizable in the edited portrait. The gallery artwork is an abstract visual metaphor, explicitly marked as conceptual. Both project-bound assets are local, optimized WebP files.
- **Copy and authenticity:** Name, university, public profiles, email, and project metadata come from the existing portfolio or public repository data. No employer, award, performance total, or project behavior was invented. LeetCode numbers are fetched live and show an explicit unavailable state when needed. A later verification saw LeetCode return HTTP 502, and the profile link remained usable.
- **Interactions:** Browser checks passed for project next/previous and keyboard selection, skill expansion, architecture explanation, guide messaging and close behavior, mobile navigation, working contact links, GitHub snapshot fallback, LeetCode fallback, reduced motion, and essential content with JavaScript disabled. No uncaught browser errors were observed.

## Remaining limits

The public GitHub API can rate-limit visitors, and LeetCode can reject requests; the verified fallback states handle both. Project artwork is conceptual because screenshots are not available for every repository. The layout was visually reviewed in headless Brave through Playwright; no cloud browser preview or public deployment was requested.
