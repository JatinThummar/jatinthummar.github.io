---
title: 'How AI Coding Agents Actually Work (And How to Build One Yourself)'
description: 'A plain-English breakdown of the agentic loop, the pattern behind every AI coding tool from Claude Code to Cursor. Plus the best resources to learn agents as a TypeScript developer.'
publishDate: 2026-04-02
tags: ['ai', 'typescript', 'agents', 'learning-path']
---

You open Claude Code, type "add dark mode to my app," and watch it read your files, edit your components, run your tests, fix a failing assertion, and commit the result. It looks like magic.

It isn't. Under the hood, every AI coding agent runs the same simple pattern. Once you see it, you can't unsee it. And once you understand it, you can build one yourself.

---

## The agentic loop: five steps, that's it

Strip away every framework, every buzzword, every abstraction layer. Here's what actually happens inside every AI coding agent:

1. **You send a message** to a large language model (LLM), along with a list of tools it can use. These tools are just JSON descriptions of functions: read a file, run a shell command, search code, edit a file.
2. **The model responds** with either a plain text answer or a structured request to use one of those tools. This request includes the tool name and the arguments it wants to pass.
3. **Your code runs the tool locally.** The model never executes anything. Your application calls `fs.readFile` or `child_process.exec` or whatever the tool requires, on your machine.
4. **You send the result back** to the model as a new message in the conversation.
5. **Repeat** until the model responds with final text instead of another tool request.

That's the whole thing. The model thinks, asks your code to do something, gets the result, thinks again. Over and over until the job is done.

Anthropic's engineering team put it simply: "Agents are typically just LLMs using tools based on environmental feedback in a loop." ([source](https://www.anthropic.com/research/building-effective-agents)) The difference between a chatbot and a coding agent is just the set of tools and the permission to keep looping.

### A quick note on terminology

"Tool use" (Anthropic's term) and "function calling" (OpenAI's term) mean the same thing. The model outputs structured data asking your code to do something, instead of outputting plain text. When people say "coding tools" in agent contexts, they mean specific things: file read/write, shell execution, code search, git operations, and LSP integration. These are the tools that let an agent actually interact with a software project.

---

## Why this matters more than any specific product

Claude Code, Cursor, GitHub Copilot agent mode, Windsurf: they all run this same loop. The tools differ. The prompts differ. The permission models differ. But the architecture is identical.

That means learning the pattern once transfers everywhere. You're not learning "how to use Claude Code." You're learning how AI coding agents work, period.

---

## The best resources to learn this, in order

There's a lot of material out there. Most of it is mediocre. Here's what's actually worth your time, organized as a learning path from concepts to code.

### Step 1: Understand the concepts

