# Mohamed Irfan — Portfolio

An existing React, Vite, and React Three Fiber portfolio. The 3D view uses one persistent Canvas, procedural scenes, and a GSAP ScrollTrigger camera timeline. On mobile, reduced-motion devices, or when Simple view is selected, the same portfolio content is presented in HTML.

## Run locally

```sh
npm install
npm run dev
```

Open the URL printed by Vite. `npm run build` creates the production files in `dist/`. The Vite server provides `/api/github` and `/api/leetcode`; their serverless handlers are in `api/`.

## Current content and assets

- `src/data/portfolio.js` holds identity, skills, contact details, architecture descriptions, and DEEP's prepared answers.
- `src/data/projects.js` orders GitHub repositories. `src/data/repositories.json` is the dated fallback when live GitHub data is unavailable. Project cards currently use conceptual title art, not screenshots.
- `src/components/LeetCode.jsx` fetches live statistics and labels cached or baseline values separately when the live request is unavailable.
- The portrait is in `public/images/`. The 3D rooms use procedural geometry; no GLB models are installed.
- **TODO: Add the real CV PDF at `public/cv/Irfan-CV.pdf`.** The Download CV link already points to `/cv/Irfan-CV.pdf` and will return 404 until that file is supplied.
- The contact section includes a Formspree form, an animated terminal prompt, and the real email, GitHub, LinkedIn, and LeetCode links. Add `VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID` to the existing `.env.local` file after creating a form in Formspree, then restart `npm run dev`. Keep the existing GitHub variables in `.env.local`.

The portfolio upgrade is being delivered one phase at a time. Phase 0 fixes layout and presentation bugs while preserving the current content and behavior.
