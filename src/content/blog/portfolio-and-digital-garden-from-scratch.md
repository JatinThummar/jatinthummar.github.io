---
title: 'Building a Portfolio and Digital Garden from Scratch'
description: 'Every framework compared honestly, real implementation code, and repos to study for building a personal site that doubles as a connected knowledge base.'
publishDate: 2026-03-13
tags: ['engineering', 'frontend', 'tools']
---

You want a personal site. Not just a portfolio with a hero section and three project cards. You want something that _grows_ with you, where your notes link to each other, backlinks generate automatically, and a graph shows how your thinking connects over time.

That's a **digital garden**. Pair it with a portfolio and you get a site that does two things well: it shows what you've built, and it shows how you think.

The problem is that most tools are great at one of these and terrible at the other. Portfolio templates don't understand linked notes. Garden tools don't give you design freedom. So you end up duct-taping two systems together or settling for less.

This guide covers both paths honestly: what works, what doesn't, and exactly how to build it.

---

## Why build a digital garden at all?

A traditional blog is a timeline. You publish a post, it gets old, you move on. A digital garden flips that model. Notes are living documents. They start as seedlings, grow as you learn more, and eventually become evergreen references. They link to each other with `[[wikilinks]]` and build a web of connected knowledge over time.

It's how your brain actually works. You don't think in reverse-chronological order. You think in connections.

Three features make this real. **Bidirectional links**: if page A links to page B, page B knows about it. **Backlinks**: every page shows a list of pages that reference it. **Graph view**: an interactive visualization of how all your notes connect. These are what separate a digital garden from a folder of markdown files.

---

## Every framework, honestly compared

Eight tools claim to solve this problem. Most don't. Here's what actually works for a combined portfolio and digital garden in 2025-2026.

### Astro: full control, assembly required

