@AGENTS.md

# Seazone Guest Guide — AI Builder Challenge

> Personalized digital guidebook for Seazone short-term rentals. Each property
> (e.g. `/FLN001`) gets a unique URL with property data, AI-generated local
> experiences guide, and a context-aware chat assistant.

## Context

Built as a technical challenge for Seazone's AI Builder position. The
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
- Generated guides cached in DB (per challenge requirement)
- Temperature: 0.4 for guide generation, 0.2 for chat

## Workflow

- Branches: `feat/<name>`, `fix/<name>`, `test/<name>`, `docs/<name>`
- Commits: Conventional Commits, imperative present, ≤72 char subject
- Every Claude Code commit includes `Co-Authored-By: Claude`
- PRs via `gh pr create` even when solo; preview URL in description
- Squash merge + delete branch

## Testing Strategy

Focus on high-leverage tests:

1. `property.service.test.ts` — findByCode, normalization, 404 path
2. `guide.service.test.ts` — cache hit/miss with mocked AI
3. `schemas.test.ts` — Zod validates expected shapes
4. `prompts/guide-generator.test.ts` — context injection (city, neighborhood, month)
5. `api/chat/route.test.ts` — returns 404 for invalid propertyCode

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

## How AI Was Used

[FILL IN AS DEVELOPMENT PROGRESSES]

- Architecture and stack discussed with Claude before implementation
- Scaffolding generated via Claude Code
- System prompts iteratively refined using the prompt-tester skill
- All commits co-authored with Claude (visible in git history)
- Decisions documented inline in this file as encountered

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
