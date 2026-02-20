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

---

## Reference: AstroWind (`astrowind/`)

A cloned Astro template repo used as a **design and pattern reference** — not part of this project's build. It is gitignored.

When Jatin asks to build a new section, page, or component, **check `astrowind/` first** for implementation patterns before writing from scratch.

### Quick Lookup Map

| Looking for…                | Check here in `astrowind/src/`                              |
|-----------------------------|-------------------------------------------------------------|
| **Page layouts**            | `layouts/` — Layout, PageLayout, LandingLayout, MarkdownLayout |
| **Hero sections**           | `components/widgets/Hero.astro`, `Hero2.astro`, `HeroText.astro` |
| **Features / grid sections**| `components/widgets/Features.astro`, `Features2.astro`, `Features3.astro` |
| **Steps / timeline**        | `components/widgets/Steps.astro`, `Steps2.astro`            |
| **Testimonials**            | `components/widgets/Testimonials.astro`                     |
| **Pricing tables**          | `components/widgets/Pricing.astro`                          |
| **FAQs**                    | `components/widgets/FAQs.astro`                             |
| **Stats**                   | `components/widgets/Stats.astro`                            |
| **Call to Action**          | `components/widgets/CallToAction.astro`                     |
| **Contact form**            | `components/widgets/Contact.astro`                          |
| **Header / Footer**         | `components/widgets/Header.astro`, `Footer.astro`           |
| **Brands / logos strip**    | `components/widgets/Brands.astro`                           |
| **Blog listing / posts**    | `components/widgets/BlogLatestPosts.astro`, `BlogHighlightedPosts.astro` |
| **Blog content & MDX**      | `content/post/` (markdown files with frontmatter examples)  |
| **UI primitives**           | `components/ui/` — Button, Form, Headline, Timeline, ItemGrid, Background, WidgetWrapper |
| **SEO / metadata**          | `components/common/Metadata.astro`, `CommonMeta.astro`, `SiteVerification.astro` |
| **Theme toggle**            | `components/common/ToggleTheme.astro`, `ApplyColorMode.astro` |
| **Analytics**               | `components/common/Analytics.astro`, `SplitbeeAnalytics.astro` |
| **Image optimization**      | `utils/images-optimization.ts`, `utils/images.ts`           |
| **Config (site, SEO, blog)**| `config.yaml`                                               |
| **Navigation data**         | `navigation.ts`                                             |
| **Multi-page examples**     | `pages/` — about, contact, pricing, services, landing/, homes/, blog |

### AstroWind Stack (differs from ours)

- Astro + Tailwind CSS v3 (via `@astrojs/tailwind`, **not** v4)
- Uses `astro-icon` for icons (Tabler + Flat Color Icons)
- Uses `astro-compress` for HTML/CSS/JS compression
- MDX for blog posts with reading time plugin
- `~` alias maps to `./src/` (configured in vite.resolve.alias)

### How to Use

1. **Adapting a widget** — Read the astrowind component, then rewrite it using our conventions (Tailwind v4, our color tokens, our component style).
2. **Don't copy-paste** — AstroWind uses Tailwind v3 classes and its own config system. Always translate to our stack.
3. **Layout patterns** — Reference their WidgetWrapper and Headline components for consistent section spacing and title patterns.

---

## Performance & Lighthouse Rules (Target: 100/100)

Rules derived from astrowind's patterns, adapted to our Tailwind v4 + Astro v5 stack.

### Images

- **Always use `<Image>` from `astro:assets`** — never raw `<img>` tags for local images
- **Always set `width` and `height`** — prevents Cumulative Layout Shift (CLS)
- **Above-the-fold images:** `loading="eager"` + `fetchpriority="high"` (avatar, hero)
- **Everything else:** `loading="lazy"` + `decoding="async"` (default behavior)
- **Always provide `alt` text** — empty `alt=""` only for purely decorative images
- **Use `quality={90}`** for Astro Image optimization

### Scripts

- **Theme detection must be `<script is:inline>` in `<head>`** — prevents flash of wrong theme (FOUC). We already do this.
- **Non-critical JS uses standard `<script>` tags** (Astro auto-defers these)
- **Avoid external JS libraries** — keep the bundle lean. Vanilla JS for interactions.
- **Analytics (if added later):** load via `partytown` or `defer` — never block rendering

### CSS & Styling

- **Tailwind utilities first** — no custom CSS unless truly needed
- **CSS custom properties for theming** — we use `--color-*` tokens in `global.css` for light/dark mode
- **`compressHTML: true`** and **`cssMinify: true`** are already enabled in astro config
- **No unused CSS** — Tailwind v4 tree-shakes automatically

### Animations (Inspired by AstroWind's Intersection Observer Pattern)

When we add scroll animations, follow this approach:

1. **Use Intersection Observer API** — not scroll event listeners
2. **Only animate `opacity` and `transform`** — these are GPU-accelerated and don't cause layout reflows
3. **Respect `prefers-reduced-motion`** — wrap animation classes with `motion-safe:` prefix
4. **Batch DOM writes in `requestAnimationFrame`** — prevents layout thrashing
5. **Use `animation-fill-mode: both`** — holds initial state before animation and final state after
6. **Stagger delay for sequential elements** — 100ms between siblings for a cascading effect
7. **Mobile-first:** consider disabling complex animations on small screens (`md:` prefix)
8. **Standard animation:** fade-in + slide-up (translateY 2rem → 0) over 1s is the baseline

Example pattern for a scroll-animated section:
```
<!-- Container: start invisible, animate on intersection -->
<div class="motion-safe:md:opacity-0 motion-safe:md:intersect:animate-fade">
  <slot />
</div>
```

### CLS Prevention

- Every `<Image>` must have explicit `width` + `height`
- Use `aspect-ratio` CSS where dynamic sizing is needed
- No layout-shifting content injected after load (avoid late-loading embeds without placeholders)
- Theme toggle must not cause layout shift — already handled with our fixed-position button

### Fonts

- **Prefer system fonts or a single variable font** — multiple font files hurt LCP
- Currently using system font stack (no external font files = zero font load cost)
- If adding a custom font: use `@fontsource-variable/*` for self-hosted variable fonts (no Google Fonts CDN round-trip)

### SEO Checklist (Every Page)

- `<title>` tag (unique per page)
- `<meta name="description">` (unique per page)
- `<link rel="canonical">` (absolute URL)
- Open Graph tags: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- Twitter tags: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- JSON-LD structured data (`<script type="application/ld+json">`)
- Semantic HTML: `<main>`, `<section>`, `<nav>`, `<header>`, `<footer>` with `aria-labelledby`
- All interactive elements need `aria-label` or visible label text
- `lang="en"` on `<html>` tag

### Accessibility

- **Every button** must have `aria-label` if no visible text
- **Decorative elements** get `aria-hidden="true"`
- **Focus management:** visible focus rings, focus traps in modals
- **Keyboard navigation:** all interactive elements reachable via Tab, Escape closes modals
- **Color contrast:** minimum 4.5:1 for body text, 3:1 for large text
- **Screen reader text:** use `sr-only` class for visually hidden but accessible content
