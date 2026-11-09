# Personal portfolio

A deliberately small, modular portfolio built with React, TypeScript, Vite and SCSS.

## Getting started

Use Node.js 20.19+ or 22.12+ and npm. Run `npm install`, then `npm run dev` and open the local URL printed by Vite. Use `npm run build` for a type-checked production build and `npm run preview` to serve that build locally.

## Architecture

```text
public/                 Static files served without bundling
  fonts/ images/ icons/  Content for direct URLs; each has an asset README
src/
  assets/                Imported, bundled assets
  animations/            GSAP registration, shared config and effect helpers
  components/            Reusable UI, navigation and layout pieces
  data/                  Typed project and navigation content
  hooks/                  React integrations such as Lenis and scoped GSAP
  layouts/               Route shells shared across pages
  pages/                 One folder and stylesheet per route
  styles/                SCSS tokens, base rules, layout and utilities
  types/                 Shared TypeScript domain types
```

## Stack

React and React DOM render the interface; TypeScript checks source; Vite develops and bundles. Sass is the styling system. Geist Variable is bundled from Fontsource. React Router handles the starter routes. GSAP with ScrollTrigger and `@gsap/react` powers motion, while Lenis supplies optional smooth scrolling.

## GitHub Pages

The included GitHub Actions workflow deploys the Vite build to GitHub Pages and creates a `404.html` fallback for direct visits to `/work`, `/about` and `/playground`. In the repository settings, enable GitHub Pages and select **GitHub Actions** as the source.
