# Project: jatinthummar.github.io

Personal portfolio site for **Jatin Thummar — Frontend Engineer**.

## Stack

- **Framework:** Astro v5 (static site generator)
- **Styling:** Tailwind CSS v4 (via `@tailwindcss/vite` plugin)
- **Language:** TypeScript (strict mode)
- **Build:** Vite (bundled with Astro)
- **Deployment:** GitHub Pages via GitHub Actions (push to `main` auto-deploys)

## Commands

- `npm run dev` — Start dev server (localhost:4321)
- `npm run build` — Production build to `dist/`
- `npm run preview` — Preview production build locally

## Project Structure

```
src/
  pages/         → Astro pages (file-based routing)
  assets/        → Optimizable images (processed by Astro)
  styles/        → Global CSS (global.css imports Tailwind)
public/          → Static assets served as-is (favicon, og-image, robots.txt)
.github/workflows/deploy.yml → CI/CD pipeline
```

## Key Conventions

- **Single-page site** — `src/pages/index.astro` is the only page currently
- **Dark theme** — zinc-950 background, zinc-100 text, zinc-400/300 for muted elements
- **Astro Image component** — Use `<Image>` from `astro:assets` for optimized images (quality=90)
- **Tailwind utilities first** — Use utility classes; custom CSS only for complex interactions
- **SEO tags** — Every page must include OG tags, Twitter meta, JSON-LD structured data, and canonical URL
- **HTML compression** and **CSS minification** are enabled in astro.config.mjs

## Deployment

- **URL:** https://jatinthummar.github.io
- **Branch:** `main` — every push triggers build + deploy
- **Node version:** 22 (set in GitHub Actions workflow)
- **Install:** `npm ci` (uses lock file for reproducible builds)

## Git Conventions

- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, etc.
- Scope is optional but encouraged: `feat(seo): ...`
