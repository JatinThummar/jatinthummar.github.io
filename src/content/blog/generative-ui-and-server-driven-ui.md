---
title: "Generative UI and Server-Driven UI: A React Dev's Intro"
description: 'Two patterns reshaping how React apps are built: what they are, how they work, and when to use each one.'
publishDate: 2026-02-24
tags: ['engineering', 'frontend', 'react']
---

You've shipped a React app. Product wants to change the homepage layout for a campaign, but that means a PR, review, and deploy. Marketing wants to A/B test three card designs. A user asks your chatbot something, and the right answer isn't text, it's a chart or a form.

Both patterns covered here solve versions of this problem. And they share one key insight: **UI decisions don't have to live in client code.**

---

## Server-Driven UI

**The server describes the interface. The client renders it.**

Instead of hardcoding which components appear when, your server sends a JSON payload:

```json
{
	"components": [
		{ "type": "HeroBanner", "props": { "headline": "Summer Sale" } },
		{ "type": "ProductCarousel", "props": { "ids": [1, 2, 3] } }
	]
}
```

Your React client holds a registry, mapping type strings to actual components:

```tsx
const REGISTRY = {
	HeroBanner: HeroBanner,
	ProductCarousel: ProductCarousel,
};

function SDUIScreen({ components }) {
	return components.map(({ type, props }) => {
		const Component = REGISTRY[type];
		return Component ? <Component key={type} {...props} /> : null;
	});
}
```

That's it. The layout is now controlled by the server. No client deploy needed.

