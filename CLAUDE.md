@AGENTS.md

# Seazone Guest Guide

> Personalized digital guidebook for Seazone short-term rentals. Each property
> (e.g. `/FLN001`) gets a unique URL with property data, AI-generated local
> experiences guide, and a context-aware chat assistant.

## Context

Personalized digital guidebook for Seazone short-term rentals. The
current Seazone guidebook (https://guia-do-hospede.seazone.com.br) is generic
and identical across all properties. This project demonstrates a personalized
alternative where each property has tailored data + AI-generated local content.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript strict + React 19
- **Styling**: Tailwind CSS v4 + shadcn/ui (Radix, Nova preset: Lucide + Geist)
- **Database**: PostgreSQL via Neon (serverless)
- **ORM**: Prisma 7
- **AI SDK**: Vercel AI SDK (`ai` + `@ai-sdk/anthropic`)
- **Model**: Claude Sonnet 4.6 (`claude-sonnet-4-6`)
- **Testing**: Vitest + Testing Library + jsdom
- **Deployment**: Vercel with preview deployments per PR

> Note: Next.js 16 has breaking changes from older versions. See AGENTS.md
> (auto-included above) and consult node_modules/next/dist/docs/ for current
> APIs before assuming behavior.

> Note: Prisma 7 generates the client into `app/generated/prisma` (configured
> via the schema's `generator` block), **not** into `node_modules/@prisma/client`.
> That directory is gitignored, so it must be regenerated after every install —
> the `postinstall: prisma generate` script handles this on Vercel and any fresh
> clone. Without it, deploy builds fail on the `@/app/generated/prisma/client`
> import. Prisma 7 also requires a driver adapter at runtime (`@prisma/adapter-pg`,
> see `lib/db.ts`) and reads the seed command from `prisma.config.ts`
> (`migrations.seed`), not from `package.json`.

## Architecture

The project follows a domain-grouped "atomic-light" component organization:

- `app/[code]/page.tsx` — Server Component, fetches property by route param
- `app/api/generate-guide/route.ts` — Cached AI guide generation
- `app/api/chat/route.ts` — Streaming chat endpoint
- `app/not-found.tsx` — Friendly 404 page
- `components/ui/` — shadcn primitives (Radix-based atoms/molecules)
- `components/property/` — PropertyHero, AccessSection, RulesSection, etc.
- `components/guide/` — ExperienceGuide, RestaurantList, etc.
- `components/chat/` — ChatWidget, ChatMessage, ChatInput
- `lib/db.ts` — Prisma client singleton
- `lib/constants.ts` — AI_MODEL, temperatures, validation regexes
- `lib/errors.ts` — Custom error classes
- `lib/types/` — Typed JSON shapes for Property fields
- `lib/ai/prompts/` — System prompts (versioned, testable)
- `lib/ai/schemas.ts` — Zod schemas (single source of truth)
- `lib/services/` — Business logic (property, guide)

## Stack Rationale

- **Next.js 16 (App Router)**: React Server Components reduce client JS for
  static-heavy pages; built-in routing + SSR + streaming primitives cover all
  needs. Chosen over plain React + Vite for native SSR. Chosen over Remix for
  a stronger Vercel deployment story and AI SDK alignment.
- **TypeScript strict**: catches errors at compile time, makes Prisma generated
  types + AI SDK Zod schemas first-class. No reason to skip in a
  production-track project.
- **Tailwind v4 + shadcn/ui**: utility-first CSS keeps styles co-located with
  markup, faster iteration than CSS modules. shadcn/ui copies primitives into
  the repo (not a runtime dependency), giving full ownership without vendor
  lock-in.
- **Prisma 7 + PostgreSQL (Neon)**: type-safe queries match the TS-first
  philosophy. Postgres handles JSON columns well (used for nested property
  data). Neon's serverless free tier eliminates infra setup. Chosen over
  Drizzle for migration tooling maturity. Chosen over MongoDB because the data
  is inherently relational.
- **Vercel AI SDK v6**: provider-agnostic abstraction over LLMs. Built-in
  streaming, structured output via Zod, React hooks for chat UI. Chosen over
  the raw Anthropic SDK for the streaming UI integration. Chosen over LangChain
  for being lighter and more idiomatic to Next.js.
- **Claude Sonnet 4.6**: best PT-BR fluency among current LLMs, strong
  instruction-following (critical for anti-hallucination), integrates with the
  Claude Code workflow. The AI SDK abstraction makes the provider swappable if
  needed.
- **Vitest + Testing Library**: faster than Jest, native ESM support, less
  config. Testing Library encourages testing user-visible behavior, not
  implementation details.
- **Vercel (deploy)**: zero-config Next.js deployment, automatic preview
  deployments per PR, edge network globally. Chosen over self-hosted because
  time-to-deploy matters and Vercel + Neon together are ~2 minutes of setup.
- **Google Places API (optional, RAG)**: verified venue data for grounding the
  AI. Considered Foursquare (less reliable in Brazil), OpenStreetMap (less rich
  data), Yelp (limited Brazil coverage). Places offers the best
  quality-to-effort ratio for Brazilian venues.

## Data Flow

1. GET /[code] → Server Component fetches Property via service
2. Invalid code → notFound() → friendly 404
3. Property page renders static data immediately
4. Suspense boundary wraps ExperienceGuide (client component)
5. Guide component calls POST /api/generate-guide → cache or generate
6. ChatWidget calls POST /api/chat → server injects context → SSE stream

## Code Conventions

- TypeScript strict, no `any`, no `// @ts-ignore`
- Server Components by default; `"use client"` only when interactivity required
- Absolute imports via `@/*` alias
- PascalCase components/types, camelCase functions/vars, SCREAMING_SNAKE constants
- Typed custom errors in `lib/errors.ts`
- Comments explain *why*, not *what*

## AI Integration Principles

- Structured outputs via `generateObject` + Zod schemas
- Prompts as code in `lib/ai/prompts/` — versioned, testable
- Chat has strict anti-hallucination rule with explicit fallback message
- Generated guides cached in DB to avoid regeneration on revisit
- Temperature: 0.4 for guide generation, 0.2 for chat

## Hallucination Mitigation Strategy

AI guide generation supports two modes:

1. **RAG mode (recommended)**: When `GOOGLE_PLACES_API_KEY` is set, the system
   fetches real venues from Google Places API before LLM invocation. The LLM
   selects from real data only. Validated: 100% real venues.

2. **Fallback mode**: When the key is absent or Places API fails, the system
   falls back to LLM parametric knowledge with strengthened anti-hallucination
   prompts. Validated accuracy: ~75-85%.

Production deployments should set the Places API key. The fallback exists for
resilience and local development without billing setup.

The Vercel deployment runs in RAG mode. The 4 sample property guides were
regenerated post-activation and verified against the live Google Places
dataset — all venues are real and locatable on Google Maps.

## Workflow

- Branches: `feat/<name>`, `fix/<name>`, `test/<name>`, `docs/<name>`
- Commits: Conventional Commits, imperative present, ≤72 char subject
- Every Claude Code commit includes `Co-Authored-By: Claude`
- PRs via `gh pr create` even when solo; preview URL in description
- Squash merge + delete branch

## Testing Strategy

Focus on high-leverage tests over coverage targets. 42 tests (Vitest), covering
the critical non-UI layers:

1. `__tests__/services/property.service.test.ts` — findByCode normalization, validation, null path
2. `__tests__/services/guide.service.test.ts` — cache-aside (hit/miss, cached-schema revalidation, error) with mocked Prisma + AI SDK
3. `__tests__/ai/schemas.test.ts` — ExperienceGuideSchema bounds, enums, required fields
4. `__tests__/ai/prompts.test.ts` — guide + chat system prompts (context injection, grounding, anti-hallucination rule)
5. `__tests__/lib/maps.test.ts` — Maps URL building + parseDistanceKm (PT-BR comma decimals)

Shared fixtures live in `__tests__/fixtures/property.ts`.

Future work (not yet covered): API route handlers (status mapping) and React
component behavior would be the next highest-value additions.

## Out of Scope (intentional)

- Authentication / multi-tenancy
- Real-time updates / websockets
- Internationalization (PT-BR only)
- Booking flow

## Trade-offs

| Decision | Chose | Reason |
|----------|-------|--------|
| Database | Postgres (Neon) | Vercel filesystem ephemeral; spec mentions Postgres |
| AI SDK | Vercel AI SDK | Streaming abstraction saves significant time |
| Design system | Atomic-light (domain-grouped) | Scope doesn't justify strict 5-layer Atomic |
| Deployment | Vercel | Per-PR previews align with PR workflow |

### Accessibility note

Primary CTA contrast (white text on #FF6B5C coral) measures ~2.5:1, below
WCAG AA (4.5:1). This combination is brand-accurate — matches the official
Seazone guidebook design. A production-ready iteration would either:
(a) propose navy-on-coral text variants to the design team, or (b) add ARIA
labels + larger font sizes (3:1 threshold for large text). Documented as a
known accessibility consideration rather than an oversight.

## How AI Was Used

### Files that guide AI collaboration

- `CLAUDE.md` — project source of truth, read on every Claude Code session
- `AGENTS.md` — version-specific guardrails for Next 16
- `docs/PLANNING.md` — system prompts, chat invariants, edge cases
- `.claude/skills/prompt-tester` — chat invariants reference and prompt refining protocol
- `.claude/commands/` — slash commands `/commit` and `/new-feature`

### Iteration patterns

- **Plan mode before code**: every feature began with Claude Code proposing an
  inline plan with deviations + justifications, approved or revised before
  writing code
- **Atomic commits per logical milestone**: one PR per phase, multiple commits
  inside, squash-merged
- **Continuous validation against external sources**: AI-generated venues
  checked against Google Places API
- **Self-flagged honesty**: Claude Code transparently surfaced its own slips

### Where AI struggled (and how we mitigated)

(a) **Hallucination in small markets**: parametric LLM knowledge invented
    plausible-sounding venue names ("Gasthof Gramado", "Birosca do Zé", "Barraca
    do Coco" attributed to wrong cities). Mitigations: strengthened system
    prompt with concrete bad examples + lowered schema minimums + RAG
    architecture with Google Places API (optional, with prompt-only fallback).
    See PR #7 for the iteration journey.

(b) **Unfounded service inferences**: chat initially assumed amenities
    (portaria, recepção) not in property data. Fixed with an explicit "do not
    assume services not in data" rule.

(c) **Loose venue citation in chat**: chat occasionally paraphrased guide venue
    names. Fixed with a strict citation rule referencing the guide block.

### Productivity observations

Gains:

- Boilerplate (Zod schemas, Prisma client setup, UI components)
- Environment-specific gotchas caught early (Prisma 7 driver adapter, AI SDK v6
  `maxOutputTokens`, Next 16 `params` Promise)
- Self-correction loops (verification scripts, false-positive flagging)
- Documentation kept in sync with code via dedicated CLAUDE.md and PLANNING.md

Where human judgment mattered:

- **Strategic pivots**: switching from prompt-only iteration to RAG when prompt
  engineering hit a ceiling
- **Trade-off decisions**: static prerendering vs ISR, prompt-only fallback vs
  blocking on Places API setup
- **Anti-hallucination validation**: sampling AI guide outputs against Google
  Maps (AI cannot browse the web)
- **Visual identity**: applying the Seazone brand palette without breaking
  accessibility semantics

## Running Locally

Copy .env.example to .env.local and fill DATABASE_URL and ANTHROPIC_API_KEY.
Then run: npm install, npx prisma migrate dev, npx prisma db seed, npm run dev.

Test routes:
- http://localhost:3000/FLN001 — Florianópolis (verbatim from spec)
- http://localhost:3000/GRM001 — Gramado (verbatim from spec)
- http://localhost:3000/SP001 — São Paulo (invented, pet-friendly)
- http://localhost:3000/SAL001 — Salvador (invented, beach house)
- http://localhost:3000/INVALID — 404 page

## Scripts

- `npm run dev` — Next.js dev server
- `npm run build` — production build
- `npm test` — Vitest
- `npm run typecheck` — TypeScript check
- `npm run db:reset` — drop + migrate + seed
