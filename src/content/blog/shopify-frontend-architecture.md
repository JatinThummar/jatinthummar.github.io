---
title: 'Building a Shopify-Scale Frontend: The Complete Architecture Guide'
description: 'How Shopify serves 3.9 million stores through one rendering engine, and how to replicate it with React and SDUI.'
publishDate: 2026-02-26
tags: ['engineering', 'frontend', 'react']
---

Shopify serves 3.9 million stores through a single rendering engine. Each store has a completely different UI. They pull this off by treating templates as data, sandboxing merchant code at the language level, and composing pages from JSON-defined sections. It's one of the most successful implementations of server-driven UI at scale ever built.

For a React developer looking to build something similar, a multi-tenant, theme-driven platform across web, mobile, and embedded surfaces, understanding both _why_ Shopify made its architectural choices and _how_ to replicate them with modern tools is essential. This guide covers everything from Liquid's internals to a practical Next.js + SDUI blueprint.

---

## How Shopify's frontend actually works

### Liquid exists because React would break everything

Liquid is an open-source template language created by Tobias Lütke (Shopify's co-founder) in 2006, [purpose-built](https://www.referralcandy.com/blog/shopify-hydrogen-vs-liquid-theme-which-framework-is-right-for-your-store) for one constraint that eliminates every mainstream alternative: **merchants write templates that execute on Shopify's servers**. When millions of tenants author code that runs on your infrastructure, you need a language that is _safe by construction_, not safe by configuration.

ERB allows arbitrary Ruby execution. EJS embeds raw JavaScript. Jinja2's sandbox has had escape vulnerabilities. Handlebars allows arbitrary JS via custom helpers. JSX is full JavaScript, impossible to sandbox safely when users write the templates. [Liquid](https://github.com/Shopify/liquid) solves this by simply _not having_ the capabilities that would be dangerous: no `eval`, no file system access, no HTTP requests, no database queries, no method invocation, no prototype chain access, no imports. The language can only output variables provided to it, run conditionals and loops, and apply pre-registered filters. Think of it as a pure function: `(template, data) → HTML`.

For a React developer, the syntax maps cleanly to familiar concepts. Where you'd write `{product.title}` in JSX, Liquid uses `{{ product.title }}`. Where you'd use `.map()`, Liquid uses `{% for item in items %}`. Where you'd call `price.toFixed(2)`, Liquid pipes through filters: `{{ price | money }}`. Where you'd import a component with `<ProductCard />`, Liquid uses `{% render 'product-card' %}`. The critical mental model shift: **Liquid is server-side only, stateless, and non-reactive**. No DOM, no event handlers, no state updates. It runs once, produces HTML, and is [done](https://www.shopify.com/partners/blog/115244038-an-overview-of-liquid-shopifys-templating-language).

Internally, Liquid follows a two-phase architecture: parse once, render many times. The expensive parsing step tokenizes the template string and builds an AST of Block objects. The cheap rendering step walks this AST with a Context object containing variable bindings. Shopify's [Liquid-C](https://shopify.engineering/refactor-path-to-faster-rendering-liquid-c) extension (introduced in 2014) compiles templates into bytecode for a custom VM with instructions like `PUSH_CONST`, `WRITE_RAW`, and `RENDER_VARIABLE_RESCUE`, dramatically accelerating rendering for high-traffic stores.

### The theme system is a component architecture disguised as files

Shopify's theme file structure maps surprisingly well to React concepts:

| Theme directory | Purpose | React analogy |
| --- | --- | --- |
| `layout/theme.liquid` | Base HTML shell with `{{ content_for_layout }}` | Root `App.jsx` layout |
| `templates/*.json` | Per-page-type declarations of which sections to render | Route-level page components |
| `sections/*.liquid` | Reusable modules with their own schema, settings, and blocks | Reusable components with typed props |
| `blocks/*.liquid` | Nestable content units (up to 8 levels deep) | Child components |
| `snippets/*.liquid` | Shared code fragments (invisible to theme editor) | Utility functions / helper components |
| `config/settings_schema.json` | Defines available theme-wide settings | TypeScript interface for design tokens |
| `config/settings_data.json` | Stores merchant's chosen values | Theme state / token values |

[Online Store 2.0](https://meetdomaine.com/insights/technology/shopify-front-end-architecture-options/) (launched 2021) was Shopify's architectural breakthrough. Before OS 2.0, templates were `.liquid` files containing HTML markup, and sections only worked on the homepage. After OS 2.0, templates became [JSON files](https://shopify.dev/docs/storefronts/themes/architecture/templates/json-templates): pure data declarations of which sections appear, their order, and their settings. This is essentially SDUI: the page is defined as data, not code.

A JSON template like `templates/product.json` declares sections (`"type": "main-product"`), each section's settings (`"show_vendor": true`), nested blocks with their own settings, and the rendering order. Each template can contain up to 25 sections, each with up to 50 blocks. The merchant can add, remove, and reorder sections on any page via the [theme editor](https://shopify.dev/docs/storefronts/themes/architecture/templates), all without touching code.

Each section file contains a `{% schema %}` JSON block that defines its name, available settings (with types like `text`, `color`, `font_picker`, `image_picker`, `select`, `range`), allowed block types, and presets for the "Add section" picker. This schema serves double duty: it validates the data AND generates the settings UI in the theme editor. This is the same pattern you'll replicate in your component registry.

### The theme editor uses iframes and surgical DOM updates

Shopify's Theme Editor (customizer) runs as a sidebar application with the store rendered in an iframe. When a merchant changes a setting, the editor doesn't reload the page. Instead, it calls the [Section Rendering API](https://shopify.dev/docs/api/ajax/section-rendering) (`/?sections=section-id-1,section-id-2`) which re-renders just the affected sections server-side and returns their HTML as JSON. The editor then injects the new HTML directly into the iframe's DOM, replacing only the changed sections.

The preview iframe receives JavaScript events for every editorial action: `shopify:section:load`, `shopify:section:unload`, `shopify:section:select`, `shopify:section:reorder`, `shopify:block:select`, and more. Theme JavaScript can [listen for these](https://shopify.dev/docs/storefronts/themes/best-practices/editor/integrate-sections-and-blocks) to reinitialize interactive components after DOM changes. Templates detect editor mode via `request.design_mode`, and sections get automatic `data-section-id` attributes for targeting.

CSS/JS isolation between themes is architectural, not technical. Each store serves only one theme at a time as a complete HTML document. There's no Shadow DOM or iframe isolation within the page itself. Between stores, isolation is inherent because each store is a separate HTTP response. Themes must manage their own CSS specificity. Shopify's reference theme [Dawn](https://www.shopify.com/partners/blog/shopify-online-store) takes a minimalist approach, relying on native browser features and minimal JavaScript.

### Hydrogen is the escape hatch for developers who need React

[Shopify Hydrogen](https://codup.co/blog/shopify-headless-hydrogen-vs-liquid-framework-why-should-you-make-a-switch/) is a React-based headless commerce framework built on Remix (now React Router 7). It represents the opposite end of Shopify's frontend spectrum from Liquid: full JavaScript freedom, full customization power, full developer responsibility.

Hydrogen evolved through several phases. V1 (2022) bet on experimental React Server Components with an in-house framework, and [this proved premature](https://shopify.engineering/how-we-built-hydrogen). After Shopify [acquired the Remix team](https://shopify.engineering/remix-joins-shopify) in October 2022, Hydrogen v2 was a complete rewrite on Remix, so substantial that many brands rebuilt from scratch rather than migrating. Current Hydrogen (2025-2026) runs on [React Router 7](https://shopify.dev/docs/storefronts/headless/hydrogen/fundamentals) with Vite 6, supporting the latest Storefront API versions.

The architecture has three layers: the app layer (`@shopify/hydrogen`, commerce components, API clients, utilities), the framework layer (React Router, routing, data fetching, SSR), and the hosting layer ([Oxygen](https://resources.storetasker.com/blog/shopify-oxygen-hosting-a-developers-guide), Shopify's serverless edge platform running on Cloudflare Workers across 100+ global data centers). Hydrogen uses React Router's file-based routing with `loader` functions for server-side data fetching, streaming SSR via React 18 Suspense, and a sophisticated caching system with presets like `CacheShort()`, `CacheLong()`, and `CacheNone()`.

The [Storefront API](https://www.shopify.com/enterprise/blog/headless-commerce) powering Hydrogen is a GraphQL API serving 1M+ queries per minute, deployed entirely at the edge. It exposes products, collections, cart operations, customer accounts, search, localization, and custom data. Authentication uses [public access tokens](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api) (safe to expose client-side) or private tokens (server-only, higher privilege).

**The adoption numbers tell an important story**: approximately [1,714 live sites](https://www.polipo.io/blog/shopify-liquid-vs-hydrogen-which-one-to-choose) use Hydrogen versus 3.9 million+ on Liquid themes. Shopify's own 2023 study found Liquid storefronts [outperform most headless implementations](https://weaverse.io/blogs/speed-performance-liquid-vs-hydrogen) on Core Web Vitals. Hydrogen isn't automatically faster. It's for teams that need React-level customization and are willing to invest the engineering effort.

---

## Why multi-tenant theming is an unsolved hard problem

### The sandboxing paradox

The fundamental challenge of a multi-tenant frontend platform is a paradox: you want tenants to customize their UI extensively, but you can't let them run arbitrary code on shared infrastructure. Liquid resolves this by being safe by construction. The language simply cannot express harmful operations. This is fundamentally different from sandboxing by runtime enforcement (which has escape vulnerabilities), sandboxing by isolation (which adds overhead), or sandboxing by code review (which doesn't scale).

What Liquid's model prevents: no arbitrary code execution, no environment variable access, no side effects (rendering is a pure function), no cross-tenant data access, no unbounded resource consumption (loops have configurable limits), and automatic HTML escaping to prevent XSS. Even if a malicious actor gains access to edit a store's theme, the worst they can do is change the visual appearance. They cannot steal data, access other stores, or compromise the platform.

For React components, letting tenants write JSX is fundamentally incompatible with this safety model. React components are JavaScript. They can make fetch requests, access localStorage, read cookies, manipulate the DOM, execute `eval()`, and even mine cryptocurrency. Server-side rendering of tenant-written React means running their JavaScript on your servers, where `while(true){}` would consume resources, `process.env` could leak secrets, and `require('child_process')` could compromise the server.

### The customization spectrum your platform needs

Shopify doesn't use a single approach. It operates across a full spectrum simultaneously:

- **Config-driven** (least flexible, safest): theme settings like color pickers, font selectors, and toggle options via `settings_schema.json`. Non-technical merchants customize via the theme editor sidebar.
- **Template-driven** (Liquid's sweet spot): [sections and blocks](https://wolfdev.co.uk/blogs/news/mastering-sections-everywhere-building-flexible-pages-in-shopify-2-0) with conditional logic, loops, and filters. Intermediate users edit Liquid templates for structural customization.
- **Code-driven** (most flexible, least safe): Shopify Apps, Storefront API, and Hydrogen for developers who need full control. This tier accepts the risks of arbitrary code because developers are accountable.

Your platform needs this same spectrum. The architecture blueprint later in this post shows how to implement each tier with React and SDUI patterns.

---

## SDUI patterns that power platforms at scale

### How Airbnb, DoorDash, and Shopify think about server-driven UI

SDUI means the server defines both the data AND how it's displayed. The client becomes a [rendering engine](https://medium.com/@aubreyhaskett/server-driven-ui-what-airbnb-netflix-and-lyft-learned-building-dynamic-mobile-experiences-20e346265305), capable of displaying whatever the server describes. The pattern has been adopted at massive scale by companies facing the same multi-surface, multi-tenant, rapid-iteration challenges.

**[Airbnb's Ghost Platform](https://medium.com/airbnb-engineering/a-deep-dive-into-airbnbs-server-driven-ui-system-842244c5f5)** is the most documented implementation. It uses three core primitives: Sections (independent groups of related UI), Screens (define where sections appear), and [Actions](https://www.infoq.com/news/2021/07/airbnb-server-driven-ui/) (handle interactions). A single shared GraphQL schema serves web, iOS, and Android simultaneously. The key insight: "Launching A/B experiments on all platforms is as simple as changing one source of truth in our backend."

**[DoorDash](https://careersatdoordash.com/blog/improving-development-velocity-with-generic-server-driven-ui-components/)** uses "Facets": generic, server-driven UI components with a recursive data model. Each facet maps 1:1 with a view on screen, and facets can contain nested child facets. This enabled their homepage to support multiple verticals (restaurants, grocery, convenience) without app updates. Banner delivery time dropped to under a day; modifications go live in under an hour.

**[Shopify's own Shop app](https://shopify.engineering/server-driven-ui-in-shop-app)** implements SDUI for its Store Screen, with a sections-based model where the GraphQL API returns typed sections (`ProductsSection`, `CollectionsSection`) with configurable layout types. This eliminated the dependency on weekly app release cadences for experiments.

### The component registry is the contract between server and client

The foundational SDUI pattern [maps string identifiers to React components](https://medium.com/front-end-weekly/building-a-component-registry-in-react-4504ca271e56). Every component declares its prop schema for validation and editor UI generation:

```typescript
class ComponentRegistry {
  private components = new Map<string, {
    component: React.ComponentType<any>;
    schema: JSONSchema;
    version: string;
    defaultProps?: Record<string, any>;
  }>();

  register(type: string, config: ComponentConfig) {
    this.components.set(type, config);
  }

  resolve(type: string): React.ComponentType<any> | null {
    return this.components.get(type)?.component ?? null;
  }
}
```

The renderer recursively walks a JSON tree, resolving each node's `type` against the registry and passing `props` and `children`:

```typescript
function SDUIRenderer({ node }: { node: SDUINode }) {
  const Component = registry.resolve(node.type);
  if (!Component) return <FallbackComponent type={node.type} />;

  return (
    <Component {...node.props}>
      {node.children?.map((child, i) => (
        <SDUIRenderer key={child.id || i} node={child} />
      ))}
    </Component>
  );
}
```

For versioning, the consensus from the [MobileNativeFoundation SDUI discussion](https://github.com/MobileNativeFoundation/discussions/discussions/47) is clear: the server should handle versioning, not the client. The server knows each client's supported component versions and sends only components the client can render, with graceful degradation for unknown types.

### Three-layer design tokens for per-tenant theming

The recommended approach for multi-tenant theming uses CSS Custom Properties as the runtime delivery mechanism. Not CSS-in-JS (which adds runtime overhead and SSR complexity) and not build-time Tailwind alone (which can't scale to millions of tenants).

The [three-layer token architecture](https://feature-sliced.design/blog/design-tokens-architecture):

- **Primitive tokens** define raw values: `--color-blue-500: oklch(60% 0.16 250)`
- **Semantic tokens** map intent to primitives: `--color-action-primary: var(--color-blue-600)`
- **Component tokens** provide component-specific overrides: `--button-bg: var(--color-action-primary)`

Per-tenant customization happens by [overriding semantic tokens](https://sollybombe.medium.com/designing-metadata-driven-ui-customization-for-multi-tenant-saas-b13140221e5c): inject the tenant's theme as CSS custom properties on `:root` at request time. One CSS build serves all tenants; only the variables change.

With Tailwind v4's `@theme` directive, you can [bind CSS variables to utility classes](https://dev.to/praveen-sripati/how-i-built-a-multi-theme-system-using-new-tailwind-css-v4-react-27j3), giving you the developer ergonomics of Tailwind with runtime per-tenant theming. Store each tenant's theme configuration as JSON in the database, generate a small set of CSS variable overrides at the edge, and cache them with the tenant ID as the cache key.

### Cross-platform rendering from a single schema

The key insight from Airbnb's Ghost Platform: use a single shared schema across all platforms. Each platform maintains its own component registry mapping schema types to native components. The SDUI server returns the same JSON; the web registry maps `"product-card"` to a React DOM component, the mobile registry maps it to a React Native component, and the embedded registry maps it to a lightweight Web Component or iframe widget.

Layout components adapt per surface: `GridLayout` renders as CSS Grid on web, `FlatList` on mobile. [Design tokens bridge platforms](https://bit.dev/blog/creating-a-cross-platform-design-system-for-react-and-react-native-with-bit-l7i3qgmw/): shared base tokens with platform-specific extensions (CSS variables for web, React Native StyleSheet values for mobile). [DivKit](https://divkit.tech/) by Yandex is an open-source example of this pattern, rendering JSON schemas natively on iOS, Android, Web, and Flutter without WebViews.

---

## The open-source landscape: what exists and what's missing

### Commerce platforms are headless but not themed

**[Medusa.js](https://docs.medusajs.com/v1/development/fundamentals/architecture-overview)** (~27k GitHub stars, MIT) is the most active open-source Shopify alternative. Fully headless with a modular TypeScript/Node.js backend and a Next.js storefront starter. Medusa ships with [multi-store support](https://medusajs.com/blog/multi-tenant-rigby/) (shared catalogs, different domains/currencies/branding) but no theme system. Developers build storefronts from scratch. Multi-tenancy requires custom implementation via [PostgreSQL Row Level Security](https://www.rigbyjs.com/blog/multi-tenancy-in-medusa) or separate instances.

**[Saleor](https://www.netguru.com/blog/what-is-saleor)** (~21k stars, BSD-3) offers the most sophisticated GraphQL-only API with a Python/Django backend and a React/Next.js storefront. Its multi-channel architecture provides per-channel pricing, currencies, and stock, covering many multi-tenant use cases. The dashboard extends via 45+ iframe-based mount points. No theming system.

**[Vendure](https://vendure.io)** (~6k stars, GPL-3) has the best plugin architecture of any open-source commerce platform, built on NestJS dependency injection. Plugins can add GraphQL resolvers, extend data models, add admin UI components, and register event listeners, all as self-contained, versioned packages. All-TypeScript stack aligns well with modern frontend teams.

### Visual builders solve the editor problem but not the platform problem

**[Builder.io](https://www.builder.io/c/docs/custom-components-setup)** (~8k stars SDK, MIT+SaaS) has the best SDUI implementation for web. Content is stored as JSON, SDKs fetch it via API, and registered custom components render dynamically. The visual editor loads your site in an iframe and uses [postMessage for real-time editing](https://www.builder.io/c/docs/how-builder-works-technical). Multi-tenant via "Spaces" with separate API keys per tenant. The catch: the editor itself is proprietary SaaS.

**[Plasmic](https://docs.plasmic.app/learn/sdui/)** (~5k stars, MIT, acquired by Supabase in 2024) offers deeper React integration with two consumption modes: headless API (fetch and render at runtime) and [codegen](https://docs.plasmic.app/learn/loader-vs-codegen/) (CLI generates React files). Component registration supports slots, variants, and overrides. The visual editor produces component trees consumable as data, true SDUI via API.

**[Puck](https://puckeditor.com/blog/building-a-react-page-builder-an-introduction-to-puck)** (~7k stars, MIT) is the best fully open-source option for React page building. It's a single embeddable React component, `<Puck config={config} data={data} onPublish={save} />`, that outputs clean JSON. Config-driven component registration with drag-and-drop, multi-column layouts, and a permissions API. No SaaS dependency.

**[GrapesJS](https://github.com/GrapesJS/grapesjs)** (~25k stars, BSD-3) is the most mature open-source visual builder, but outputs HTML/CSS rather than component trees, [requiring additional integration work](https://esketchers.com/use-grapesjs-for-building-web-builder-framework/) for React-based SDUI platforms. Its canvas renders in an iframe with a rich plugin ecosystem.

### Payload CMS is the closest to Shopify's multi-tenant admin

**[Payload CMS](https://www.npmjs.com/package/@payloadcms/plugin-multi-tenant)** (~33k stars, MIT) stands out as the only open-source CMS with official multi-tenant support via `@payloadcms/plugin-multi-tenant`. It's Next.js-native (uses React Server Components), has a React admin panel with [live preview via iframe + postMessage](https://payloadcms.com/docs/live-preview/server), and supports domain mapping for per-tenant access. Global admins see all data; tenant users are restricted to their own. Combined with a commerce backend and a visual builder, Payload provides the closest open-source analog to Shopify's admin experience.

### The critical gap

**No open-source project combines commerce + multi-tenancy + visual theming.** Building a Shopify-like platform requires composing multiple tools. The optimal composition: **Medusa.js or Vendure** (commerce engine) + **Payload CMS** (multi-tenant admin/content with live preview) + **Puck or Builder.io SDK** (visual page builder) + a custom theme engine connecting these components with CSS Custom Properties and a component registry.

---

## A practical architecture blueprint

### Step 1: Component registry and schema system

Define components as JSON schemas (inspired by Shopify's `{% schema %}` blocks) that declare the component's name, settings with types and validation rules, allowed child blocks, and default presets. Build a `ComponentRegistry` class mapping type strings to React components + schemas. Use TypeScript generics for type safety and `React.lazy()` for code-splitting large registries. Validate page schemas at runtime with Zod: define section schemas, block schemas, and page schemas that compose them.

### Step 2: Theme engine with per-tenant customization

Store each tenant's theme configuration as JSON in your database. At request time (in Next.js middleware or a server component), load the tenant's theme tokens and inject them as CSS custom properties. Use Tailwind v4's [`@theme` directive](https://www.maviklabs.com/blog/design-tokens-tailwind-v4-2026) to bind these variables to utility classes. Support theme inheritance: a base theme provides defaults, tenant overrides customize branding, and page-level overrides handle specific sections. Cache the generated theme stylesheet at the edge with `tenant:{id}:theme:{version}` as the cache key.

### Step 3: Visual page builder using iframe + postMessage

Build the editor as a React application with a component sidebar, settings panel, and preview iframe. The iframe loads your actual storefront renderer. Communication flows bidirectionally via postMessage: the editor sends `PAGE_UPDATE` messages with the full page JSON, and the iframe sends `COMPONENT_SELECT` messages when elements are clicked. Use [Puck](https://dev.to/fede_bonel_tozzi/top-5-page-builders-for-react-190g) as a starting point or build custom with [dnd-kit](https://github.com/clauderic/dnd-kit) for drag-and-drop. Generate the settings panel dynamically from each component's schema, just as Shopify generates its settings sidebar from `{% schema %}` JSON.

### Step 4: API integration layer

Design a GraphQL API gateway that resolves tenant context from headers or domain. Expose product, collection, cart, and content operations scoped per tenant. Follow Shopify's split: a public-facing Storefront API (safe for client-side, read-heavy) and a private Admin API (mutations, management). Use React Router or Next.js loaders for server-side data fetching with [caching strategies](https://shopify.dev/docs/storefronts/headless/hydrogen/caching): `CacheShort` for frequently changing data (cart), `CacheLong` for stable data (product descriptions), `CacheNone` for personalized data.

### Step 5: Multi-surface rendering

Maintain separate component registries per platform: web (React DOM), mobile (React Native), embedded (Web Components or lightweight iframe widgets). All registries map the same type strings to platform-native components. The SDUI server returns identical JSON schemas; each client interprets them through its own registry. [Design tokens translate across platforms](https://www.uxpin.com/studio/blog/managing-global-styles-in-react-with-design-tokens/): CSS variables for web, React Native StyleSheet values for mobile, inline styles for embedded.

### Step 6: Preview and draft mode

Generate a unique preview token per editing session. When the theme editor iframe loads with this token, Next.js middleware detects it, skips CDN cache, and fetches from the draft data store instead of published content. For real-time updates, the editor sends page configuration changes via postMessage; the preview iframe re-renders immediately without a server round-trip (client-side rendering mode). For server-rendered previews, reload the iframe with [updated query parameters](https://www.contentstack.com/docs/developers/set-up-live-preview/how-live-preview-works).

### Step 7: CDN, caching, and SEO at multi-tenant scale

**Tenant resolution** happens in Next.js middleware: extract the hostname, [map it to a tenant](https://vercel.com/platforms/docs/examples/multi-tenant-template), rewrite the URL to include the tenant identifier. **Cache keys** include the tenant: `{hostname}:{path}:{locale}:{content_hash}`. Use ISR (Incremental Static Regeneration) for product and marketing pages with per-tenant revalidation. When a merchant updates content, call `revalidateTag('tenant:123:products')` to invalidate only their cached pages. Static marketing pages get [long TTLs](https://dev.to/melvinprince/cdn-caching-strategies-for-nextjs-speed-up-your-website-globally-4194) (`s-maxage=86400`); product pages use short ISR windows (`s-maxage=3600, stale-while-revalidate=86400`); cart and checkout are [never cached](https://truestorefront.com/blog/caching-strategies-for-shopify-hydrogen-stores).

For SEO, generate per-tenant dynamic sitemaps, inject tenant-specific meta tags and structured data (JSON-LD) from the SDUI page schema, and ensure all public pages are server-rendered. Use Next.js Metadata API for per-route meta. Support custom domains via [Vercel's Domains API](https://vercel.com/new/vercel-support/templates/next.js/platforms-starter-kit) or Cloudflare with programmatic SSL certificate generation. The [Vercel Platforms Starter Kit](https://vercel.com/blog/platforms-starter-kit) provides a production-ready template for this entire pattern.

---

## Where to learn and what to study

### Essential reading

Start with Shopify's **Dawn theme** source code. It's the gold standard for section/block/settings architecture in practice. Study `settings_schema.json` for theme configuration patterns and section files for schema definitions. Read Airbnb's [A Deep Dive into Server-Driven UI](https://medium.com/airbnb-engineering/a-deep-dive-into-airbnbs-server-driven-ui-system-842244c5f5). It's the most detailed public SDUI architecture document, covering GP's sections, screens, actions, and cross-platform strategy. The [MobileNativeFoundation GitHub discussion #47](https://github.com/MobileNativeFoundation/discussions/discussions/47) contains a rich multi-company SDUI strategy discussion with insights from engineers at Airbnb, Lyft, and Zalando.

### Concepts to understand before building

Before diving into code, these are the patterns and technologies you'll encounter repeatedly. Knowing what to look for makes it much easier to read through the source code of the tools listed below.

- **Component registries**: The pattern of mapping string identifiers to React components at runtime. This is the backbone of every SDUI system. Study how Puck's `config` object and Builder.io's `registerComponent()` work internally. Understand how they handle unknown types, versioning, and lazy loading.
- **JSON Schema and Zod for runtime validation**: Shopify validates section settings via `{% schema %}` blocks. In React, you'll use Zod or JSON Schema to validate component props at runtime. Study [react-jsonschema-form](https://github.com/rjsf-team/react-jsonschema-form) to see how schemas can also _generate_ settings UIs automatically.
- **iframe + postMessage communication**: This is how Shopify's theme editor, Builder.io, and Payload CMS's live preview all work. The editor and preview run in separate contexts, communicating via `window.postMessage`. Study Payload's [live preview source](https://github.com/payloadcms/payload/tree/main/packages/live-preview) to see the handshake, message typing, and DOM patching in practice.
- **CSS Custom Properties for runtime theming**: Unlike build-time Tailwind classes, CSS variables can change at runtime per tenant without rebuilding. Understand how `:root` variable injection works, how Tailwind v4's `@theme` directive binds variables to utilities, and how to scope variables per-component vs per-page.
- **Next.js middleware for multi-tenant routing**: How to resolve a tenant from hostname/subdomain, rewrite URLs, and inject tenant context into the request. The [Vercel Platforms Starter Kit](https://github.com/vercel/platforms) has a clean `middleware.ts` implementation to study.
- **ISR and cache invalidation**: Incremental Static Regeneration lets you serve static pages while supporting on-demand revalidation per tenant. Study how `revalidateTag()` and `revalidatePath()` work in Next.js to understand cache key design for multi-tenant systems.
- **GraphQL schema design for SDUI**: Airbnb and Shopify both use GraphQL to return typed UI sections from the server. Study how Airbnb's Ghost Platform uses union types and fragments to model heterogeneous section lists in a single query response.
- **Recursive rendering**: SDUI components can contain children, which can contain children, and so on. Study how DivKit and Puck handle recursive JSON tree rendering, fallback components for unknown types, and max depth limits.

### Repositories worth cloning

- **[vercel/platforms](https://github.com/vercel/platforms)** (5k+ stars): Production-ready Next.js 15 multi-tenant template. **What to study**: `middleware.ts` for tenant resolution from subdomains, the `lib/` folder for multi-tenant database queries, and the domain management API integration. Start here for multi-tenant infrastructure.
- **[puckeditor/puck](https://puckeditor.com/blog/building-a-react-page-builder-an-introduction-to-puck)** (7k+ stars): Best open-source React page builder. **What to study**: the `Config` type definition to understand how component registries work, the drag-and-drop implementation using dnd-kit, and how the JSON output schema maps to rendered components. The `resolveData` function shows how async data fetching integrates with the editor.
- **[Shopify/hydrogen](https://github.com/Shopify/hydrogen)** (15k+ stars): **What to study**: the `packages/hydrogen/src/cache/` directory for caching strategies (`CacheShort`, `CacheLong`), `createStorefrontClient` for how they handle Storefront API auth and GraphQL queries, and route loaders for server-side data fetching patterns.
- **[csmets/Server-Driven-UI](https://github.com/csmets/Server-Driven-UI)**: End-to-end SDUI framework. **What to study**: the GraphQL compositor that assembles page layouts from section definitions, the template server that resolves component trees, and the React web client's recursive renderer. Good for understanding the full request lifecycle from server to screen.
- **[rjsf-team/react-jsonschema-form](https://github.com/rjsf-team/react-jsonschema-form)** (14k+ stars): **What to study**: how JSON Schema definitions are traversed to generate form fields, the widget registry pattern (maps schema types to React input components), and how `uiSchema` separates presentation from validation. This is exactly the pattern Shopify uses to generate its settings sidebar from `{% schema %}` JSON.
- **[payloadcms/payload](https://github.com/payloadcms/payload)** (33k+ stars): **What to study**: the `packages/plugin-multi-tenant/` for Row Level Security patterns, `packages/live-preview/` for iframe + postMessage architecture, and the `admin/` React panel for how they build a dynamic admin UI from collection configs. The closest open-source equivalent to Shopify's admin.

### Shopify engineering blog posts

Shopify's engineering blog at `shopify.engineering` has deep technical posts worth reading:

- **[How We Built Hydrogen](https://shopify.engineering/how-we-built-hydrogen)**: Covers RSC adoption and the eventual reversal. Important for understanding why they chose Remix over custom RSC.
- **[How We Built Oxygen](https://shopify.engineering/how-we-built-oxygen)**: Details their edge hosting architecture on Cloudflare Workers. Study this for understanding edge deployment and V8 isolate-based serverless.
- **[Liquid-C refactoring](https://shopify.engineering/refactor-path-to-faster-rendering-liquid-c)**: Explains bytecode compilation for template performance. Even if you won't use Liquid, the parse-once-render-many pattern applies to any template system.
- **[Theme Blocks](https://www.shopify.com/partners/blog/themeblocks)**: The newest block architecture with 8-level nesting. Study this to understand how recursive component composition works at the schema level.
- **[Five Years of React Native at Shopify](https://shopify.engineering/authors/shopify-engineering)**: Mobile architecture decisions relevant to multi-surface rendering.

### Suggested learning path

Clone the [Vercel Platforms Starter Kit](https://vercel.com/blog/platforms-starter-kit) and get multi-tenant routing working with custom subdomains. Read through the middleware and understand how tenant resolution works. Then integrate [Puck for visual page editing](https://puckeditor.com/blog/how-to-build-a-react-page-builder-puck-and-tailwind-4) and build a component registry mapping JSON schemas to React components. Read Puck's source to understand how `Config` drives both the editor UI and the renderer.

Add CSS Custom Properties theming with Tailwind v4 for per-tenant branding. Study how `:root` variable injection can be done in Next.js middleware or a server component. Layer in a GraphQL API (start with a mock, then connect to Medusa.js or Vendure). Implement the iframe + postMessage preview architecture, referencing Payload's live preview source for the message protocol.

Finally, add ISR caching with per-tenant cache keys and [dynamic sitemaps](https://nextjs.org/docs/app/guides/caching) for SEO. Each step builds on the previous one, and together they replicate the core of what makes Shopify's frontend architecture work, without Liquid.

---

## Conclusion

Shopify's frontend architecture succeeds not because of any single technology but because of a layered customization model that matches safety guarantees to user capability. Liquid provides sandboxed template-level customization for merchants. The JSON template + sections/blocks system provides SDUI-level page composition for non-developers. Hydrogen provides full React freedom for engineering teams.

The key architectural insight: **pages should be data, not code.** When you define pages as JSON schemas composed of typed sections and blocks, each with declared settings schemas, you get drag-and-drop editing, multi-surface rendering, safe tenant customization, and efficient caching almost for free. The [component registry](https://medium.com/front-end-weekly/building-a-component-registry-in-react-4504ca271e56) is the contract that makes this work: a mapping from type strings to validated, versioned, platform-specific implementations.

No single open-source project replicates Shopify's full stack. The most promising composition is **Medusa.js + Payload CMS + Puck + custom theme engine**, unified by a GraphQL API and deployed on edge infrastructure. The [Vercel Platforms Starter Kit](https://vercel.com/platforms/docs/examples/multi-tenant-template) provides the multi-tenant routing foundation. CSS Custom Properties provide runtime theming without per-tenant builds. React Server Components in Next.js provide the rendering engine where JSON schemas become HTML at the edge, cached per-tenant, and invalidated on-demand when merchants publish changes. The tools exist. The architecture is the hard part, and now you have the blueprint.