**Why it matters:** [Airbnb](https://medium.com/airbnb-engineering/a-deep-dive-into-airbnbs-server-driven-ui-system-842244c5f5), [Uber](https://www.uber.com/blog/developing-the-actioncard-design-pattern/), and [Lyft](https://eng.lyft.com/the-journey-to-server-driven-ui-at-lyft-bikes-and-scooters-c19264a0378e) built significant parts of their products this way. The main driver is mobile: shipping an app update takes days waiting for App Store review. With SDUI, a layout change that used to require a release now just takes a server config update. Uber's team reported 10x feature velocity after adopting this pattern. Faire, an e-commerce platform, eliminated 90% of their rendering logic and 65% of their code after migrating.

On the web, SDUI shines on high-churn surfaces: homepages, promotions, settings pages — anything product or marketing changes constantly.

**The honest tradeoff:** your backend now needs to understand UI structure. Complex interactions like drag-and-drop, rich animations, or game-like UIs are hard to express in a JSON schema. Most teams apply SDUI to the surfaces that change often, and use native implementations for performance-critical screens.

**Reach for SDUI when:**

- You're building a mobile app and need to ship without App Store delays
- Marketing or product controls the layout, not engineering
- You need instant A/B testing across platforms

---

## Generative UI

**An AI model decides which components to render based on what the user asked.**

The mental model: you build a library of components, describe each one to the AI, and the AI selects and populates them at runtime.

One thing to clear up before the code: **the model is not generating JSX.** It can only call tools you've explicitly defined. Think of it like a menu — you decide what's on it, and the model picks from your list. If a tool isn't registered, the model can't use it.

```tsx
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const result = await streamText({
	model: openai('gpt-4o'),
	tools: {
		showWeather: {
			description: 'Display current weather for a city',
			parameters: z.object({ city: z.string() }),
			execute: async ({ city }) => fetchWeather(city),
		},
	},
	prompt: "What's the weather in Tokyo?",
});

// When the AI calls showWeather, render your component
if (result.toolName === 'showWeather') {
	return <WeatherCard data={result.toolResult} />;
}
```

The user asked a plain-language question. The AI understood that a `WeatherCard` — not a text reply — is the right response. You didn't write conditional logic for this; the model did.

This is the key difference from traditional development: the AI composes the interface contextually rather than you encoding every possible state in advance. You build the components. The AI decides when to show them.

**Business logic lives in your tools, not in the model.** The model decides which tool to call and with what arguments. Your tool's `execute` function handles the real work: database queries, auth checks, pricing rules, validation. The model is a router. Your tools are the actual system.

### The control spectrum

Not all generative UI is the same. There are roughly three flavors:

- **Static GenUI** — the AI picks from a predefined set of components and fills them with data. You control exactly what can render. Safest option, most popular in production.
- **Declarative GenUI** — the AI returns a structured UI spec (like [Google's A2UI format](https://developers.googleblog.com/introducing-a2ui-an-open-project-for-agent-driven-interfaces/)), and the client renders it within your design constraints.
- **Open-ended GenUI** — the AI generates full HTML or code, run in a sandboxed iframe. Maximum flexibility, maximum risk.

Most production systems use static or declarative patterns. If you're just starting, static is where to begin.

**The honest tradeoff:** non-determinism. The same input can produce different UI each run. That's usually fine for conversational interfaces, but it introduces a failure mode that doesn't exist in normal code.

Standard errors — tool throws, API times out, schema validation fails — are handled like any async failure. The trickier case is when the model picks the wrong tool entirely. No crash. No error thrown. Just incorrect UI rendered. That's a cognitive failure, and it's invisible without testing.

Guardrails that help in practice:

- **Write specific tool descriptions.** The model uses these to decide which tool fits the situation. "Show weather" is ambiguous. "Display current temperature and conditions for a city when the user asks about weather, packing, or travel planning" is not.
- **Use strict schemas.** Loose schemas (`z.object({})`) leave too much room. Constrain inputs explicitly.
- **Only expose tools relevant to the current context.** If 15 tools are registered but only 2 make sense for a given screen, filter the rest out. More options means more chances to pick the wrong one.
- **Add a confirmation step for destructive or expensive actions.** Payments, deletions, sends — render a confirmation component instead of executing automatically.

**Reach for generative UI when:**

- You're building an AI chat or assistant feature
- The interface needs to respond to open-ended user requests
- You want the AI to pick the right component for the context

> **Heads up on older content:** Vercel's AI SDK previously had an RSC-based approach using `streamUI()` and `createStreamableUI()`. That path is currently paused. If you find tutorials using those APIs, they're outdated. The current recommended approach uses `useChat()` with tool parts, as shown above.

---

## At a glance

|                        | Server-Driven UI                   | Generative UI                    |
| ---------------------- | ---------------------------------- | -------------------------------- |
| **Who decides layout** | Backend server                     | AI model                         |
| **Deterministic?**     | Yes — same response, same UI       | No — varies by inference         |
| **Best for**           | High-churn surfaces, mobile apps   | AI chat, agent-driven interfaces |
| **Main benefit**       | Ship without deploying client code | Contextual, adaptive interfaces  |
| **Main risk**          | Backend/frontend coupling          | Non-determinism, hallucinations  |

---

## Tooling to know

### For Generative UI

- **[Vercel AI SDK](https://sdk.vercel.ai/docs/ai-sdk-ui/generative-user-interfaces)** — `useChat()` + tool definitions. Start here. Works with any LLM provider and is framework-agnostic. Now on v6.
- **[CopilotKit](https://docs.copilotkit.ai/generative-ui)** — More opinionated framework for adding AI features to existing React apps. Supports all three patterns (static, declarative, open-ended) and the [AG-UI protocol](https://www.copilotkit.ai/ag-ui-and-a2ui) adopted by Google, LangChain, and AWS.
- **[assistant-ui](https://www.assistant-ui.com/)** — Composable chat UI components (shadcn/ui-style). Handles the UI layer so you can focus on tools. YC-backed, 50k+ weekly npm downloads.
- **[Hashbrown](https://hashbrown.dev/)** — You register React components with schemas, and the LLM generates the entire component tree with streamed props. Good option if you want the model to have more layout control.
- **[Tambo](https://github.com/tambo-ai/tambo)** — Open-source. Register components with Zod prop schemas that automatically become LLM tool definitions. Minimal setup.

### For Server-Driven UI

SDUI is more pattern than library. Most teams build their own renderer, but if you want to explore without starting from scratch:

- **[NativeBlocks](https://nativeblocks.io/)** — SDUI platform with a visual editor and React client.
- **[DivKit](https://divkit.tech/)** — Yandex's open-source cross-platform SDUI framework. Production-tested at scale.

---

## Where they're heading

These two patterns are converging. In December 2025, Google released [A2UI](https://developers.googleblog.com/introducing-a2ui-an-open-project-for-agent-driven-interfaces/) — a protocol where an AI agent selects components from a pre-approved catalog. Structurally, it's identical to an SDUI component registry, but an LLM does the composition instead of a server config. The client still controls what components exist. The AI just decides which ones to use.

That's the direction the industry is moving: a stable component library (SDUI's strength) + AI-driven composition (Generative UI's strength). [CopilotKit already supports this pattern](https://www.copilotkit.ai/ag-ui-and-a2ui) through their AG-UI protocol.

---

## Which one to start with

**Working on an AI feature** — chat, smart search, an assistant of any kind? Start with Generative UI. The [Vercel AI SDK generative UI guide](https://sdk.vercel.ai/docs/ai-sdk-ui/generative-user-interfaces) walks through the tool-calling pattern with working code. The [Vercel Academy tutorial](https://vercel.com/academy/ai-sdk/multi-step-and-generative-ui) is a good hands-on complement.

**Working on a mobile app or a surface that changes constantly?** Start with SDUI. [Airbnb's Ghost Platform writeup](https://medium.com/airbnb-engineering/a-deep-dive-into-airbnbs-server-driven-ui-system-842244c5f5) is the canonical reference. [Apollo GraphQL's three-part SDUI guide](https://www.apollographql.com/blog/server-driven-ui-with-graphql) covers schema design patterns if you're using GraphQL.

Neither requires an all-in architectural commitment. Start with one surface, prove the value, and expand from there.

---

## Go deeper

### Generative UI

- **[Vercel AI SDK — Generative UI](https://sdk.vercel.ai/docs/ai-sdk-ui/generative-user-interfaces)** — Official docs for the tool-calling + component rendering pattern.
- **[CopilotKit — The three kinds of Generative UI](https://www.copilotkit.ai/blog/the-three-kinds-of-generative-ui)** — The clearest taxonomy of static, declarative, and open-ended GenUI patterns.
- **[Google Research — Generative UI](https://research.google/blog/generative-ui-a-rich-custom-visual-interactive-user-experience-for-any-prompt/)** — The academic treatment from Google's November 2025 paper.
- **[A2UI on GitHub](https://github.com/google/A2UI)** — Google's open protocol for agent-driven interfaces. Worth watching.
- **[bracesproul/gen-ui](https://github.com/bracesproul/gen-ui)** — Starter template: Next.js + LangChain + shadcn/ui. Good reference codebase.

### Server-Driven UI

- **[Airbnb — A Deep Dive into Server-Driven UI](https://medium.com/airbnb-engineering/a-deep-dive-into-airbnbs-server-driven-ui-system-842244c5f5)** — The canonical engineering writeup. Start here.
- **[Uber — The ActionCard Design Pattern](https://www.uber.com/blog/developing-the-actioncard-design-pattern/)** — How Uber achieved 10x feature velocity with SDUI.
- **[Lyft — The Journey to Server-Driven UI](https://eng.lyft.com/the-journey-to-server-driven-ui-at-lyft-bikes-and-scooters-c19264a0378e)** — 1-2 day experiment cycles vs 2+ weeks. Practical lessons.
- **[Yelp — CHAOS Framework](https://engineeringblog.yelp.com/2024/03/chaos-yelps-unified-framework-for-server-driven-ui.html)** — Yelp's unified SDUI system spanning 8 clients.
- **[Netflix SDUI at Scale (InfoQ, 2024)](https://www.infoq.com/news/2024/07/netflix-server-driven-ui/)** — Netflix's approach and where they chose not to use it.
- **[DZone — Server-Driven UI: Agile Interfaces Without App Releases](https://dzone.com/articles/server-driven-ui-agile-interfaces-without-app-releases)** — Solid overview including AI-powered directions.
- **[Frontend Happy Hour — SDUI Episode](https://www.frontendhappyhour.com/episodes/server-driven-ui-served-from-behind-the-bar)** — Netflix, Twitch, and Atlassian engineers discuss real-world tradeoffs.
