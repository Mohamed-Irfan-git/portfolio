# Mohamed Irfan — Portfolio

A portrait-led portfolio for Mohamed Irfan, focused on AI engineering, cloud and microservices development, and competitive programming. The site uses semantic HTML, CSS, and native JavaScript modules; it has no build step or installed runtime dependencies.

## Run locally

Node 18 or newer is required. From the project directory:

```sh
node preview-server.mjs
```

Open `http://localhost:8000`. The preview server serves same-origin GitHub and LeetCode endpoints. JavaScript also falls back to the public GitHub API and, if that is unavailable, to the dated public repository snapshot in `assets/data/public-repositories.json`. LeetCode shows a clear profile link if live stats cannot load.

## Content and design

- `js/portfolio-data.js` contains identity, education, skills, social links, and prepared answers for the local DEEP portfolio guide.
- `js/github-projects.js` loads public GitHub repository data and controls featured ordering. Project imagery is explicitly labeled conceptual artwork; it is not presented as a screenshot of the repository.
- `js/leetcode-performance.js` renders the public LeetCode profile data.
- `css/` contains design tokens, layout, responsive rules, and reduced-motion behavior.
- `assets/images/irfan-editorial.webp` is an identity-preserving editorial edit of the supplied portrait. `assets/images/connected-systems.webp` is a generated conceptual artwork for the gallery.
- `design-qa.md` records the visual and browser checks; `qa/` contains review captures.

External Google Fonts enhance the typography. System font fallbacks remain usable when fonts are unavailable. The site needs no API key for local preview. An optional `GITHUB_TOKEN` can be set in a serverless environment to raise GitHub API limits.
