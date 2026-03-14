---
title: 'Building a Personal Knowledge Base and Publishing It to the Web'
description: 'How to build a personal knowledge base with backlinks, wikilinks, and graph view, then publish it as a living site. Covers Obsidian, Logseq, CLI tools, AI-powered structuring, and publishing with Astro or Quartz.'
publishDate: 2026-03-13
tags: ['engineering', 'frontend', 'tools']
---

You know things. You've learned patterns, solved problems, collected resources. But where does all of that live? Scattered across bookmarks, Notion pages, half-finished docs, and messages you can't find anymore.

A **personal knowledge base** solves this. It's a system where you write notes, connect them with links, and watch a web of knowledge grow over time. The real power comes when you publish it. Your curated knowledge becomes a resource anyone can browse, search, and learn from. It helps you think more clearly, and it helps others who are learning the same things.

This guide covers the full workflow: how to organize your thinking locally, how the linking features that make it work (backlinks, wikilinks, graph view), tools that accelerate the process, and exactly how to publish it as a living site on the web.

---

## Why organize knowledge this way

A traditional blog is a timeline. You publish, it gets old, you move on. A knowledge base is different. Notes are living documents. You revisit them, expand them, link them to new ideas. A note on "React performance" links to your note on "bundle size." That one links to "build tools." Connections form naturally, the same way you actually think.

Three features make this work on the web.

**Bidirectional links**: if page A links to page B, page B knows about it. In a normal site, links are one-way. Bidirectional links create two-way relationships automatically. When you mention a concept, every page about that concept discovers the reference.

**Backlinks**: every page shows a list of pages that reference it. This is the feature that turns a folder of markdown files into a connected knowledge base. You open a note and see not just where it links _to_, but everything that links _back_. Context you didn't manually create.

**Graph view**: an interactive visualization of how all your notes connect. Nodes are pages, edges are links. Clusters form around related topics. It's the map of your thinking, and it's genuinely useful for finding connections you didn't know existed.

Without these, you just have markdown files in a folder. With them, you have a knowledge system.

---

## The workflow: write locally, publish to the web

The best setup separates writing from publishing. You organize and connect your notes in a local tool that's fast and distraction-free, then publish the result as a static site anyone can browse.

### Obsidian as your writing environment

