---
title: 'Getting Started with Web Scraping and Data Pipelines in TypeScript'
description: 'A practical learning path for scraping the web, organizing data into pipelines, storing millions of rows, and visualizing it all. Tools, code, and resources to get started with TypeScript.'
publishDate: 2026-03-14
tags: ['data-engineering', 'typescript', 'scraping', 'learning-path']
---

Most developers know how to build apps. Fewer know how to collect data at scale, clean it, store millions of rows so they query fast, and build dashboards that turn raw numbers into decisions. That's the skill set that compounds.

The good news? You don't need to become a Python developer. The TypeScript ecosystem for data engineering has grown up. You can scrape websites, run job queues, query analytical databases, and build dashboards, all in TypeScript. Where Python is truly needed (just two tools), you'll barely touch it.

This post is a learning path. It tells you what to learn, in what order, why each piece matters, and where to find the best resources. Whether you're a frontend developer, a backend engineer, or anyone in tech comfortable with TypeScript, there's something here for you.

Let's walk through the full stack, piece by piece.

---

## The big picture: what you're building

Before diving into tools, picture the end result. You're building a system that does this:

1. **Scrapes** data from websites automatically, on a schedule
2. **Stores** the raw data safely (so you never lose it)
3. **Cleans and transforms** that data into something useful
4. **Loads** the clean data into a fast analytical database
5. **Displays** everything in a custom dashboard with charts, tables, and controls

Each step uses different tools. Each tool solves a specific problem. The real skill isn't learning any single tool. It's knowing how they connect.

Here's the flow:

```
[Websites] → Scraper (Crawlee + Playwright)
    ↓
[Raw Storage] → MinIO (files) + Postgres (tables)
    ↓
[Transform] → dbt (SQL models that clean your data)
    ↓
[Analytics] → ClickHouse (fast queries over millions of rows)
    ↓
[Dashboard] → Next.js + Recharts (your UI layer)
```

Now let's learn each piece.

---

## Step 1: Learn web scraping (start here)

Scraping is the entry point. You can't build pipelines or dashboards without data. And the best scraping tools in 2026 are TypeScript-native. You already know the language.

### Why it matters

Every data product starts with data collection. Price trackers, market research tools, content aggregators, competitor monitors, job boards, all of them scrape the web. If you can write a reliable scraper, you can build any of these.

### Two ways to scrape

There are two approaches, and you pick based on what the website gives you.

**HTTP (Hypertext Transfer Protocol) scraping** sends a request, gets HTML back, and parses it. No browser needed. It's fast, handling hundreds of pages per second, and works great for static sites and server-rendered pages.

**Browser automation** launches a real Chromium browser, runs JavaScript, clicks buttons, scrolls pages. It's slower (a few pages per second) but necessary when content loads dynamically via JavaScript.

The rule is simple: try HTTP first. If the HTML you get back has the data you need, stay there. If you get an empty `<div id="root"></div>` with a JS bundle, switch to browser automation.

### The tools you need

