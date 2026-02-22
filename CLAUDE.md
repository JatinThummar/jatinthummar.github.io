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
  layouts/       → BaseLayout (shared HTML shell, SEO, theme toggle)
  pages/         → Astro pages (file-based routing)
  components/    → Reusable UI components (blog/, cards, buttons)
  content/blog/  → Markdown blog posts (Astro content collections)
  utils/         → Helper functions (blog.ts)
  assets/        → Optimizable images (processed by Astro)
  styles/        → Global CSS (global.css imports Tailwind)
public/          → Static assets served as-is (favicon, og-image, robots.txt)
.github/workflows/deploy.yml → CI/CD pipeline
```

## Key Conventions

- **Multi-page site** — uses `BaseLayout.astro` for shared HTML shell across all pages
- **Dark theme** — zinc-950 background, zinc-100 text, zinc-400/300 for muted elements
- **Astro Image component** — Use `<Image>` from `astro:assets` for optimized images (quality=90)
- **Tailwind utilities first** — Use utility classes; custom CSS only for complex interactions
- **SEO tags** — Every page must include OG tags, Twitter meta, JSON-LD structured data, and canonical URL
- **HTML compression** and **CSS minification** are enabled in astro.config.mjs

## Design System

### Color Tokens (semantic, theme-aware via CSS custom properties)

| Token             | Usage                                  | Dark               | Light             |
|-------------------|----------------------------------------|---------------------|-------------------|
| `surface`         | Page background                        | #161618             | #ffffff           |
| `on-surface`      | Primary body text                      | #f4f4f5             | #1a1a1a           |
| `muted`           | Secondary/greeting text, metadata      | #a1a1aa             | #71717a           |
| `subtle`          | Description paragraphs                 | #d4d4d8             | #3f3f46           |
| `emphasis`        | Highlighted keywords, headings, bold   | #ffffff             | #09090b           |
| `card-bg`         | Card backgrounds                       | #1e1e20             | #f9f9f9           |
| `border`          | Separators, card borders               | #27272a             | #e4e4e7           |
| `tag-bg/tag-text` | Pill tags                              | rgba(39,39,42,0.6)  | #f4f4f5/#52525b   |
| `btn-icon-*`      | Icon buttons (social, theme toggle)    | —                   | —                 |
| `btn-primary-*`   | Primary CTA button                     | —                   | —                 |

All tokens defined in `src/styles/global.css` via `@theme inline` (Tailwind v4) and swapped between `:root` (dark) and `.light`.

### Typography Scale

- **Page title (h1):** `text-4xl font-bold tracking-tight`
- **Inner page title (h1):** `text-3xl font-bold tracking-tight`
- **Section heading (h2):** `text-xl font-bold`
- **Card title (h3):** `text-base font-semibold text-emphasis`
- **Card subtitle:** `text-muted text-xs`
- **Body/description:** `text-subtle text-sm leading-relaxed` (or `text-lg` for hero)
- **Metadata (dates, read time):** `text-muted text-xs`
- **Greeting/secondary:** `text-muted text-lg`
- **Highlighted keywords:** `text-emphasis font-medium`

### Spacing & Layout

- **Page container:** `max-w-xl w-full mx-auto py-20`
- **Body wrapper:** `min-h-screen bg-surface text-on-surface px-6`
- **Home page:** adds `flex items-center justify-center` for vertical centering
- **Inner pages:** top-aligned flow (no centering), with back-link at top
- **Section gaps:** `mb-12` between major sections, `<Separator class="my-12" />`
- **Card gaps:** `mt-4` between stacked cards
- **Tag pills:** `px-3 py-1 text-sm rounded-full bg-tag-bg text-tag-text`

### Interactive Patterns

- **Card hover:** `hover:scale-[1.01] active:scale-[0.99]` with `transition-transform`
- **Button hover:** `hover:scale-105 active:scale-95` with `transition`
- **Icon buttons:** `rounded-xl bg-btn-icon-bg` with hover color swap
- **Cards:** `rounded-xl bg-card-bg p-5` (ProjectCard) or `border border-border` (BookmarkCard)
- **Text links:** `text-muted hover:text-emphasis transition text-sm`
- **Back links:** `inline-flex items-center gap-1.5 text-muted hover:text-emphasis transition text-sm`

### Component Conventions

- TypeScript `interface Props` in frontmatter for all components
- Use `class:list` for conditional class merging
- Polymorphic tags via `const Tag = condition ? 'a' : 'div'`
- External links: `target="_blank" rel="noopener noreferrer"`
- Internal links: no `target` attribute
- SVG icons inline (no icon library) — `fill="currentColor"` or `stroke="currentColor"`
- Slots for composable children (e.g., ProjectCard nests BookmarkCard)

## Architecture

### Layouts

- **`src/layouts/BaseLayout.astro`** — Shared HTML shell for ALL pages
  - Owns: `<html>`, `<head>` (meta, SEO, favicons, FOUC script), theme toggle, `<body>`
  - Props: `title`, `description`, `canonicalUrl?`, `ogType?`, `ogImage?`, `jsonLd?`, `bodyClass?`
  - Every new page MUST use `<BaseLayout>` — never create raw `<html>` in a page file

### Multi-Page Conventions

- Each page provides its own SEO props to BaseLayout
- Canonical URLs are always absolute: `https://jatinthummar.github.io/path`
- JSON-LD type varies by page: `Person` (home), `AboutPage` (about), `Blog`/`BlogPosting` (blog)
- Inner pages: same `max-w-xl` container, with a back-link at top (not a navbar)
- Home page uses centered layout (`flex items-center justify-center`), inner pages use top-aligned flow