[Obsidian](https://obsidian.md/) is the best local tool for this. Your notes are plain markdown files in a folder on your machine. No cloud lock-in, no proprietary format. Obsidian gives you `[[wikilinks]]` for connecting notes, a graph view for visualizing connections, backlinks in the sidebar, tags, full-text search, and a plugin ecosystem that extends everything.

The key insight: Obsidian is where you _think_. The website is where you _share_. Keep them separate and you get the best writing experience locally without compromising on how the published site looks.

### Obsidian CLI: manage your vault from the terminal

[Obsidian CLI](https://help.obsidian.md/cli), shipped with Obsidian 1.12, brings your vault to the command line. Over 100 commands for creating notes, searching, appending content, managing plugins, and more. Run `obsidian` with no arguments and you get a full TUI (terminal UI) file browser with keyboard navigation.

The commands that matter most for a knowledge base workflow:

- `obsidian daily` opens today's daily note. `obsidian daily:append content="..."` adds to it without opening the GUI.
- `obsidian search query="react hooks"` finds notes by content. `obsidian search:context` gives richer results with surrounding text.
- `obsidian create title="New Note"` creates notes from scripts or automation.

This is especially powerful for AI-assisted workflows. Tools like Claude Code can read and write to your vault through the CLI, helping you process, organize, and connect notes programmatically. No fragile file manipulation required.

### Ars Contexta: AI-generated knowledge architecture

If you want to go deeper, [Ars Contexta](https://github.com/agenticnotetaking/arscontexta) is a Claude Code plugin that generates a full knowledge management system tailored to how you work. Instead of starting with an empty vault and figuring out your own structure, it interviews you about your domain and thinking style, then derives a complete cognitive architecture.

The result is a markdown-based vault organized into three spaces: `self/` (your identity and goals as a knowledge worker), `notes/` (the actual knowledge graph with wiki-linked notes), and `ops/` (operational coordination and processing pipelines). It uses a six-phase processing pipeline (Record, Reduce, Reflect, Reweave, Verify, Rethink) that extends Cornell note-taking with meta-cognitive layers.

The setup takes about 20 minutes: run `/arscontexta:setup`, walk through the interview, and you get a structured vault ready for both personal use and publishing. It's research-backed, with 249 interconnected methodology notes grounding decisions in cognitive science and network theory.

Worth studying even if you don't use it directly. The architecture patterns are a masterclass in how to structure a knowledge base.

### Open-source alternatives to Obsidian

Obsidian is excellent, but it's not open source. If that matters to you, or you want something that works differently, these are the strongest alternatives.

**[Logseq](https://github.com/logseq/logseq)** (~41k stars) is the closest open-source equivalent to Obsidian. It's an outliner-style knowledge base with bidirectional links, graph view, block-level references, and a plugin system. Notes are plain markdown or Org-mode files on your machine. The key difference from Obsidian: Logseq is block-based (every bullet point is a referenceable unit), while Obsidian is page-based. If you think in outlines, Logseq might click faster.

**[SilverBullet](https://github.com/silverbulletmd/silverbullet)** (~5k stars) runs as a local web server you start from the command line. Open your browser, and you get a rich markdown editor with wikilinks, backlinks, and Lua scripting for extending everything. It's self-hostable, so you can run it on a VPS and access your knowledge base from any device. Great middle ground between a local app and a web-based tool.

**[SiYuan](https://github.com/siyuan-note/siyuan)** (~42k stars) is a self-hosted, privacy-first knowledge management tool with block-level references, graph view, WYSIWYG editing, and end-to-end encryption. It also runs as a local web server, so you access it through your browser. Written in TypeScript and Go.

### CLI-first tools for terminal workflows

If you live in the terminal and want your knowledge base there too, these are purpose-built for that.

**[zk](https://github.com/zk-org/zk)** (~2.5k stars) is the best CLI-native option. A single Go binary that manages plain markdown notes with wikilinks, backlinks, full-text search, and note templating. It also ships an LSP server, so you get autocompletion and link following in Neovim or VS Code. If you want Zettelkasten-style note-taking without leaving the terminal, this is it.

**[nb](https://github.com/xwmx/nb)** (~8k stars) is a portable Bash script that gives you CLI note-taking, bookmarking, wiki-style linking, tagging, search, and Git versioning. It even includes a built-in local web interface for browsing your notes in a browser. Incredibly portable, works anywhere Bash runs.

**[obsidian-export](https://github.com/zoni/obsidian-export)** (~1.3k stars) is a Rust CLI tool that converts an Obsidian vault (wikilinks, embeds, and all) into standard markdown. Useful when you've built your knowledge base in Obsidian but want to pipe it into any static site generator for publishing.

---

## Publishing to the web: two paths

Once your knowledge base exists locally, you need a way to publish it. Two tools do this well.

### Astro: full control, assembly required

[Astro](https://github.com/withastro/astro) (~50k+ stars) is the strongest choice if you want to own every component and every pixel. Its islands architecture ships zero client-side JavaScript by default, hydrating only the interactive parts you opt into. Content Collections give you type-safe frontmatter schemas via Zod. CSS is fully yours.

The catch: **garden features are entirely DIY**. Astro has no native wikilink parsing, no backlink generation, and no graph view. You wire these up yourself using [`remark-wiki-link`](https://www.npmjs.com/package/remark-wiki-link) for `[[wikilinks]]`, a build-time backlinks map via `getCollection()`, and a D3.js or `force-graph` component for visualization. Community projects like [`braindb`](https://github.com/stereobooster/braindb) and [`starlight-site-graph`](https://fevol.github.io/starlight-site-graph/getting-started/) help, but nothing is turnkey.

**Best for**: engineers who want total design freedom and can invest a weekend wiring up the garden plumbing.

### Quartz v4: Obsidian-native, ready out of the box

[Quartz v4](https://github.com/jackyzha0/quartz) (~8-10k stars) is designed _specifically_ for publishing Obsidian vaults. Out of the box you get everything: `[[wikilinks]]` with aliases, automatic backlinks, an interactive D3.js graph view, full-text search, popover link previews, and [Obsidian-flavored markdown](https://quartz.jzhao.xyz/) support. Even transclusions, tag pages, callouts, and LaTeX work without configuration.

The architecture uses unified/remark/rehype for markdown, esbuild for bundling, [Preact for JSX templating](https://quartz.jzhao.xyz/advanced/architecture), and Shiki for syntax highlighting. Written entirely in TypeScript.

**The limitation is design flexibility.** Quartz uses a [single global layout](https://quartz.jzhao.xyz/layout) with slots (header, left sidebar, right sidebar, beforeBody, afterBody, footer). You can create custom `.tsx` components and override styles via `custom.scss`. But JSX is templates-only: no React hooks, no `useState`, no `onClick` handlers. Interactivity requires vanilla DOM manipulation in [`.inline.ts` scripts](https://quartz.jzhao.xyz/advanced/creating-components).

**Best for**: anyone who wants to publish a connected knowledge base immediately and customize from there.

### Which to pick

If you know TypeScript and want full design control, **go with Astro**. You'll spend a weekend wiring up backlinks, wikilinks, and a graph view. After that, you own everything.

If you want the knowledge base live today and design is secondary, **Quartz v4 gets you there in hours**. You can customize it more than people think, but you'll always work within its architecture.

A **hybrid approach** works too: Quartz for the `/garden` subdirectory, a separate Astro site for the portfolio. The tradeoff is maintaining two build systems.

---

## Building with Astro: implementation

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

The `growth` field tracks note maturity: seedling (rough idea), budding (developing), evergreen (polished). This is how digital gardens signal which notes are works-in-progress and which are reference material. Zod validates all of this at build time.

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

This is where the knowledge base comes alive. Backlinks are computed at build time by scanning all pages for outgoing links, then [inverting the index](https://codemacabre.com/notes/backlinks-in-astro/):

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

Render with [`force-graph`](https://github.com/vasturiano/force-graph) (Canvas-based, great performance) or `d3-force` in a React component, hydrated as an Astro island with `client:visible`. The `react-force-graph-2d` package gives you drag, zoom, and click-to-navigate out of the box.

### Search with Pagefind

[Pagefind](https://pagefind.app/) is the clear winner for static site search. Written in Rust, runs as WASM in the browser, generates a chunked index that's only 100-300KB even for large sites. Zero backend.

```bash
# Add to your build script
npx pagefind --site dist
```

Add `data-pagefind-body` to your `<main>` element to scope what gets indexed. Pagefind provides both a [drop-in UI component](https://pagefind.app/docs/) and a JavaScript API for custom search interfaces.

### More features worth adding

**Syntax highlighting**: Astro uses [Shiki](https://github.com/shikijs/shiki) by default, the same engine as VS Code. Configure dual themes for dark/light mode in `markdown.shikiConfig.themes`. Zero client-side JS.

**Reading time**: A custom remark plugin using [`reading-time`](https://www.npmjs.com/package/reading-time) and `mdast-util-to-string`. Astro's official docs include a recipe for this.

**Tags and tag pages**: Define tags in frontmatter as an array. Create `src/pages/tags/[tag].astro` using `getStaticPaths()` to generate a page for each tag. Pure static generation.

**RSS feed**: Use [`@astrojs/rss`](https://docs.astro.build/en/recipes/rss/) (official package). Create `src/pages/rss.xml.ts` with a `GET` function.

**Dark/light mode**: CSS custom properties on a `data-theme` attribute, toggled via a small inline script in `<head>` that checks `localStorage` first, then `prefers-color-scheme`. The inline placement [prevents flash of wrong theme](https://whitep4nth3r.com/blog/best-light-dark-mode-theme-toggle-javascript/).

**Table of contents**: Astro's `entry.render()` returns a `headings` array with `{ depth, slug, text }`. Build a component that maps over it. Add `rehype-autolink-headings` for clickable heading anchors.

---

## Building with Quartz v4

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

## Open-source repos and templates to study

The best way to learn is to read other people's source code.

### Quartz gardens

[Jacky Zhao's garden](https://jzhao.xyz/) is the canonical Quartz site. Custom handwriting font, clean graph view, popover previews. [Source](https://github.com/jackyzha0/jackyzha0.github.io).

[Aaron Pham's garden](https://aarnphm.xyz/) is the most impressive Quartz customization in the wild. Tufte-style sidenotes, telescope-style search, heavily modified layout. [Source](https://github.com/aarnphm/aarnphm.github.io).

The full [Quartz showcase](https://quartz.jzhao.xyz/showcase) lists 17+ community gardens for more inspiration.

### Astro knowledge bases

[Maggie Appleton's site](https://maggieappleton.com/) is the gold standard. Astro + MDX with typed content collections, MDX-powered backlinks, tooltip hover previews, growth-stage indicators, and pure-CSS masonry grids. [Source](https://github.com/MaggieAppleton/maggieappleton.com-V3).

[Eva Decker's site](https://eva.town/) combines design engineering portfolio with garden notes. Astro + React + SCSS, exquisite custom design, WCAG 2.2 AA compliant. Featured on Codrops and Hacker News. [Source](https://github.com/evadecker/eva.town).

[stereobooster's Astro Digital Garden](https://astro-digital-garden.stereobooster.com/) is a reference implementation with working recipes for backlinks, link previews, graph visualization, and faceted search. [Source](https://github.com/stereobooster/astro-digital-garden).

### Templates worth forking

- **[Astro Digital Garden](https://github.com/stereobooster/astro-digital-garden)**: Starlight-based with all garden recipes
- **Astro Theme Spaceship**: Obsidian vault to Astro with wikilinks, backlinks, graph view. Install via `npm create astro@latest -- --template aitorllj93/astro-theme-spaceship`
- **[Mycelium Theme](https://github.com/0bserver07/mycelium-theme)**: Astro + Tailwind digital garden with 7 themes, graph view, wikilinks
- **[qmd](https://github.com/tobi/qmd)**: a minimal tool by Tobi Lütke that converts markdown files into a clean, browsable site. Worth studying for its simplicity-first philosophy.
- **[Quartz v4](https://github.com/jackyzha0/quartz)**: designed to be forked
- **[Quartz Themes](https://github.com/saberzero1/quartz-themes)**: ports Obsidian themes to Quartz

### Resource directories

- **[digital-gardeners](https://github.com/MaggieAppleton/digital-gardeners)**: the canonical list of tools, templates, and hundreds of garden examples
- **[Second-Brain](https://github.com/KasperZutterman/Second-Brain)** (1.7k stars): curated public Zettelkastens and digital gardens
- **[best-of-digital-gardens](https://github.com/lyz-code/best-of-digital-gardens)**: ranked, auto-scored list

---

## Start this weekend

The tools are ready. Obsidian gives you a fast, local environment for organizing your thinking. The CLI lets you script and automate it. Ars Contexta can bootstrap the whole structure for you. And Astro or Quartz turn it all into a site anyone can browse.

The best knowledge base isn't the one with the most features. It's the one you actually fill with what you know and keep building on. The act of writing things down, connecting them, and making them public sharpens your thinking in ways that staying private never does.

Pick a path, start writing, and share what you know.

---

## Sources

- [Obsidian](https://obsidian.md/)
- [Obsidian CLI](https://help.obsidian.md/cli)
- [Ars Contexta](https://github.com/agenticnotetaking/arscontexta)
- [Logseq](https://github.com/logseq/logseq)
- [SilverBullet](https://github.com/silverbulletmd/silverbullet)
- [SiYuan](https://github.com/siyuan-note/siyuan)
- [zk](https://github.com/zk-org/zk)
- [nb](https://github.com/xwmx/nb)
- [obsidian-export](https://github.com/zoni/obsidian-export)
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