**[Building Effective Agents](https://www.anthropic.com/research/building-effective-agents)** by Anthropic is the single most referenced resource in this space. Written by Erik Schluntz and Barry Zhang, it draws a crucial line between **workflows** (predetermined sequences of tool calls) and **agents** (where the model decides what to do next dynamically). It defines five composable patterns: prompt chaining, routing, parallelization, orchestrator-workers, and evaluator-optimizer. The key insight: start with the simplest pattern that works. Don't reach for a multi-agent system when a single prompt chain will do. Companion code lives at [anthropic-cookbook/patterns/agents](https://github.com/anthropics/anthropic-cookbook/tree/main/patterns/agents).

If you read one thing on this list, make it this one.

### Step 2: See the loop with zero abstraction

**[mini-SWE-agent](https://github.com/SWE-agent/mini-swe-agent)** is roughly 100 lines of Python that scores over 74% on SWE-bench Verified, a serious coding benchmark. It uses bash as its only tool, `subprocess.run` for execution, and a completely linear message history. No frameworks. No custom abstractions. Reading this code takes 15 minutes and gives you a complete mental model of how a coding agent actually works.

It's Python, not TypeScript. That doesn't matter here. You're reading it for the pattern, not the syntax. The parent project, [SWE-agent](https://github.com/SWE-agent/SWE-agent) (~18.8k stars), is backed by Princeton and Stanford with a NeurIPS 2024 paper explaining every design decision.

### Step 3: Read a production-quality loop in one file

**[smolagents](https://github.com/huggingface/smolagents)** by Hugging Face (~26.3k stars) has its entire agent logic in about 1,000 lines. Its `CodeAgent` takes an interesting approach: instead of individual JSON tool calls, the model writes Python code snippets as actions, with loops, conditionals, and function nesting. Research shows this "code as action" approach uses [30% fewer steps](https://www.decisioncrafters.com/smolagents-build-powerful-ai-agents-in-1-000-lines-of-code-with-26-3k-github-stars/) than JSON tool calling. Three lines of code gets you a working agent. Hugging Face also offers a [free agents course](https://huggingface.co/docs/smolagents/index) that walks through every concept.

### Step 4: Learn the API mechanics

Now you need to understand how tool calling actually works at the API level.

**[Anthropic's tool use documentation](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)** walks through implementation step by step. It covers client tools (your code runs them) versus server tools (Anthropic's infrastructure runs them), parallel tool use, and streaming, all with TypeScript examples. The Tool Runner SDK handles the agentic loop for you in TypeScript, Python, and Ruby.

Two additional Anthropic posts are worth reading here. **[Writing Effective Tools for Agents](https://www.anthropic.com/engineering/writing-tools-for-agents)** explains that tools are "a contract between deterministic systems and non-deterministic agents," and that poor tool design is the main reason agents fail. **[Advanced Tool Use](https://www.anthropic.com/engineering/advanced-tool-use)** introduces Programmatic Tool Calling, where the model writes code to orchestrate tools rather than making individual API round-trips.

OpenAI covers similar ground from their perspective. Their **[Practical Guide to Building Agents](https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/)** covers model selection, tool design, and orchestration patterns. They also have a structured **[Building Agents learning track](https://developers.openai.com/tracks/building-agents)** that progresses from core concepts through tools to orchestration.

### Step 5: Build something in TypeScript

Four frameworks, each at a different level of abstraction:

**[Vercel AI SDK](https://github.com/vercel/ai)** (~21.7k stars, 20M+ monthly npm downloads): this is your foundation. The `generateText` and `streamText` functions expose the raw tool-calling loop. Tools are defined with Zod schemas. It's provider-agnostic, streaming-first, and designed for React/Next.js. Several other frameworks are built on top of it, so understanding it gives you transferable knowledge.

**[Mastra](https://mastra.ai/)** (~21.1k stars): batteries-included. Agents, tools, workflows, RAG pipelines, and evals in one coherent TypeScript package. Built by the team behind Gatsby.js (YC-backed), it uses Vercel AI SDK under the hood for model routing across 40+ providers. CLI scaffolding (`npm create mastra@latest`), a local playground at localhost:4111, and human-in-the-loop support via persistent suspend/resume. They also published a book, [Principles of Building AI Agents](https://www.ycombinator.com/companies/mastra).

**[OpenAI Agents SDK for TypeScript](https://github.com/openai/openai-agents-js)**: the most minimal option. Four primitives: Agents, Handoffs, Guardrails, and Tools. The handoff pattern, where agents delegate to specialized sub-agents, is particularly useful for understanding multi-agent architectures. Built-in tracing lets you see the full execution flow. Despite the name, it works with 100+ LLM providers, not just OpenAI.

**[LangChain.js / LangGraph.js](https://github.com/langchain-ai/langchainjs)** (~17.4k stars): more abstraction layers than the others, but LangGraph's approach is worth understanding. It models agents as state machines with explicit graphs: nodes are processing steps, edges are transitions, state is shared context. This is the dominant production pattern for complex agents. Study it after you've built something simpler.

### Step 6: Understand the universal tool protocol

The **[Model Context Protocol](https://modelcontextprotocol.io/specification/2025-11-25)** (MCP) is the emerging interoperability standard for how agents connect to external tools. Created by Anthropic in November 2024 and adopted by OpenAI, Google, Cursor, and dozens of other tools, it uses JSON-RPC 2.0 messages between hosts (LLM apps), clients (connectors), and servers (tool providers).

Think of it as USB-C for AI agents. Write a tool integration once, and it works across Claude, ChatGPT, VS Code, and any MCP-compatible host.

The **[TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)** (~12k stars) is the primary implementation path for TS developers.

### Step 7: Study production patterns

Once you've built your first agent, two projects teach advanced patterns better than anything else:

**[OpenHands](https://github.com/All-Hands-AI/OpenHands)** (formerly OpenDevin, ~65k+ stars): its V1 SDK introduces an event-stream abstraction where agents read a history of environment events and produce the next atomic action. Each session runs in a sandboxed Docker container with full OS capabilities and browser automation. An [academic paper](https://arxiv.org/abs/2511.03690) explains the design decisions rigorously. Python backend, React/TypeScript frontend.

**[Aider](https://github.com/Aider-AI/aider)** (~42.7k stars): teaches two patterns exceptionally well. Its repository map system uses tree-sitter to parse source files across 130+ languages and builds a graph of code definitions ranked with PageRank. It's the most sophisticated context management in any open-source agent. Its edit format system shows how different LLMs work better with different strategies for communicating code changes (diffs, whole files, search/replace blocks). The [blog posts explaining repo mapping](https://aider.chat/2023/10/22/repomap.html) are excellent.

---

## The open-source coding agent landscape

Beyond the learning-focused projects above, there's a growing ecosystem of coding agents you can actually use day to day. Each one runs the same agentic loop, but they make different tradeoffs in design, language, and extensibility.

### Terminal-based coding agents

**[OpenAI Codex CLI](https://github.com/openai/codex)** (~72k stars): OpenAI's official lightweight coding agent that runs in your terminal. Built almost entirely in Rust for speed, it can read, modify, and execute code on your machine. If you want to see how OpenAI thinks about the agentic loop from the CLI side, this is the reference implementation.

**[Goose](https://github.com/block/goose)** (~34k stars): an extensible coding agent from Block (the company behind Square and Cash App). Also built in Rust, with both CLI and Electron desktop interfaces. What makes Goose interesting is its architecture: it uses the Model Context Protocol for extensibility, so you can plug in new capabilities without touching the core agent. It reads and writes files, runs commands, installs dependencies, and handles error refinement autonomously.

**[OpenCode](https://github.com/opencode-ai/opencode)** (~12k stars): a terminal coding agent built in Go with an interactive TUI (using Bubble Tea). It ships with two built-in agents: "build" for development tasks and "plan" for read-only analysis. Supports multiple providers out of the box: OpenAI, Anthropic, Google Gemini, AWS Bedrock, and more. Good example of how to build a polished terminal experience around the agentic loop.

### IDE-integrated agents

**[Continue.dev](https://github.com/continuedev/continue)** (~31.4k stars): the most relevant project for TypeScript developers who want to understand IDE integration. The entire monorepo is TypeScript: core logic, React GUI, VS Code extension, JetBrains plugin, and CLI. It shows how to bridge AI agents with code editors and build context from LSP features.

### Frameworks and SDKs

**[Google's Agent Development Kit](https://google.github.io/adk-docs)**: takes a distinctive approach with deterministic workflow agents (`SequentialAgent`, `ParallelAgent`, `LoopAgent`) alongside LLM-driven agents. TypeScript quickstart available, MCP tools supported natively.

**[Pydantic AI](https://github.com/pydantic/pydantic-ai)** (~16k stars): Python, but worth reading if you value type safety. Built by the Pydantic team (whose library underpins OpenAI's SDK, Anthropic's SDK, and LangChain), it has a "FastAPI feeling" with injected dependencies, graph-based flows, and structured streaming. The type-hint-driven design will feel familiar to TypeScript developers.

**[CrewAI](https://github.com/crewAIInc/crewAI)** (~44.5k stars): best for understanding multi-agent orchestration. You define teams of agents with roles like "Researcher" and "Writer," assign tasks, and choose execution strategies (sequential, hierarchical, parallel). Over 60% of Fortune 500 companies use it.

### Closed-source, but worth understanding

**Claude Code** itself isn't open source, but its architecture is [extensively documented](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk). Built on Bun using React with Ink for terminal rendering, it has roughly 40 tools, multi-agent orchestration with sub-agent spawning, and a persistent memory system via CLAUDE.md files. Its internal pattern is the same agentic loop: gather context, take action, verify work, repeat.

---

## What actually makes agents good

The loop itself is simple. What separates a toy agent from a useful one is everything built around it:

**Context management**: how does the agent understand your codebase? Aider's approach (parsing code with tree-sitter, ranking definitions with PageRank) is the state of the art. Without good context, the model hallucinates about code that doesn't exist.

**Tool design**: Anthropic's research shows that poorly designed tools are the primary cause of agent failures. Clear names, precise descriptions, constrained parameters. The tool definition is a contract between your deterministic code and a non-deterministic model.

**Verification**: good agents don't trust their own output. They run tests, check linter output, and sometimes use a second LLM call to judge whether the result looks right. Claude Code's pattern is lint-then-judge.

**Orchestration**: for complex tasks, a single agent loop isn't enough. Sub-agent spawning (delegating subtasks to focused agents), handoffs (transferring control between specialized agents), and parallel execution all become necessary. The OpenAI Agents SDK's handoff pattern and OpenHands' event-stream model are two clean implementations of this.

---

## Where to start today

If you're a TypeScript developer who wants to understand AI coding agents, here's the shortest path:

1. Read [Building Effective Agents](https://www.anthropic.com/research/building-effective-agents) (30 minutes)
2. Read [mini-SWE-agent's source](https://github.com/SWE-agent/mini-swe-agent) (15 minutes)
3. Skim [smolagents' agents.py](https://github.com/huggingface/smolagents) (30 minutes)
4. Walk through [Anthropic's tool use docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview) with TypeScript examples (1 hour)
5. Build a simple agent with [Vercel AI SDK](https://github.com/vercel/ai) or [Mastra](https://mastra.ai/) (afternoon)
6. Read the [MCP spec](https://modelcontextprotocol.io/specification/2025-11-25) and build a tool server with the TypeScript SDK (afternoon)

The agentic loop is architecturally trivial. Send a message, get a tool call, execute it locally, return the result, repeat. But understanding it deeply, seeing how context management and tool design and verification and orchestration layer on top, that's what turns you from someone who uses AI coding tools into someone who understands them. And eventually, someone who builds them.