[Astro](https://github.com/withastro/astro) (~50k+ stars) is the strongest general-purpose choice for a frontend engineer. Its islands architecture ships zero client-side JavaScript by default, hydrating only the interactive components you explicitly opt into. Content Collections give you type-safe frontmatter schemas via Zod. You can mix React, Preact, Svelte, Vue, or Solid in the same project. CSS is fully yours.

The catch: **digital garden features are entirely DIY**. Astro has no native wikilink parsing, no backlink generation, and no graph view. You'll wire these up yourself using [`remark-wiki-link`](https://www.npmjs.com/package/remark-wiki-link) for `[[wikilinks]]`, a build-time backlinks map via `getCollection()`, and a D3.js or `force-graph` component for visualization. Community projects like [`braindb`](https://github.com/stereobooster/braindb) and [`starlight-site-graph`](https://fevol.github.io/starlight-site-graph/getting-started/) help, but nothing is turnkey.

TypeScript support is first-class. GitHub Pages deployment uses an [official action](https://github.com/marketplace/actions/astro-deploy) and works cleanly.

**Best for**: engineers who want total design freedom and can invest a weekend wiring up the garden plumbing.

### Quartz v4: purpose-built for linked notes

[Quartz v4](https://github.com/jackyzha0/quartz) (~8-10k stars) is the only tool on this list designed _specifically_ for digital gardens. Out of the box you get everything: `[[wikilinks]]` with aliases, automatic backlinks, an interactive D3.js graph view, full-text search, popover link previews, and [Obsidian-flavored markdown](https://quartz.jzhao.xyz/) support. Even transclusions, tag pages, callouts, and LaTeX work without configuration.

The architecture uses a custom build pipeline powered by unified/remark/rehype for markdown, esbuild for bundling, [Preact for JSX templating](https://quartz.jzhao.xyz/advanced/architecture), and Shiki for syntax highlighting. It's written entirely in TypeScript.

**The limitation is design flexibility.** Quartz uses a [single global layout](https://quartz.jzhao.xyz/layout) with slots (header, left sidebar, right sidebar, beforeBody, afterBody, footer). You can create custom `.tsx` components and override styles via `custom.scss`. But JSX is templates-only: no React hooks, no `useState`, no `onClick` handlers. Interactivity requires vanilla DOM manipulation in [`.inline.ts` scripts](https://quartz.jzhao.xyz/advanced/creating-components). Building a visually rich portfolio landing page means working against the grain.

One gotcha: Quartz generates `file.html` (not `file/index.html`), so trailing-slash URLs [break on GitHub Pages](https://quartz.jzhao.xyz/hosting). Cloudflare Pages handles this better.

**Best for**: anyone whose primary goal is the digital garden, with the portfolio as a secondary concern.

### Eleventy (11ty): the underrated middle ground

[Eleventy v3.0](https://github.com/11ty/eleventy) (~17k+ stars, released October 2024 with full ESM support) offers a compelling balance. Zero client-side JS by default, complete design control, and the most mature wikilinks plugin ecosystem after Quartz. The [`@photogabble/eleventy-plugin-interlinker`](https://github.com/photogabble/eleventy-plugin-interlinker) supports wikilinks, aliases, embeds, backlink tracking, and dead link reporting.

The tradeoff: 11ty uses template languages (Nunjucks, Liquid) rather than JSX or Astro components. TypeScript isn't natively supported in config or templates. If you're deeply invested in TypeScript-first development, 11ty will feel dated compared to Astro.

**Best for**: developers who want design control with less framework overhead and better garden plugin support out of the box.

### The rest, and why they don't fit

**Hugo** ([~80k stars](https://github.com/gohugoio/hugo)) builds fast but uses Go templates with no JS/TS integration. The digital garden ecosystem is fragmented.

**Next.js** ([~130k stars](https://github.com/vercel/next.js)) is overkill for a static personal site. Digital garden features are 100% DIY. GitHub Pages is a second-class deployment target. The original [Contentlayer is abandoned](https://github.com/timlrx/contentlayer2), and community forks add friction that isn't worth it here.

**VitePress** ([~14k stars](https://github.com/vuejs/vitepress)) is documentation-first. The [`nolebase-integrations`](https://nolebase-integrations.ayaka.io/pages/en/integrations/markdown-it-bi-directional-links/) plugin adds bidirectional links, but the default layout screams "docs site." Vue-only.

**Foam** ([~15k stars](https://github.com/foambubble/foam)) is a VS Code extension, not a site generator. Great for authoring wikilinked notes inside your editor, but you still need a separate tool to publish them.

**Dendron** ([~6.8k stars](https://github.com/dendronhq/dendron)) is effectively dead. Active development ceased in early 2023. Don't adopt for new projects.

### At a glance

|  | Astro | Quartz v4 | 11ty | Hugo | Next.js | VitePress |
| --- | --- | --- | --- | --- | --- | --- |
| **Wikilinks** | DIY (remark plugin) | Native | Plugin | DIY | DIY | Plugin |
| **Backlinks** | DIY | Native | Plugin | DIY | DIY | DIY |
| **Graph view** | DIY | Native (D3) | DIY | DIY | DIY | DIY |
| **TypeScript** | First-class | First-class | Moderate | Minimal | First-class | Good |
| **Custom design** | Total freedom | Constrained | Total freedom | Go templates | Total freedom | Vue-based |
| **GitHub Pages** | Official action | Official workflow | Trivial | Trivial | Possible | Easy |

---

## The recommendation

If you know TypeScript and want full design control, **go with Astro**. You'll spend a weekend wiring up backlinks, wikilinks, and a graph view. After that, you own every component and every pixel.

If the garden is the main thing and the portfolio is secondary (project writeups, not a design showcase), **Quartz v4 gets you publishing in hours**. You can customize it more than people think, but you'll always be working within its architecture.

A **hybrid approach** works too: Quartz for the `/garden` subdirectory, a separate Astro site for the portfolio. The tradeoff is maintaining two build systems.

---

## How to build it with Astro

### Project setup

```bash
npm create astro@latest my-site
cd my-site
npx astro add react    # for interactive components (graph view)
npm install remark-wiki-link reading-time mdast-util-to-string
npm install d3 pagefind
```

### Content collections with typed schemas

Define your content in `src/content.config.ts`:

```typescript
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    date: z.date().optional(),
    draft: z.boolean().default(false),
    growth: z.enum(['seedling', 'budding', 'evergreen']).default('seedling'),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tech: z.array(z.string()),
    url: z.string().optional(),
    repo: z.string().optional(),
    featured: z.boolean().default(false),
    date: z.date(),
  }),
});

export const collections = { notes, projects };
```

The `growth` field is how digital gardens track the maturity of a note: seedling (rough idea), budding (developing), evergreen (polished). Zod validates all of this at build time.

### Wikilinks: connecting your notes

Add [`remark-wiki-link`](https://www.npmjs.com/package/remark-wiki-link) to your Astro config to parse `[[Page Name]]` syntax:

```javascript
// astro.config.mjs
import wikiLinkPlugin from 'remark-wiki-link';

export default defineConfig({
  markdown: {
    remarkPlugins: [
      [wikiLinkPlugin, {
        hrefTemplate: (permalink) => `/notes/${permalink}`,
        pageResolver: (name) => [name.replace(/ /g, '-').toLowerCase()],
        permalinks: [], // populated at build time
      }],
    ],
  },
});
```

For more robust resolution that handles aliases, cross-collection links, and broken link detection, you can build a [custom remark plugin](https://alexop.dev/posts/adding-obsidian-wiki-links-to-astro-blog/) that loads all collection entries at init time and resolves links against them.

### Backlinks: the reverse index

This is where the garden comes alive. Backlinks are computed at build time by scanning all pages for outgoing links, then [inverting the index](https://codemacabre.com/notes/backlinks-in-astro/):

```astro
---
import { getCollection } from 'astro:content';
const { currentSlug } = Astro.props;

const allNotes = await getCollection('notes');
const linkRegex = /\[\[([^\]|]+?)(?:\|[^\]]+)?\]\]/g;
const backlinks = [];

for (const note of allNotes) {
  const matches = [...note.body.matchAll(linkRegex)];
  for (const match of matches) {
    const target = match[1].replace(/ /g, '-').toLowerCase();
    if (target === currentSlug) {
      backlinks.push({ title: note.data.title, url: `/notes/${note.id}` });
      break;
    }
  }
}
---
{backlinks.length > 0 && (
  <section class="backlinks">
    <h3>Pages that link here</h3>
    <ul>
      {backlinks.map(bl => <li><a href={bl.url}>{bl.title}</a></li>)}
    </ul>
  </section>
)}
```

This runs at build time for each page. The backlinks list is baked into the HTML with zero runtime cost.

### Graph view: visualizing connections

Generate graph data as a JSON endpoint:

```typescript
// src/pages/graph-data.json.ts
import { getCollection } from 'astro:content';

export async function GET() {
  const notes = await getCollection('notes');
  const linkRegex = /\[\[([^\]|]+?)(?:\|[^\]]+)?\]\]/g;

  const nodes = notes.map(n => ({
    id: n.id, title: n.data.title, tags: n.data.tags
  }));
  const links: { source: string; target: string }[] = [];

  for (const note of notes) {
    const matches = [...note.body.matchAll(linkRegex)];
    for (const match of matches) {
      const target = match[1].replace(/ /g, '-').toLowerCase();
      if (nodes.some(n => n.id === target)) {
        links.push({ source: note.id, target });
      }
    }
  }

  return new Response(JSON.stringify({ nodes, links }));
}
```

Then render with [`force-graph`](https://github.com/vasturiano/force-graph) (Canvas-based, great performance) or `d3-force` in a React component, hydrated as an Astro island with `client:visible`. The `react-force-graph-2d` package gives you drag, zoom, and click-to-navigate out of the box.

### Search with Pagefind

[Pagefind](https://pagefind.app/) is the clear winner for static site search. Written in Rust, runs as WASM in the browser, and generates a chunked index that's only 100-300KB even for large sites. Zero backend.

```bash
# Add to your build script
npx pagefind --site dist
```

Add `data-pagefind-body` to your `<main>` element to scope what gets indexed. Pagefind provides both a [drop-in UI component](https://pagefind.app/docs/) and a JavaScript API for custom search interfaces.

### The rest of the feature set

**Syntax highlighting**: Astro uses [Shiki](https://github.com/shikijs/shiki) by default, the same engine as VS Code. Configure dual themes for dark/light mode in `markdown.shikiConfig.themes`. Zero client-side JS.

**Reading time**: A custom remark plugin using [`reading-time`](https://www.npmjs.com/package/reading-time) and `mdast-util-to-string`. Astro's official docs include a recipe for this.

**Tags and tag pages**: Define tags in frontmatter as an array. Create `src/pages/tags/[tag].astro` using `getStaticPaths()` to generate a page for each tag. Pure static generation.

**RSS feed**: Use [`@astrojs/rss`](https://docs.astro.build/en/recipes/rss/) (official package). Create `src/pages/rss.xml.ts` with a `GET` function.

**Dark/light mode**: CSS custom properties on a `data-theme` attribute, toggled via a small inline script in `<head>` that checks `localStorage` first, then `prefers-color-scheme`. The inline placement [prevents flash of wrong theme](https://whitep4nth3r.com/blog/best-light-dark-mode-theme-toggle-javascript/).

**Table of contents**: Astro's `entry.render()` returns a `headings` array with `{ depth, slug, text }`. Build a component that maps over it. Add `rehype-autolink-headings` for clickable heading anchors.

---

## How to build it with Quartz v4

If you chose the faster path:

```bash
git clone https://github.com/jackyzha0/quartz.git my-garden
cd my-garden
npm i
npx quartz create  # initialize content folder
```

Write markdown files in `content/`. Run `npx quartz build --serve` for [local preview](https://quartz.jzhao.xyz/) on `localhost:8080` with hot reload.

### Customizing the design

Override styles in `quartz/styles/custom.scss`. The entire color scheme is configurable in [`quartz.config.ts`](https://quartz.jzhao.xyz/configuration) via the `theme` field. Create custom components as `.tsx` files in `quartz/components/`, place them into [layout slots](https://quartz.jzhao.xyz/layout) in `quartz.layout.ts`.

For conditional rendering by section (different layouts for portfolio pages versus garden notes), create a higher-order component that checks `fileData.slug` or `fileData.frontmatter`. A [community pattern by aderylo.com](https://aderylo.com/Resources/Quartz/Custom-layout-based-on-file-properties) uses an `OnlyFor` wrapper for exactly this.

### The upstream update problem

Because you fork and modify Quartz source files directly, pulling upstream updates can cause merge conflicts. Keep customizations isolated in `custom.scss` and separate component files. Avoid modifying core files unless necessary.

---

## Deploying to GitHub Pages

Both tools deploy free to GitHub Pages via GitHub Actions. Set your repo's **Settings > Pages > Source** to "GitHub Actions."

### Astro deployment

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: withastro/action@v5

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Set `site` in `astro.config.mjs` to your GitHub Pages URL. Only add `base` if you're not using a `username.github.io` repo or a custom domain.

For Pagefind, set `build-cmd` in the action to `npm run build && npx pagefind --site dist`.

### Custom domain

Add a `public/CNAME` file with your domain. For subdomains, create a CNAME DNS record pointing to `username.github.io`. For apex domains, use A records pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`. GitHub auto-provisions a free SSL certificate.

### Things that'll trip you up

The repo must be **public on the free plan**. Private repos need GitHub Pro. Published site size limit is 1 GB, bandwidth is 100 GB/month.

**Astro gotcha**: the `base` path matters for project sites. Use `import.meta.env.BASE_URL` to prefix internal links dynamically.

**Quartz gotcha**: trailing-slash URLs break on GitHub Pages because Quartz generates `file.html` instead of `file/index.html`. If existing links use trailing slashes, consider Cloudflare Pages.

---

## Real sites and repos to study

The best way to learn is to read other people's source code. Here are the standouts.

### Quartz gardens

[Jacky Zhao's garden](https://jzhao.xyz/) is the canonical Quartz site. Custom handwriting font, clean graph view, popover previews. [Source](https://github.com/jackyzha0/jackyzha0.github.io).

[Aaron Pham's garden](https://aarnphm.xyz/) is the most impressive Quartz customization in the wild. Tufte-style sidenotes, telescope-style search, heavily modified layout. [Source](https://github.com/aarnphm/aarnphm.github.io).

The full [Quartz showcase](https://quartz.jzhao.xyz/showcase) lists 17+ community gardens for more inspiration.

### Astro portfolio + garden combos

[Maggie Appleton's site](https://maggieappleton.com/) is the gold standard. Astro + MDX with typed content collections, MDX-powered backlinks, tooltip hover previews, growth-stage indicators, and pure-CSS masonry grids. [Source](https://github.com/MaggieAppleton/maggieappleton.com-V3).

[Eva Decker's site](https://eva.town/) combines design engineering portfolio with garden notes. Astro + React + SCSS, exquisite custom design, WCAG 2.2 AA compliant. Featured on Codrops and Hacker News. [Source](https://github.com/evadecker/eva.town).

[stereobooster's Astro Digital Garden](https://astro-digital-garden.stereobooster.com/) is a reference implementation with working recipes for backlinks, link previews, graph visualization, and faceted search. [Source](https://github.com/stereobooster/astro-digital-garden).

### Starter templates worth forking

- **[Astro Digital Garden](https://github.com/stereobooster/astro-digital-garden)**: Starlight-based with all garden recipes
- **Astro Theme Spaceship**: Obsidian vault to Astro with wikilinks, backlinks, graph view. Install via `npm create astro@latest -- --template aitorllj93/astro-theme-spaceship`
- **[Mycelium Theme](https://github.com/0bserver07/mycelium-theme)**: Astro + Tailwind digital garden with 7 themes, graph view, wikilinks
- **[Quartz v4](https://github.com/jackyzha0/quartz)**: designed to be forked
- **[Quartz Themes](https://github.com/saberzero1/quartz-themes)**: ports Obsidian themes to Quartz

### Resource directories

- **[digital-gardeners](https://github.com/MaggieAppleton/digital-gardeners)**: the canonical list of tools, templates, and hundreds of garden examples
- **[Second-Brain](https://github.com/KasperZutterman/Second-Brain)** (1.7k stars): curated public Zettelkastens and digital gardens
- **[best-of-digital-gardens](https://github.com/lyz-code/best-of-digital-gardens)**: ranked, auto-scored list

---

## What to build this weekend

Most tools force you to pick: a portfolio that looks great, or a garden that thinks well. You don't have to choose anymore.

Astro gives you total freedom and asks for a weekend of wiring. Quartz gives you everything on day one and asks you to live within its walls. Both deploy free. Both use markdown. Both produce sites you fully own.

The best personal site isn't the one with the most features. It's the one you actually publish and keep adding to. Pick a path, start writing, and let the garden grow.

---

## Sources

- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro GitHub Pages Deployment](https://docs.astro.build/en/guides/deploy/github/)
- [Quartz v4 Documentation](https://quartz.jzhao.xyz/)
- [Quartz Architecture](https://quartz.jzhao.xyz/advanced/architecture)
- [remark-wiki-link](https://github.com/landakram/remark-wiki-link)
- [BrainDB for Astro](https://github.com/stereobooster/braindb)
- [Starlight Site Graph Plugin](https://fevol.github.io/starlight-site-graph/getting-started/)
- [Backlinks in Astro](https://codemacabre.com/notes/backlinks-in-astro/)
- [Adding Wiki Links to Astro](https://alexop.dev/posts/adding-obsidian-wiki-links-to-astro-blog/)
- [Pagefind](https://pagefind.app/)
- [force-graph](https://github.com/vasturiano/force-graph)
- [Shiki Syntax Highlighter](https://github.com/shikijs/shiki)
- [Astro RSS](https://docs.astro.build/en/recipes/rss/)
- [Dark Mode Toggle](https://whitep4nth3r.com/blog/best-light-dark-mode-theme-toggle-javascript/)
- [GitHub Pages Limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- [Maggie Appleton's Site Source](https://github.com/MaggieAppleton/maggieappleton.com-V3)
- [Eva Decker's Site Source](https://github.com/evadecker/eva.town)
