# Personal portfolio

A deliberately small, modular starting point for a portfolio built with React, TypeScript, Vite and SCSS. The pages are route-ready placeholders; this foundation does not impose a finished visual design.

## Getting started

Use Node.js 20.19+ or 22.12+ and npm. Run `npm install`, then `npm run dev` and open the local URL printed by Vite. Use `npm run build` for a type-checked production build and `npm run preview` to serve that build locally.

## Architecture

```text
public/                 Static files served without bundling
  fonts/ images/ icons/  Content for direct URLs; each has an asset README
src/
  assets/                Imported, bundled assets
  animations/            GSAP registration, shared config and effect helpers
  components/             Reusable UI, navigation and layout pieces
  data/                   Typed project and navigation content
  hooks/                  React integrations such as Lenis and scoped GSAP
  layouts/                Route shells shared across pages
  pages/                  One folder and stylesheet per route
  styles/                 SCSS tokens, base rules, layout and utilities
  types/                  Shared TypeScript domain types
```

### Where to add things

- Add a page component and stylesheet in `src/pages/<Name>/`, document the folder, then add its route in `src/App.tsx`.
- Put shared controls in `src/components/common/`; site chrome belongs in `src/components/navigation/`.
- Put small imported images and icons in `src/assets/`; use `public/images/`, `public/icons/` or `public/fonts/` for files referenced by stable URL.
- Add project content in `src/data/projects.ts` using `src/types/project.ts`.
- Keep global SCSS tokens and foundations in `src/styles/`; keep one-off component styles beside the component as SCSS modules.
- Put generic GSAP effects in `src/animations/effects/`; build page-specific timelines in components with `useScrollAnimation` so cleanup follows component lifetime.

## Stack

React and React DOM render the interface; TypeScript checks source; Vite develops and bundles. Sass is the only styling system. Geist Variable is bundled from Fontsource, so there is no runtime font request. React Router handles the four starter routes. GSAP with ScrollTrigger and `@gsap/react` powers motion. Lenis supplies optional smooth wheel scrolling and synchronizes its RAF with GSAP's ticker. Lucide React is available for interface icons.

## Motion lifecycle

`src/animations/gsapConfig.ts` registers GSAP plugins once. `LenisProvider` creates one Lenis instance, skips it for reduced-motion users, synchronizes updates to ScrollTrigger, and destroys it at unmount. `useScrollAnimation` scopes selectors to a component root and uses `useGSAP` context cleanup. Effect helpers return animations for that context to revert. Prefer `once` entrance triggers; pinning and horizontal movement should be introduced only for content where the interaction remains understandable without motion. ScrollTrigger configurations use `invalidateOnRefresh` where measurements can change.

## Accessibility and performance

Starter pages use semantic landmarks, a skip link and visible focus styles. The global stylesheet honors `prefers-reduced-motion`; Lenis is disabled under that preference. Use descriptive image alt text, set intrinsic image dimensions or aspect ratios, and lazy-load below-the-fold images to prevent shifts. Geist Variable is local to the bundle. Avoid animating layout properties when transforms and opacity suffice.

## Configuration notes

The project requires no API keys or environment variables. The Geist package is included in the dependency set. To host self-managed font files instead, place licensed WOFF2 assets in `public/fonts/` and define `@font-face` in the typography partial. React Router's history fallback must be enabled by any static host for direct visits to `/work`, `/about` and `/playground`. The included GitHub Actions workflow deploys the Vite build to GitHub Pages and creates the Pages artifact with a `404.html` fallback for those routes. Enable GitHub Pages for the repository and select **GitHub Actions** as the source.
