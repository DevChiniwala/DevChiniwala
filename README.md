<!--
  DevChiniwala / DevChiniwala
  AI systems portfolio · cyan on near-black
-->

<div align="center">

<a href="https://github.com/DevChiniwala">
  <img src="./assets/hero-v2.svg" alt="Dev Chiniwala — Applied AI Engineer and AI Systems Builder" width="100%"/>
</a>

<br/>

<a href="https://www.linkedin.com/in/dev-chiniwala/"><code>LinkedIn</code></a>&nbsp;·&nbsp;<a href="https://x.com/DevChiniwala"><code>X / Twitter</code></a>&nbsp;·&nbsp;<a href="mailto:dev.chiniwala@gmail.com"><code>Email</code></a>&nbsp;·&nbsp;<a href="https://github.com/DevChiniwala?tab=repositories"><code>Repositories</code></a>

</div>
<img src="./assets/divider.svg" alt="" width="100%"/>

## 01 / Flagship systems

I build across three connected engineering problems: operating AI agents in production, preserving knowledge as facts change, and grounding automated decisions in evidence.

### 01 — ControlSurface / Agent reliability

`RELEASE CANDIDATE` `APACHE-2.0` `SELF-HOSTED`

<a href="https://github.com/DevChiniwala/ControlSurface">
  <img src="./assets/card-controlsurface.svg" alt="ControlSurface — production engineering and reliability for AI agents" width="100%"/>
</a>

**Production failures should become reusable engineering evidence.**

- **Agent-aware observability:** AgentRunGraph derives agent, model, tool, retrieval, retry, branch, and outcome structure from source traces.
- **Failure intelligence:** recurring failures become representative, editable, human-reviewed regression cases.
- **Release decisions:** versioned change records and content-hashed evaluation evidence support deterministic release gates.