**[Crawlee](https://github.com/apify/crawlee)** (21,700+ stars) is your main framework. Built by Apify, written entirely in TypeScript. It's not just a scraping library. It handles the hard stuff for you: URL queues, automatic retries, concurrency that scales with your CPU, proxy rotation, and browser fingerprinting. It gives you different crawler classes for different jobs. `CheerioCrawler` for fast HTTP scraping. `PlaywrightCrawler` for browser automation. `AdaptivePlaywrightCrawler` that automatically picks the right mode per page.

**[Playwright](https://github.com/microsoft/playwright)** (~68k stars) powers the browser layer. You probably know it from testing. For scraping, the key features are request interception (block images to speed things up), multiple browser contexts for parallel sessions, and full page interaction APIs. Crawlee wraps Playwright, but understanding the raw API helps when debugging tricky pages.

**[Cheerio](https://github.com/cheeriojs/cheerio)** (30k stars) is the fast HTML parser. jQuery-style selectors, no browser needed. When you're scraping static pages, Cheerio plus an HTTP client is 10-100x faster than launching a browser.

**[impit](https://github.com/apify/impit)**: the HTTP client you should use with Cheerio. Built in Rust with Node.js bindings, it provides browser-grade TLS (Transport Layer Security) fingerprinting through a standard `fetch()` API. Regular HTTP clients like axios get detected by anti-bot systems because their TLS fingerprints don't match real browsers. impit solves this at the protocol level.

### Anti-bot basics

Modern websites detect scrapers at multiple layers. **TLS fingerprinting** checks if your connection looks like a real browser (impit handles this). **Browser fingerprinting** checks JavaScript values like `navigator.webdriver` (the **[fingerprint-suite](https://github.com/apify/fingerprint-suite)** handles this, and Crawlee includes it by default). **CDP (Chrome DevTools Protocol) leak detection** catches Playwright artifacts (**[rebrowser-patches](https://github.com/rebrowser/rebrowser-patches)** fixes these).

For proxy rotation, Crawlee has built-in `ProxyConfiguration` that favors proxies with better success rates.

### Key concepts to internalize

- **Selectors**: CSS selectors and XPath for targeting elements. If you've written React tests, you already get this.
- **Pagination**: Recursively adding "next page" links to Crawlee's queue. It deduplicates automatically.
- **Sessions**: A session ties together a proxy IP, cookies, and a fingerprint into one consistent "identity." Crawlee manages these for you.
- **Concurrency**: Crawlee's `AutoscaledPool` adjusts parallel requests based on your system's resources.
- **Validation**: Use Zod schemas to validate scraped data. Define the shape you expect, parse through Zod, and catch when a website changes its structure.

### Where to learn

- **[Apify Academy](https://docs.apify.com/academy)**: Free, structured, and the single best resource. Start with "Web Scraping Basics for JavaScript Devs" and work through to "Advanced Web Scraping."
- **[Crawlee docs](https://crawlee.dev)**: Official documentation with examples
- **[Playwright docs](https://playwright.dev)**: Essential for browser automation
- **[Scrapism](https://scrapism.lav.io/)**: A creative, hands-on guide to web scraping that teaches the fundamentals through art and data journalism projects. Great for building intuition around HTML parsing and data extraction patterns.
- **[Firecrawl](https://github.com/firecrawl/firecrawl)** (~92k stars): Worth studying for its patterns around batch job management and API design

---

## Step 2: Learn job queues and scheduling

Your scraper works. Now it needs to run automatically. Every 6 hours. Every night at 3 AM. And when it fails (it will), it needs to retry without you waking up.

### Why it matters

A scraper you run manually is a script. A scraper that runs on a schedule, retries on failure, and reports its status is a product. Job queues are what make that difference.

### The tool: BullMQ

**[BullMQ](https://github.com/taskforcesh/bullmq)** is the answer. Written natively in TypeScript, backed by Redis. It handles everything: scheduled jobs via cron expressions, retries with configurable backoff, concurrency control, rate limiting, priority queues, and parent-child job flows for complex chains.

Think of BullMQ as the replacement for your `setInterval` instinct. When your scraper crashes at 3 AM, BullMQ retries it. When you want 10 scrapers running but don't want to overwhelm your proxy pool, BullMQ rate-limits them. When you need scrape → clean → load in sequence, BullMQ's `FlowProducer` chains jobs with dependency tracking.

It requires Redis (which you'll already have running). Setup is `npm i bullmq`.

For monitoring, **[Bull Board](https://github.com/felixmosh/bull-board)** gives you a web UI showing queue status, failed jobs, and retry controls. It has adapters for Express, Fastify, Hono, and more.

### When you need more: orchestration tools

For simple workflows, BullMQ is enough. When your pipelines get complex (dozens of interdependent jobs, multiple data sources, complex scheduling), you'll want a proper orchestrator.

**[Dagster](https://github.com/dagster-io/dagster)**: The best orchestrator for data pipelines. Yes, it's Python. But it models pipelines as data assets rather than tasks, the UI is beautiful, and local testing is easy (`dagster dev`). The good news: **Dagster Pipes** (`@dagster-io/dagster-pipes` on npm) lets you orchestrate TypeScript processes from Dagster. The orchestration layer stays Python, but your actual code runs in TypeScript.

For fully TypeScript-native orchestration:

- **[Temporal](https://github.com/temporalio/temporal)** (13k+ stars): The strongest option. Write workflows as async TypeScript functions with automatic state persistence and failure recovery. Used by Stripe, Netflix, and Snap. Run locally with `temporal server start-dev`.
- **[Trigger.dev](https://github.com/triggerdotdev/trigger.dev)** (~12.9k stars): TypeScript-native background jobs with retries and observability. Designed for the Next.js ecosystem. Self-hostable.
- **[Windmill](https://github.com/windmill-labs/windmill)**: Open-source workflow engine with first-class TypeScript support. Visual flow editor plus code-first workflows.

### Where to learn

- **[BullMQ docs](https://docs.bullmq.io)**: Excellent, TypeScript-first documentation
- **[Dagster docs](https://docs.dagster.io)**: Includes free Dagster University courses
- **[Temporal TypeScript docs](https://docs.temporal.io)**: SDK reference and tutorials

---

## Step 3: Learn the storage layer

You need four types of storage. Each solves a different problem. They're not interchangeable.

### Why it matters

Most developers know one database (maybe Postgres, maybe MongoDB). Data engineering needs more. Different data shapes need different storage engines. Using the wrong one means slow queries, wasted disk space, or lost data.

### PostgreSQL: your application database

Postgres is your workhorse for structured data. Users, scraper configs, job metadata, pipeline state. For data engineering, it also serves as your **staging area**: raw scraped data lands here first before being transformed.

Setup is one Docker command: `docker run -d --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:17`

For TypeScript access, you have two good ORMs (Object-Relational Mappers):

**[Drizzle ORM](https://github.com/drizzle-team/drizzle-orm)**: My recommendation. Its philosophy is "if you know SQL, you know Drizzle." Schemas live in TypeScript files with no code generation, no separate DSL (Domain-Specific Language). Queries map one-to-one to SQL, so window functions and CTEs work naturally. At ~7.4KB minified, it's tiny. One SQL per query guaranteed, no N+1 surprises.

**[Prisma](https://github.com/prisma/prisma)** (v7): The alternative for higher-level abstraction. Prisma 7 rewrote the engine in pure TypeScript (the Rust engine is gone), meaning faster cold starts. Great for CRUD-heavy apps. The trade-off: it abstracts away SQL, making analytical queries harder. Use Prisma if your dashboard is the main product. Use Drizzle if your data pipeline is.

### ClickHouse: your analytical warehouse

This is where the mental model shift happens. **[ClickHouse](https://github.com/ClickHouse/ClickHouse)** is a columnar database designed for analytics. Where Postgres stores data row by row (great for "get user 42's profile"), ClickHouse stores data column by column (great for "count all events by day across 100 million rows").

The result: analytical queries run 100-1000x faster than Postgres on the same data.

The mental model: Postgres is your app's database. ClickHouse is your analytics warehouse. You don't UPDATE or DELETE individual rows in ClickHouse (those are expensive). You INSERT in bulk and SELECT with aggregations. Think of it as an append-only analytics engine.

Connect from TypeScript with the official client `@clickhouse/client`:

```typescript
import { createClient } from '@clickhouse/client';

const client = createClient({
  url: 'http://localhost:8123',
  username: 'default',
  password: 'changeme',
});

const rows = await client.query({
  query: `SELECT toDate(timestamp) as day, count() as events
          FROM scrape_events GROUP BY day ORDER BY day DESC`,
  format: 'JSONEachRow',
});
console.log(await rows.json());
```

Key concepts: **MergeTree engine** (the primary table engine), **materialized views** (pre-compute aggregations at insert time for instant dashboard queries), and **`LIMIT BY`** (top-N per group without window functions).

### MinIO: your local S3

**[MinIO](https://github.com/minio/minio)** is S3 (Simple Storage Service)-compatible object storage that runs locally. Store raw, unstructured data here: HTML dumps, JSON responses, images, PDFs. This is your **bronze layer**, the immutable archive of everything you've ever scraped.

The key insight: store raw data in MinIO before doing anything with it. If your transformation logic has a bug, you can reprocess from the raw data without re-scraping. If requirements change in six months, the raw data is still there.

MinIO's API is identical to AWS S3, so you use the standard `@aws-sdk/client-s3` package.

### Redis: queues and caching

Redis serves two roles: backing store for BullMQ job queues and caching layer for expensive database queries. Use **[ioredis](https://github.com/redis/ioredis)** as your TypeScript client. It's what BullMQ uses internally, written in TypeScript, and supports clustering, pipelining, and pub/sub.

### Run it all with Docker Compose

One file, one command (`docker compose up -d`), and your entire storage layer is running:

```yaml
services:
  postgres:
    image: postgres:17
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: dataeng
    ports: ["5432:5432"]
    volumes: [postgres_data:/var/lib/postgresql/data]

  clickhouse:
    image: clickhouse/clickhouse-server:latest
    environment:
      CLICKHOUSE_USER: default
      CLICKHOUSE_PASSWORD: clickhouse
    ports: ["8123:8123", "9000:9000"]
    volumes: [clickhouse_data:/var/lib/clickhouse]
    ulimits:
      nofile: { soft: 262144, hard: 262144 }

  redis:
    image: redis:8-alpine
    ports: ["6379:6379"]
    volumes: [redis_data:/data]
    command: redis-server --appendonly yes

  minio:
    image: minio/minio
    ports: ["9090:9000", "9091:9001"]
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    volumes: [minio_data:/data]
    command: server /data --console-address ":9001"

volumes:
  postgres_data:
  clickhouse_data:
  redis_data:
  minio_data:
```

### Real-world references

Study these open-source projects to see this exact stack in production:

- **[Langfuse](https://github.com/langfuse/langfuse)**: LLM (Large Language Model) observability platform running PostgreSQL + ClickHouse + Redis + MinIO
- **[PostHog](https://github.com/PostHog/posthog)**: Product analytics using ClickHouse for analytics and Postgres for app state

### Level up your SQL

Your basic SQL needs an upgrade for data engineering. Focus on:

- **Window functions**: `ROW_NUMBER`, `RANK`, `LAG`, `LEAD`, running totals
- **CTEs** (Common Table Expressions): For readable complex queries
- **Aggregation patterns**: `GROUP BY` with `HAVING`, rollups

Resources:

- **[LearnSQL.com Window Functions](https://learnsql.com/course/window-functions/)**: Interactive, best-in-class (periodically free)
- **[Mode Analytics SQL Tutorial](https://mode.com/sql-tutorial/)**: Free, uses real datasets
- **[ClickHouse Tutorial](https://clickhouse.com/docs/tutorial)**: NYC taxi dataset walkthrough

---

## Step 4: Learn data transformation with dbt

Your raw scraped data is messy. Duplicate rows, inconsistent formats, missing fields. dbt turns that mess into clean, reliable tables.

### Why it matters

Raw data is rarely useful directly. A price tracker that shows "$19.99" and "19.99" as different prices is broken. A product list with duplicate entries inflates your numbers. Transformation is where data becomes trustworthy.

### What dbt actually does

Think of **[dbt](https://github.com/dbt-labs/dbt-core)** (data build tool) as webpack for SQL. You write SELECT statements in `.sql` files called "models." dbt compiles them, figures out dependencies between them, and runs them against your database to create tables and views.

Each model produces one table or view. The `{{ ref('other_model') }}` function creates dependencies. dbt builds a DAG (directed acyclic graph) and runs everything in the right order.

Here's what a dbt model looks like:

```sql
-- models/clean_products.sql
SELECT
    id,
    trim(lower(title)) as title,
    cast(replace(price_text, '$', '') as decimal(10,2)) as price,
    scraped_at,
    ROW_NUMBER() OVER (PARTITION BY url ORDER BY scraped_at DESC) as rn
FROM {{ ref('raw_products') }}
WHERE price_text IS NOT NULL
QUALIFY rn = 1  -- latest scrape per URL
```

dbt handles materializing this as a table, a view, or an incremental model. You also get tests (assert columns are unique, not null) and seeds (CSV files loaded as lookup tables).

### The Python question

Yes, dbt is Python. But here's the thing: you almost never touch Python. You write SQL. Your Python exposure is limited to `pip install dbt-core dbt-clickhouse` and editing YAML config files. Run dbt in a Docker container if you want Python completely out of your local environment.

There is no mature TypeScript alternative to dbt in 2026. **[MooseStack](https://github.com/514-labs/moosestack)** provides TypeScript interfaces for ClickHouse but doesn't replicate dbt's model/test/DAG system.

That said, look at **[Cube](https://github.com/cube-js/cube)** as the TypeScript-native complement to dbt. Cube is a semantic layer: it sits between your data warehouse and your dashboard, letting you define metrics, dimensions, and access rules in TypeScript. Where dbt transforms raw data into clean tables, Cube exposes those clean tables as a typed API your frontend can query directly. If you're building a data product that others will use, Cube teaches you how to turn warehouse data into a proper API. Study its architecture even if you don't use it right away.

### Where to learn

- **[dbt Fundamentals](https://learn.getdbt.com/courses/dbt-fundamentals)**: Free, ~5 hours, covers everything to start
- **[dbt docs](https://docs.getdbt.com/)**: Comprehensive reference
- Free follow-up courses on dbt Learn: Jinja/Macros/Packages (~2 hours), Materializations (~2 hours), Refactoring SQL (~3.5 hours)

---

## Step 5: Build the dashboard

You've scraped data, stored it, cleaned it, and loaded it into ClickHouse. Now you need eyes on it. This is where your frontend skills shine.

### Why build custom

Tools like **[Metabase](https://github.com/metabase/metabase)** (46k stars) are great for ad-hoc exploration. Study its UI patterns for inspiration. **[Evidence.dev](https://github.com/evidence-dev/evidence)** renders SQL in Markdown as interactive charts, worth looking at for its declarative approach.

But a custom dashboard lets you integrate scraper controls, pipeline triggers, job monitoring, and data tables into one interface tailored to your workflow.

### The dashboard stack

**Next.js 16** with the App Router is the foundation. Server Components query databases directly in your components. Server Actions handle mutations like triggering a scraper run. Streaming with Suspense shows KPI (Key Performance Indicator) cards immediately while heavier queries load.

For charts, **[shadcn/ui Chart components](https://ui.shadcn.com/docs/components/radix/chart)** built on Recharts give you 53+ pre-built chart variants with automatic light/dark mode support. **[Tremor](https://tremor.so)** is the alternative with pre-built dashboard components (KPI cards, trackers, bar lists) beyond just charts.

For the API layer, **[Hono](https://github.com/honojs/hono)** (~22k stars) is ideal. TypeScript-first, under 12KB, runs on Bun, Node.js, and edge runtimes. Perfect for lightweight API services between your dashboard and databases.

### What to build in the dashboard

Four capabilities:

- **Data tables**: Browse scraped data with pagination, filtering, sorting. Server Components query Postgres/ClickHouse directly.
- **Scraper controls**: Trigger runs on demand, view running scrapers, see history. Wire to BullMQ through Server Actions.
- **Pipeline monitoring**: Status, last run times, row counts, error rates. Pull from BullMQ job metadata in Redis.
- **Analytics charts**: Time-series of scraped data trends, volume over time, quality metrics. Query ClickHouse and render with Recharts.

---

## The ELT pattern: how data flows

Before you build, understand the pattern that ties everything together.

In frontend terms, **ETL** (Extract, Transform, Load) is like preprocessing all your API data in middleware before it hits the store. **ELT** (Extract, Load, Transform) is like dumping everything raw into the store first and transforming it with computed selectors downstream.

**ELT is the modern default.** Today's analytical databases (ClickHouse, BigQuery, Snowflake) have enormous compute power. It's cheaper to transform data inside the warehouse than on a separate server.

The practical benefit: your Extract and Load steps become simple "move data from A to B" operations. Transformation happens later in SQL via dbt. If requirements change, you don't re-extract. You just write new queries against the raw data you already loaded.

**Raw data is preserved as an immutable asset.** This is why MinIO matters.

For moving data from well-known sources (APIs, third-party databases), **[Airbyte](https://github.com/airbytehq/airbyte)** has 600+ pre-built connectors. If Airbyte doesn't have a connector for your niche source, you can build one. Airbyte's official CDK (Connector Development Kit) is Python, but the **[Faros.ai TypeScript CDK](https://github.com/faros-ai/airbyte-connectors)** is an actively maintained community alternative that lets you write custom connectors in TypeScript. For everything else, write custom scrapers with Crawlee.

---

## Your first project: the Price Tracker

Theory is great. Building is better. The Price Tracker is the "todo app" of data engineering. Small enough for a weekend, complex enough to touch every layer.

**Day 1**: Set up Docker Compose (Postgres + Redis). Write a single Crawlee `CheerioCrawler` that scrapes product prices from one public e-commerce site. Store results in Postgres via Drizzle.

**Day 2**: Add BullMQ to schedule the scraper every 6 hours. Write a basic dbt model that deduplicates and cleans the raw data.

**Day 3**: Add ClickHouse to Docker Compose. Write a load script that copies clean data from Postgres to ClickHouse. Create a materialized view for daily price averages.

**Day 4**: Build a minimal Next.js dashboard with a price history chart (Recharts), a data table, and a "Run Scraper Now" button wired to BullMQ.

**Day 5**: Add MinIO for raw HTML storage. Add a second scraper for a different site. Add error handling and retry logic.

Each day adds one layer. By the end of the week, you have a working data product.

---

## Monorepo structure for serious projects

When you're ready to go beyond the Price Tracker, organize your code like this with **[Turborepo](https://github.com/vercel/turborepo)** and pnpm workspaces:

```
data-stack/
├── apps/
│   └── dashboard/          # Next.js App Router
├── packages/
│   ├── scraper/            # Crawlee scrapers
│   ├── pipeline/           # BullMQ workers
│   ├── db/                 # Drizzle schema + ClickHouse client
│   └── shared/             # Zod schemas, types, utils
├── dbt/                    # SQL transforms (lives outside packages/)
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```

Namespace packages as `@repo/scraper`, `@repo/pipeline`, `@repo/db`. Turborepo handles build ordering. The dbt project lives outside `packages/` since it's SQL, not TypeScript.

---

## A note on Bun

**[Bun](https://github.com/oven-sh/bun)** is the preferred runtime where it works. Use it for: Hono API servers, BullMQ workers, utility scripts, and package management (`bun install` is 10x faster than npm).

Where to stick with Node.js: Playwright workers (Bun has issues with Playwright's CDP WebSocket upgrades) and Temporal workers (requires native Node.js modules). The pragmatic approach: use Bun as your package manager everywhere and as your runtime for everything except Playwright and Temporal.

---

## The Python tools you should know about

This guide is TypeScript-first, but some of the most important tools in data engineering are Python. You don't need to become a Python developer to use them. You just need to know what they do and when to reach for them.

### Orchestration

**[Apache Airflow](https://github.com/apache/airflow)**: The industry standard for pipeline orchestration. Python-only, older, but almost every data engineering job listing mentions it. Airflow introduced the DAG (Directed Acyclic Graph) concept that every orchestrator now copies. Learn what DAGs are and how task dependencies work by studying Airflow's documentation, even if you use Temporal or Dagster in practice.

**[Prefect](https://github.com/PrefectHQ/prefect)**: Simpler than Dagster to get started with. Good for scheduling and monitoring pipelines. Its flow/task model is clean and easy to understand. If Dagster feels heavy, Prefect is a lighter entry point into Python orchestration.

**[Dagster](https://github.com/dagster-io/dagster)**: Already covered above, but worth repeating here. It's the best for learning because it thinks in data assets, not just tasks. Its TypeScript bridge (Dagster Pipes) means your actual processing code stays in TypeScript.

### Data movement

**[Meltano](https://github.com/meltano/meltano)**: Lighter than Airbyte, fully CLI (Command Line Interface)-driven, built on the Singer standard. Easier to self-host and understand internals. Great for learning how pipeline orchestration works under the hood. Think of it as the package manager for data connectors.

**[Singer](https://www.singer.io/)**: The open protocol that Meltano and many Airbyte connectors use. The concept is simple and powerful: **taps** extract data and output JSON to stdout, **targets** read that JSON from stdin and load it somewhere. Any tap works with any target. `tap-github | target-postgres` is a complete pipeline in one shell command. Understanding this pattern teaches you how data connectors work at a fundamental level.

### Transformation

**[dbt](https://github.com/dbt-labs/dbt-core)**: Already covered in detail above. The install is Python (`pip install dbt-core`), but the work is SQL.

### When to learn Python

You don't need Python on day one. Start with the TypeScript stack. When you hit a wall, usually around complex orchestration or a connector that only exists in Python, learn just enough to use that specific tool. Install Python, run `pip install`, edit a YAML file, and move on. The data engineering community runs on Python, so reading Python code is a useful skill even if you don't write much of it.

---

## The learning order (summary)

If you're starting from scratch, follow this sequence:

1. **Web scraping** (Crawlee + Cheerio + Playwright). This gets you data and quick wins.
2. **PostgreSQL + Drizzle ORM**. Store what you scrape. Learn SQL (Structured Query Language) beyond basic CRUD (Create, Read, Update, Delete).
3. **BullMQ + Redis**. Automate your scrapers. Learn job queues and scheduling.
4. **dbt**. Transform raw data into clean tables. Level up your SQL with window functions and CTEs.
5. **ClickHouse**. Move analytics to a columnar database. Learn why it's 100-1000x faster.
6. **Next.js dashboard**. Build the UI layer. This is where your frontend skills pay off.
7. **MinIO**. Add raw file storage as your safety net.
8. **Orchestration** (Temporal or Dagster). Graduate to complex, multi-step pipelines.

Each step builds on the previous one. Don't skip ahead. The Price Tracker project from above walks you through steps 1-6 in a week.

---

## The real skill

The individual tools are learnable in days. Crawlee's API is cleaner than most React libraries. ClickHouse SQL is just SQL with better aggregation functions. dbt models are SELECT statements with a build system.

None of these are harder than learning Next.js App Router.

The rare skill is **architecture**: knowing that raw HTML goes to MinIO, metadata goes to Postgres, clean data goes to ClickHouse, and the dashboard queries the right database for the right job. Knowing that BullMQ handles scheduling so you don't write fragile cron jobs. Knowing that dbt runs inside the database so you don't move data unnecessarily.

TypeScript's data engineering ecosystem crossed a maturity threshold in 2025. You no longer need Python for scraping, job queues, HTTP APIs, or database access. You need it for dbt and optionally Dagster, both SQL-centric tools where Python is just the runtime.

The era of "data engineering requires Python" is ending. The era of full-stack TypeScript data products is here. And you already know the hardest part: building the UI.

Start with the Price Tracker. Build it this weekend. The rest follows.
