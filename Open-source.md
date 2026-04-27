# Paid open-source frontend projects worth contributing to

**For a senior React/Next.js developer with ecommerce experience, Cal.com, Remotion, and tscircuit offer the strongest combination of real bounty payouts, production-grade architecture, and meaningful frontend work.** These projects have collectively paid out over $55,000 to open-source contributors via Algora, with individual bounties ranging from $25 to $2,500. The ecosystem has matured significantly since 2024: Algora.io has emerged as the dominant bounty platform, [GitHub +2](https://github.com/algora-io) trusted by 15+ YC-backed companies and processing payments through Stripe [Medium](https://medium.com/@giannis_34055/algora-open-source-coding-bounties-5083edc5327f) with full tax compliance. Below are ten curated projects — eight with confirmed paid bounties and two ecommerce-specific architecture picks.

---

## The eight projects that actually pay frontend contributors

Every project below has a verified track record of paying contributors through Algora or IssueHunt. Bounties are assigned via `/bounty $AMOUNT` comments on GitHub issues [Algora +3](https://algora.io/eronka/bounties?status=completed) and paid through Stripe upon PR merge. [Algora +2](https://docs.algora.io/bounties/workflow)

### 1\. Cal.com — the gold standard for bounty-driven development

| Detail              | Info                                                                    |
| ------------------- | ----------------------------------------------------------------------- |
| **Repo**            | [github.com/calcom/cal.com](https://github.com/calcom/cal.com)          |
| **Stars**           | ~36,000                                                                 |
| **Stack**           | Next.js, React, TypeScript, tRPC, Prisma, Tailwind CSS, PostgreSQL      |
| **Bounty platform** | Algora — [algora.io/calcom/bounties](https://algora.io/calcom/bounties) |
| **Total paid**      | **$12,194+** across 185 completed bounties                              |
| **Bounty range**    | $20–$500 per issue (most common: $50–$200)                              |
| **Domain**          | Scheduling infrastructure (Calendly alternative)                        |

Cal.com runs the most consistently active bounty program in the React/Next.js ecosystem. [Algora](https://algora.io/cal/bounties/community?fund=calcom/cal.com%2315577) **772+ contributors** have worked on the codebase, and the project uses Algora as a "bounty-to-hire" pipeline — multiple full-time hires started as bounty hunters. [LinkedIn](https://www.linkedin.com/company/algorapbc) The monorepo architecture is exemplary: clean package separation, type-safe APIs via tRPC, and thorough documentation including `.cursor` and `CLAUDE.md` files for AI-assisted development. Top bounty earner Aaron Presley made $1,200; several contributors have earned $800+ each. [Algora](https://algora.io/cal/bounties/community?fund=calcom/cal.com%2315577)

**Getting started:** Clone the repo, run `yarn install` and `yarn dev`, configure `.env.local`. Look for issues labeled "💎 Bounty" or browse their Algora board for open bounties. [GitHub](https://github.com/calcom/cal.com/issues/11558) The codebase is accessible for anyone comfortable with Next.js App Router patterns.

---

### 2\. tscircuit — highest bounty volume on Algora

| Detail              | Info                                                                                              |
| ------------------- | ------------------------------------------------------------------------------------------------- |
| **Repo**            | [github.com/tscircuit/tscircuit](https://github.com/tscircuit/tscircuit)                          |
| **Stack**           | React, TypeScript, SVG/Canvas rendering                                                           |
| **Bounty platform** | Algora — [algora.io/tscircuit/bounties/community](https://algora.io/tscircuit/bounties/community) |
| **Total paid**      | **$20,419** across 590 bounties + 117 tips                                                        |
| **Currently open**  | **37 bounties totaling $2,581**                                                                   |
| **Bounty range**    | $10–$500 per issue (most common: $25–$150)                                                        |
| **Domain**          | Electronics design using React components                                                         |

tscircuit is the single most prolific bounty program on Algora by volume. **52 contributors from 48 countries** have earned money here, with top earner Shibo collecting **$4,858**. [algora](https://algora.io/tscircuit/bounties/community?fund=tscircuit/core)[Algora](https://algora.io/tscircuit/bounties/community?fund=tscircuit/core) The project lets you design printed circuit boards using React components — a unique domain that makes for impressive portfolio pieces. Bounties skew smaller ($25–$150) but there's always work available: 37 open bounties as of March 2025. [algora](https://algora.io/tscircuit/bounties/community?fund=tscircuit/core)[Algora](https://algora.io/tscircuit/bounties/community?fund=tscircuit/core) The two-person team maintains a rapid feedback loop on PRs.

**Getting started:** Browse open bounties on Algora, pick one matching your React skills. Many issues involve UI work on the PCB viewer, component rendering, and interactive editors — all frontend-heavy. Create an Algora account, connect Stripe, and claim issues via `/claim` comments. [Medium](https://medium.com/@giannis_34055/algora-open-source-coding-bounties-5083edc5327f)[Remotion](https://www.remotion.dev/docs/contributing/bounty)

---

### 3\. Remotion — best-documented bounty process

| Detail               | Info                                                                                                                                                      |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Repo**             | [github.com/remotion-dev/remotion](https://github.com/remotion-dev/remotion)                                                                              |
| **Stars**            | ~21,000                                                                                                                                                   |
| **Stack**            | React, TypeScript, Node.js, Rust (FFmpeg bindings), CSS/Canvas/WebGL                                                                                      |
| **Bounty platforms** | Algora + IssueHunt                                                                                                                                        |
| **Total paid**       | **$22,969** ($16,060 on Algora across 80 bounties; [Algora](https://algora.io/remotion/home) $6,909 on IssueHunt) [IssueHunt](https://oss.issuehunt.io/r) |
| **Bounty range**     | $50–$500 per issue                                                                                                                                        |
| **Domain**           | Programmatic video creation with React                                                                                                                    |

Remotion stands out for having the **most transparent and well-documented bounty process** of any project. Their dedicated [bounty documentation](https://www.remotion.dev/docs/contributing/bounty) explains rules clearly: one bounty at a time per contributor, weekly progress updates required, and explicit guidance during Hacktoberfest. [Remotion](https://www.remotion.dev/docs/contributing/bounty) The monorepo architecture spans multiple packages (`@remotion/core`, `@remotion/cli`, `@remotion/lambda`) and includes Rust-based FFmpeg bindings, offering deep learning opportunities. Top earner collected **$3,240**. [Algora](https://algora.io/remotion/home)

**Getting started:** Read the bounty docs first, then browse labeled issues on GitHub. Remotion uses standard React patterns but applies them to video rendering — a creative niche that differentiates your portfolio. The project is source-available with free individual use. [GitHub](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md)

---

### 4\. Twenty CRM — highest individual bounties

| Detail              | Info                                                                        |
| ------------------- | --------------------------------------------------------------------------- |
| **Repo**            | [github.com/twentyhq/twenty](https://github.com/twentyhq/twenty)            |
| **Stars**           | ~39,700                                                                     |
| **Stack**           | React, TypeScript, NestJS, GraphQL (Apollo), PostgreSQL, Redis, Nx monorepo |
| **Bounty platform** | Algora — [algora.io/twentyhq/home](https://algora.io/twentyhq/home)         |
| **Total paid**      | **$5,100** across 7 bounties + 4 tips                                       |
| **Currently open**  | 1 bounty at **$2,500**                                                      |
| **Bounty range**    | $300–$2,500 per issue                                                       |
| **Domain**          | CRM (Salesforce alternative), YC S23                                        |

Twenty offers the **highest individual bounty amounts** on this list — their current open IMAP integration bounty sits at **$2,500**, [algora +2](https://algora.io/bounties) and past bounties have been $500–$1,000. The project has enterprise-grade architecture: an **Nx monorepo** with NestJS backend, GraphQL API via Apollo, Recoil state management, and Emotion styling. With 39,700 stars and 10,250+ commits, the codebase is deep and well-structured. Top earner Huzef collected **$3,650** from just a few bounties. [Algora](https://algora.io/twentyhq/home) Low bounty volume means less competition per issue.

**Getting started:** Set up the local dev environment via Docker (documented at docs.twenty.com). The frontend is a sophisticated React SPA with complex state management — ideal for senior developers who want to work on CRM UI patterns comparable to Salesforce-level architecture. [DEV Community](https://dev.to/vardhaman619/my-experience-with-modern-open-source-crm-twenty-crm-2hen) A CLA is required.

---

### 5\. Trigger.dev — YC-backed with proven bounty-to-hire pipeline

| Detail              | Info                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------ |
| **Repo**            | [github.com/triggerdotdev/trigger.dev](https://github.com/triggerdotdev/trigger.dev) |
| **Stars**           | ~17,000                                                                              |
| **Stack**           | Next.js, React, TypeScript, Node.js, PostgreSQL                                      |
| **Bounty platform** | Algora — [algora.io/triggerdotdev/home](https://algora.io/triggerdotdev/home)        |
| **Total paid**      | **$9,920** across 75 bounties + 31 tips                                              |
| **Bounty range**    | $25–$300 (top earner: $1,540)                                                        |
| **Domain**          | Background jobs and workflow automation, YC W23                                      |

Trigger.dev has paid out nearly **$10,000 to 35+ contributors** [Algora](https://algora.io/triggerdotdev/home) and famously hired contributor "nicktrn" to their founding team after discovering him through Algora bounties. [Algora](https://algora.io/platform) They also offer **$100 tips** for UX testing and screen recordings [GitHub](https://github.com/triggerdotdev/trigger.dev/issues/249) — a unique low-barrier entry point. The Next.js full-stack architecture covers dashboard UI, API routes, and a real-time job execution engine. Top earners include Sai Hari ($1,540), nicktrn ($1,300), and Chigala ($970). [Algora](https://algora.io/triggerdotdev/home)

**Getting started:** Check their Algora bounty board for open issues. The dashboard frontend is built with modern Next.js patterns and offers substantial React work. Start with a UX testing tip ($100) to learn the product before tackling code bounties.

---

### 6\. Documenso — active tips culture with Next.js/Remix stack

| Detail              | Info                                                                            |
| ------------------- | ------------------------------------------------------------------------------- |
| **Repo**            | [github.com/documenso/documenso](https://github.com/documenso/documenso)        |
| **Stars**           | ~8,000+                                                                         |
| **Stack**           | Next.js → Remix (migrated), React, TypeScript, Prisma, PostgreSQL, Tailwind CSS |
| **Bounty platform** | Algora                                                                          |
| **Total paid**      | **$3,075** across 4 bounties + 59 tips                                          |
| **Bounty range**    | $100–$640 per bounty                                                            |
| **Domain**          | Document signing (DocuSign alternative)                                         |

Documenso's payment model is unique: while formal bounties are fewer, the project has awarded **59 tips** to 37 contributors, [Algora](https://algora.io/Documenso/home) creating a culture where quality contributions regularly get rewarded even without a pre-assigned bounty. The project migrated from Next.js to Remix — studying this migration path is valuable for understanding both frameworks' trade-offs. The monorepo uses Prisma ORM, and the team maintains DevContainer support for quick onboarding. [GitHub](https://github.com/documenso/documenso) Top earner Nafees Nazik collected **$640**. [Algora](https://algora.io/Documenso/home)

**Getting started:** Fork the repo, configure `.env` from the example, use Docker for the database, and run `npm run dev`. [GitHub](https://github.com/documenso/documenso) Join the Discord where new bounty issues are shared regularly. [PostHog](https://posthog.com/spotlight/startup-documenso) The document signing UI involves complex frontend work — drag-and-drop fields, PDF rendering, and multi-party workflows.

---

### 7\. Firecrawl — YC-backed with bounty-to-hire success

| Detail              | Info                                                                       |
| ------------------- | -------------------------------------------------------------------------- |
| **Repo**            | [github.com/mendableai/firecrawl](https://github.com/mendableai/firecrawl) |
| **Stack**           | TypeScript, Next.js, React                                                 |
| **Bounty platform** | Algora — [algora.io/mendableai](https://algora.io/mendableai)              |
| **Total paid**      | Active but amounts not fully public                                        |
| **Domain**          | Web scraping API for AI, YC S22                                            |

Firecrawl achieved what many bounty contributors hope for: **contributor Gergő Móricz was hired full-time** after demonstrating skill through Algora bounties. [LinkedIn](https://www.linkedin.com/company/algorapbc)[Algora](https://algora.io/platform) The project builds web scraping infrastructure used by AI companies, and the frontend dashboard is a clean Next.js application. As a YC S22 company with growing revenue, bounties here tend to be well-funded. The AI-adjacent domain makes contributions especially resume-relevant in the current job market.

**Getting started:** Check the Algora bounty board for open issues. The frontend work involves building dashboard interfaces for scraping configuration, results visualization, and API management.

---

### 8\. Keep — high-volume integration bounties

| Detail              | Info                                                     |
| ------------------- | -------------------------------------------------------- |
| **Repo**            | [github.com/keephq/keep](https://github.com/keephq/keep) |
| **Stack**           | React, TypeScript, Python (backend)                      |
| **Bounty platform** | Algora — [algora.io/keephq](https://algora.io/keephq)    |
| **Total paid**      | Active — **42 integrations built via bounties**          |
| **Domain**          | Alert management platform, YC W23                        |

Keep uses Algora bounties at scale for a specific pattern: **building provider integrations**. [Algora](https://algora.io/bounties/) CEO Tal Borenstein [Algora](https://algora.io/bounties/c,c++) reported 42 integrations were built entirely through bounties. [algora](https://algora.io/bounties)[algora](https://algora.io/bounties/) This makes Keep ideal for contributors who want repeatable, well-scoped work — each integration follows a similar pattern but involves different APIs. The React frontend handles alert dashboards, workflow builders, and real-time notification UIs.

**Getting started:** Browse the Algora board for integration bounties. Each follows a documented pattern, making them predictable in scope. Prior experience with API integrations (common in ecommerce) maps directly to this work.

---

## Two ecommerce architecture picks without bounties

These projects don't have formal bounty programs but are included specifically because of their relevance to a developer with ecommerce experience and their exceptional codebases.

### 9\. Medusa.js — best-in-class headless commerce architecture

| Detail      | Info                                                                            |
| ----------- | ------------------------------------------------------------------------------- |
| **Repo**    | [github.com/medusajs/medusa](https://github.com/medusajs/medusa)                |
| **Stars**   | ~32,000                                                                         |
| **Stack**   | Node.js, TypeScript, Next.js (storefronts), React (admin dashboard), PostgreSQL |
| **Payment** | ❌ No bounty program — community contributions only                             |
| **Domain**  | Headless ecommerce engine                                                       |

Medusa's v2 architecture is arguably **the best-structured headless commerce codebase available today**: modular commerce modules, a workflow engine with dependency injection, and a clean plugin system. [Rigby](https://www.rigbyjs.com/why-medusa) Enterprise users include Mitsubishi (powering $4B in digital sales). [Medusa](https://medusajs.com/) The Next.js storefront starters and React admin dashboard offer direct frontend contribution paths. [Linearloop](https://www.linearloop.io/blog/medusa-js-headless-ecommerce-guide)[GitHub](https://github.com/medusajs/medusa/releases) While there's no bounty program, contributing builds deep ecommerce architecture knowledge and the project's MIT license means your contributions are highly visible. The ecosystem of agencies hiring Medusa developers creates indirect earning potential.

### 10\. Saleor — enterprise GraphQL commerce with Next.js storefront

| Detail      | Info                                                                                                |
| ----------- | --------------------------------------------------------------------------------------------------- |
| **Repo**    | [github.com/saleor/react-storefront](https://github.com/saleor/react-storefront) (Next.js frontend) |
| **Stars**   | ~22,600 (core)                                                                                      |
| **Stack**   | Next.js App Router, React, TypeScript, GraphQL, Tailwind CSS                                        |
| **Payment** | ❌ No bounty program — community contributions only                                                 |
| **Domain**  | Enterprise headless commerce (MACH-compliant)                                                       |

Saleor's storefront uses **Next.js App Router with React Server Components and GraphQL** — a stack directly transferable to any modern ecommerce role. [GitHub](https://github.com/saleor) Notable users include Lush and Breitling. [TechCrunch](https://techcrunch.com/2024/02/06/open-source-headless-commerce-builder-saleor-pulls-in-8m-round-led-by-target-global-and-zalando/) The storefront repo has 13 issues labeled "help wanted," [GitHub](https://github.com/saleor/saleor) and Saleor's GraphQL-first architecture teaches patterns that command premium consulting rates. Backed by $10.5M in funding with Zalando as a strategic investor. [Tech.eu](https://tech.eu/2024/02/06/open-source-ecommerce-platform-saleor-raises-8m/)

---

## How to maximize earnings as a bounty contributor

The bounty ecosystem rewards a specific workflow. **Start by creating accounts on Algora.io and connecting Stripe** — this is non-negotiable, [Remotion](https://www.remotion.dev/docs/contributing/bounty) as Algora handles 90%+ of active frontend bounties. [Remotion](https://www.remotion.dev/docs/contributing/bounty) Algora charges ~20% + 3% Stripe fees, [Opire](https://opire.dev/home)[Algora](https://api.docs.algora.io/bounties) meaning a $500 bounty nets you roughly $385.

The most effective strategy for a senior developer combines three tiers of work. First, **claim mid-range bounties ($100–$300) on Cal.com or Trigger.dev** to build reputation — these are well-scoped and have fast review cycles. Second, **target high-value bounties ($500–$2,500) on Twenty CRM** where competition is lower and individual payouts are higher. Third, **build volume on tscircuit** (37 open bounties at any time) for consistent income between larger bounties.

Ecommerce experience provides a specific edge on Cal.com (payment integration, booking flows), Keep (API integrations similar to ecommerce middleware), and Documenso (multi-party workflows resembling order fulfillment). The React/Next.js patterns in these projects — tRPC, GraphQL, Server Components, monorepo architecture — represent the current state of the art in frontend engineering.

## Conclusion

The paid open-source frontend ecosystem in 2025 is concentrated on **Algora.io** as the dominant platform, [GitHub +3](https://github.com/algora-io) with eight projects offering verified, consistent payouts for React and Next.js work. Cal.com leads in volume and consistency, tscircuit in sheer opportunity count, and Twenty CRM in per-bounty value. The bounty-to-hire pipeline is real: Trigger.dev and Firecrawl both converted bounty contributors to full-time employees. [Algora](https://algora.io/platform) For a senior developer, the optimal approach isn't choosing one project but building a portfolio across several — earning $5,000–$15,000 annually in bounties while accumulating production-grade contributions that demonstrate architecture fluency at a level most interview take-homes cannot match.