[Repository](https://github.com/DevChiniwala/ControlSurface) · [Architecture](https://github.com/DevChiniwala/ControlSurface/blob/main/ARCHITECTURE.md) · [v0.1.0-rc.1](https://github.com/DevChiniwala/ControlSurface/releases/tag/v0.1.0-rc.1)

`Python` `OpenTelemetry` `PostgreSQL` `ClickHouse` `Next.js` `Docker Compose`

<br/>

### 02 — MNEMOS / Temporal memory

`BETA` `RESEARCH` `MIT`

<a href="https://github.com/DevChiniwala/MNEMOS">
  <img src="./assets/card-mnemos.svg" alt="MNEMOS — self-editing bi-temporal memory for AI agents" width="100%"/>
</a>

**Agent memory should know when a fact was true, when it changed, and where it came from.**

- **Self-editing state:** incoming facts resolve through `ADD`, `UPDATE`, `DELETE`, or `NOOP` while preserving version history.
- **Six-signal retrieval:** sparse, dense, graph, temporal, cognitive, and consolidation signals are combined for robust recall.
- **Bounded context:** token-aware packing, deduplication, graph provenance, decay, and sleep consolidation keep memory useful over time.

[Repository](https://github.com/DevChiniwala/MNEMOS) · [Package metadata](https://github.com/DevChiniwala/MNEMOS/blob/main/pyproject.toml) · [Documentation](https://github.com/DevChiniwala/MNEMOS/tree/main/docs)

`Python` `MCP` `FastAPI` `Neo4j` `FAISS` `RAGAS`

<br/>

### 03 — CortexOS / Verified intelligence

`PUBLIC APPLICATION` `APACHE-2.0` `LOCAL-FIRST`

<a href="https://github.com/DevChiniwala/CortexOS">
  <img src="./assets/card-cortexos-v2.svg" alt="CortexOS — evidence-backed company intelligence workflows" width="100%"/>
</a>

**AI-generated intelligence is more useful when every important claim can be inspected.**

- **Multi-agent research:** specialized workflows gather company, market, and account signals from multiple sources.
- **Source-backed verification:** a deterministic Rust pipeline compares extracted claims against source material and records confidence.
- **Local application:** the Tauri desktop runtime combines a React interface, Rust services, and embedded SQLite storage.

[Repository](https://github.com/DevChiniwala/CortexOS) · [Frontend manifest](https://github.com/DevChiniwala/CortexOS/blob/main/package.json) · [Rust core](https://github.com/DevChiniwala/CortexOS/blob/main/src-tauri/Cargo.toml)

`React` `TypeScript` `Tauri` `Rust` `Tokio` `SQLite`

<img src="./assets/divider.svg" alt="" width="100%"/>

## 02 / Applied systems

### 04 — VYGOT / Adaptive learning

`PRIVATE TEAM PROJECT` `PUBLIC LAUNCH UPCOMING`

<img src="./assets/card-vygot.svg" alt="VYGOT — private adaptive learning intelligence project with a public launch upcoming" width="100%"/>

VYGOT is a private team project exploring personalized learning intelligence: adapting instructional strategy to how each learner learns. Product and implementation details remain intentionally limited ahead of its public launch.

<br/>

### 05 — HeyClara / Always-on personal agent

`PUBLIC PACKAGE` `MIT` `v0.4.4`

<a href="https://github.com/DevChiniwala/HeyClara">
  <img src="./assets/card-heyclara-v2.svg" alt="HeyClara — always-on personal AI assistant daemon" width="100%"/>
</a>

**A personal agent should keep working between chat sessions.**

- Scheduled jobs run with persistent workspaces, model routing, audit records, and agent-specific personas.
- Two-stage memory consolidates repeated signals before promoting them into durable memory and rules.
- A shared MCP tool server supports Telegram, Slack, voice, SMS, and harness failover.

[Repository](https://github.com/DevChiniwala/HeyClara) · [npm package](https://www.npmjs.com/package/@devchiniwala/heyclara) · [Documentation](https://github.com/DevChiniwala/HeyClara/tree/main/docs)

`Bun` `TypeScript` `Claude Agent SDK` `MCP` `PostgreSQL` `Zod`

<img src="./assets/divider.svg" alt="" width="100%"/>

## 03 / Portfolio map

<img src="./assets/portfolio-map.svg" alt="Portfolio map: ControlSurface operates agents, MNEMOS preserves memory, CortexOS verifies intelligence, and VYGOT and HeyClara apply AI to user workflows" width="100%"/>

- **Operate:** ControlSurface turns production traces and failures into reliability work.
- **Remember:** MNEMOS models changing knowledge, provenance, retrieval, and consolidation.
- **Verify:** CortexOS attaches source evidence to automated intelligence workflows.
- **Apply:** VYGOT and HeyClara bring adaptive AI into ongoing user workflows.

These are separate systems in one engineering portfolio; the map describes their focus rather than implying a shared runtime.

<img src="./assets/divider.svg" alt="" width="100%"/>

## 04 / Open-source engineering

Alongside my own systems, I have contributed **70+ merged pull requests** across AI infrastructure, developer tooling, retrieval systems, data platforms, and cross-platform reliability.

- [Reticle #1286](https://github.com/reticlehq/reticle/pull/1286) — preserved declared network URLs through browser action replay.
- [ChunkHound #419](https://github.com/chunkhound/chunkhound/pull/419) — replaced embedding full-table scans with targeted SQL.
- [HelixDB #1164](https://github.com/HelixDB/helix-db/pull/1164) — validated signed 64-bit values across generated SDKs.
- [DataMind #21](https://github.com/OpenDCAI/DataMind/pull/21) — redacted secrets from audit errors.

[Browse all merged contributions →](https://github.com/search?q=is%3Apr+author%3ADevChiniwala+is%3Amerged&type=pullrequests)

<img src="./assets/divider.svg" alt="" width="100%"/>

## 05 / AI systems stack

<img src="./assets/stack-v2.svg" alt="AI systems stack organized by core languages, agent systems, memory and data, and reliability and delivery" width="100%"/>

| Area | Current toolkit |
|---|---|
| **Core** | Python · TypeScript · Rust · SQL |
| **Agents & AI** | Claude Agent SDK · MCP · OpenAI · Gemini · RAG · evaluation |
| **Memory & data** | Hybrid retrieval · BM25 · knowledge graphs · PostgreSQL · ClickHouse · Neo4j · SQLite |
| **Reliability & delivery** | FastAPI · OpenTelemetry · Docker Compose · GitHub Actions · Playwright · pytest · React · Next.js · Tauri · Bun |

<img src="./assets/divider.svg" alt="" width="100%"/>

## 06 / Engineering principles

```text
01  Production failures should become regression tests.
02  Memory should model change, provenance, and validity.
03  AI decisions should carry evidence and operational boundaries.
```

<img src="./assets/divider.svg" alt="" width="100%"/>

## 07 / Activity

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/DevChiniwala/DevChiniwala/output/github-snake-dark.svg"/>
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/DevChiniwala/DevChiniwala/output/github-snake.svg"/>
  <img alt="Dev Chiniwala contribution activity" src="https://raw.githubusercontent.com/DevChiniwala/DevChiniwala/output/github-snake-dark.svg" width="100%"/>
</picture>

<img src="./assets/divider.svg" alt="" width="100%"/>

## 08 / Connect

<div align="center">

Building reliable agents, temporal memory systems, and evidence-backed AI products.

```bash
npx devcard0707
```

<a href="https://www.linkedin.com/in/dev-chiniwala/"><code>LinkedIn</code></a>&nbsp;·&nbsp;<a href="https://x.com/DevChiniwala"><code>X / Twitter</code></a>&nbsp;·&nbsp;<a href="mailto:dev.chiniwala@gmail.com"><code>Email</code></a>&nbsp;·&nbsp;<a href="https://github.com/DevChiniwala"><code>GitHub</code></a>

</div>
<!-- end profile -->
