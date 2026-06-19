# Seazone Guest Guide

Guia personalizado de hospedagem gerado por IA. Cada imóvel tem uma URL única
com dados completos, conteúdo local gerado por IA e um assistente de chat
contextual.

**Demo:** https://seazone-ai-guide.vercel.app

## Contexto

Demonstração de um guidebook digital personalizado por imóvel, com geração de
conteúdo por IA grounded em lugares reais. O guia atual da Seazone
(https://guia-do-hospede.seazone.com.br) é genérico e idêntico em todos os
imóveis. Este projeto demonstra uma alternativa personalizada onde
cada propriedade tem conteúdo único.

Imóveis de demonstração:

- **FLN001** — Florianópolis
- **GRM001** — Gramado
- **SP001** — São Paulo
- **SAL001** — Salvador

## Stack

- **Next.js 16** (App Router) + **TypeScript strict** + **React 19**
- **Tailwind v4** + **shadcn/ui**
- **Prisma 7** + **Neon Postgres**
- **Vercel AI SDK v6** + **Claude Sonnet 4.6**
- **Google Places API** opcional (RAG)
- **Vitest**
- Deploy na **Vercel**

## Funcionalidades

- URL única por imóvel com dados completos (WiFi, acesso, regras, comodidades,
  anfitrião)
- Guia local gerado por IA (restaurantes, atrações, essenciais, dica da estação)
- Assistente de chat com anti-hallucination grounding (9 invariantes
  verificadas)
- UI alinhada à identidade visual da Seazone
- Mobile-first responsivo
- 404 amigável e tratamento de edge cases

## Quickstart

1. Clonar o repositório
2. `npm install`
3. Copiar `.env.example` pra `.env.local` e preencher

### Alternativa: Postgres local via Docker

Se você preferir não criar conta no Neon, pode rodar Postgres local via Docker:

```bash
docker run -d \
  --name seazone-pg \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=seazone \
  -p 5432:5432 \
  postgres:16

# Depois, em .env.local:
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/seazone
```

Qualquer Postgres 14+ funciona — Supabase, Railway, RDS, etc.

4. `npx prisma migrate deploy`
5. `npx prisma db seed`
6. `npm run dev` — abre em http://localhost:3000

## Variáveis de Ambiente

| Variável                | Obrigatória | Descrição                                                                  |
| ----------------------- | ----------- | -------------------------------------------------------------------------- |
| `DATABASE_URL`          | Sim         | String de conexão PostgreSQL                                               |
| `ANTHROPIC_API_KEY`     | Sim         | Chave da API Anthropic para Claude                                         |
| `GOOGLE_PLACES_API_KEY` | Não         | Habilita modo RAG (lugares reais em vez de conhecimento parametric do LLM) |

## Obtendo Suas Próprias API Keys

Este projeto precisa de dois serviços externos. As chaves de produção não são
compartilhadas por segurança, mas os dois providers oferecem free tiers
suficientes para rodar localmente.

### 1. `DATABASE_URL` (PostgreSQL) — obrigatória

Caminho mais rápido: conta gratuita no Neon.

1. Cadastre-se em https://neon.tech (login com GitHub)
2. Crie um novo projeto (qualquer nome, região "AWS US East" recomendada)
3. Copie a "Connection string" (formato:
   `postgresql://user:pass@host/db?sslmode=require`)
4. Cole em `.env.local` como `DATABASE_URL`

Alternativa: qualquer Postgres 14+ (Docker local, Supabase, Railway, etc.)
funciona da mesma forma.

### 2. `ANTHROPIC_API_KEY` — obrigatória

1. Cadastre-se em https://console.anthropic.com
2. Settings → API Keys → Create Key
3. Copie a chave (começa com `sk-ant-...`)
4. Cole em `.env.local` como `ANTHROPIC_API_KEY`

Contas novas recebem $5 USD de free credit. Rodar este projeto end-to-end
(gerar os 4 guias + algumas dezenas de mensagens no chat) custa menos de
$0.50 USD no total.

**Nota sobre flexibilidade de provider:** o Vercel AI SDK abstrai o provider.
Trocar para OpenAI, Gemini ou Groq exige alterar o import do modelo em
`lib/services/guide.service.ts` e `app/api/chat/route.ts` (cerca de 2 linhas).
O Claude Sonnet 4.6 foi escolhido pela fluência em PT-BR e adesão estrita às
regras de anti-hallucination — o design dos prompts assume esse comportamento.

### 3. `GOOGLE_PLACES_API_KEY` — opcional (habilita modo RAG)

A geração do guia tem dois modos:

- **Modo RAG** (quando esta chave está configurada): lugares reais buscados via
  Google Places API antes da invocação do LLM. O LLM seleciona dos dados reais
  e escreve descrições. Validado: 100% lugares reais.
- **Modo Fallback** (quando a chave está ausente ou falha): o LLM usa
  conhecimento parametric com prompts anti-hallucination fortalecidos. Precisão
  validada: ~75-85% lugares reais em mercados menores. O chat funciona
  normalmente nos dois modos.

Nota: o deploy em https://seazone-ai-guide.vercel.app roda em **modo RAG** —
Google Places API ativa em produção. Os 4 guides cacheados foram gerados com
lugares verificados, validáveis no Google Maps (nomes, endereços e bairros
reais). O fallback continua disponível como graceful degradation para
desenvolvimento local ou caso a Places API falhe em runtime.

O projeto roda end-to-end sem esta chave. O fallback gera um warning no log mas
não causa erro.

Para habilitar modo RAG:

1. Abra o Google Cloud Console: https://console.cloud.google.com
2. Crie um projeto (ou use um existente)
3. Habilite **"Places API (New)"** — NÃO a Legacy "Places API"
4. Habilite Billing no projeto (requer cartão de crédito; $200/mês de free
   credit cobrem este projeto facilmente)
5. Credentials → Create API Key → copie
6. Cole em `.env.local` como `GOOGLE_PLACES_API_KEY`

**Verificando o setup:** após configurar `DATABASE_URL` e `ANTHROPIC_API_KEY` e
rodar `npx prisma db seed`, você deve ver "4 properties seeded" no terminal.
Acessando http://localhost:3000 deve mostrar a landing com 4 cards de imóveis.
Clicar em qualquer imóvel carrega a página e dispara a geração do guia na
primeira visita (~20-30 segundos) e cacheia visitas subsequentes.

## Arquitetura

![Arquitetura do sistema](docs/architecture.png)

Para mais detalhes sobre decisões de stack, convenções e trade-offs, veja
[CLAUDE.md](CLAUDE.md). Para system prompts e chat invariants, veja
[docs/PLANNING.md](docs/PLANNING.md). Para resultados dos testes
anti-hallucination, veja [docs/chat-verification.md](docs/chat-verification.md).

## Estrutura do Projeto

```
app/
  [code]/page.tsx       — Página do imóvel (rota dinâmica, Server Component)
  api/chat/route.ts     — Endpoint de chat com streaming (Vercel AI SDK)
  api/generate-guide/   — Endpoint de geração do guia (idempotente, com cache)
  not-found.tsx         — 404 amigável para códigos inválidos
  page.tsx              — Landing com diretório dos imóveis
components/
  property/             — Seções específicas do imóvel (Hero, QuickInfo, Access, Rules, Amenities, Contact)
  guide/                — UI do guia gerado por IA (skeleton, restaurantes, atrações, essenciais, dica da estação)
  chat/                 — Assistente de chat flutuante (FAB + Sheet/Drawer, lista de mensagens, input, chips de início)
  landing/              — PropertyCard para o diretório da landing
  ui/                   — Primitivas shadcn (Button, Card, Badge, Sheet, etc.)
lib/
  ai/prompts/           — System prompts para o gerador de guia e chat (PT-BR, anti-hallucination)
  ai/schemas.ts         — Schema Zod para output estruturado do ExperienceGuide
  services/             — property.service, guide.service, places.service (retrieval para RAG)
  types/                — Interfaces tipadas de property e respostas de IA
  constants.ts          — Modelo de IA, temperaturas, limites, regex
  errors.ts             — Erros de domínio tipados (PropertyNotFoundError, AIGenerationError, etc.)
  db.ts                 — Singleton do Prisma client
prisma/
  schema.prisma         — Modelos Property e GeneratedGuide com campos JSON
  seed.ts               — 4 imóveis demo (FLN001, GRM001, SP001, SAL001)
  migrations/           — Migrations versionadas do schema
docs/
  PLANNING.md           — System prompts, chat invariants, histórico de iteração
  chat-verification.md  — Resultados dos testes anti-hallucination (9 invariantes)
  spec-data.json        — Dados verbatim dos imóveis do enunciado do desafio
.claude/
  skills/prompt-tester/ — Chat invariants e protocolo de refinamento de prompt
  commands/             — Slash commands /commit e /new-feature
  settings.json         — Allowlist de permissões
```