### Content Collections (Blog)

- **Config:** `src/content.config.ts` — Astro v5 content collections with glob loader
- **Posts:** `src/content/blog/*.md` — one file per post, filename = slug (kebab-case)
- **Frontmatter schema:** title (required), description (required), publishDate (required), updatedDate?, tags[], draft?, image?
- **Utilities:** `src/utils/blog.ts` — `fetchPosts()`, `formatDate()`, `estimateReadingTime()`
- **Draft posts:** `draft: true` in frontmatter — excluded from production build
- **Prose styling:** `@tailwindcss/typography` with `.prose-custom` class mapped to our theme tokens

### Component Organization

```
src/
  layouts/
    BaseLayout.astro          → HTML shell + SEO + theme toggle
  components/
    Separator.astro           → Dashed divider
    SocialButton.astro        → Social icon button
    ProjectCard.astro         → Project showcase card
    BookmarkCard.astro        → External link card with logo
    blog/
      BlogPostCard.astro      → Blog list item card
  pages/
    index.astro               → Home page
    about.astro               → About page
    blog/
      index.astro             → Blog list page
      [slug].astro            → Individual blog post
  content/
    blog/                     → Markdown blog posts
  utils/
    blog.ts                   → Blog data fetching & formatting
  styles/
    global.css                → Tailwind import + theme tokens + prose overrides
```

## Build & Deployment

- **URL:** https://jatinthummar.github.io
- **Branch:** `main` — every push triggers build + deploy via GitHub Actions
- **Node version:** 22 (set in GitHub Actions workflow)
- **Install:** `npm ci` (uses lock file for reproducible builds)

### CI Build Rules

- **No external image/asset fetches at build time** — GitHub Actions has limited/unreliable network access to third-party CDNs. Always store images (logos, icons, QR codes) as local files in `src/assets/` and read from disk. Fonts from Google Fonts CDN are the only exception (used by the blog OG image generator and proven reliable).
- **Always run `npm run build` locally before pushing** — catch satori rendering errors, missing assets, or broken imports before CI fails.
- **OG image assets live in `src/assets/`** — avatar (`avatar-color.png`), QR code (`qr-code.png`), and tech logos (`logos/*.svg`) are all local. If adding new logos or images to OG generators, download them locally first.

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
