# Astro API-First + Storybook Template

A **design-first** boilerplate for Astro projects deployed with [SST](https://sst.dev).
The component library and the API contract are defined and served as living
documentation *before* anything is assembled — which is exactly what keeps
agent-assisted development from drifting, duplicating components, or
hallucinating prop APIs.

Two surfaces are the source of truth:

| Surface | Source of truth | Living docs (dev) |
|---|---|---|
| **Components** | `*.stories.tsx` collocated with each component | Storybook at `:6006` |
| **API** | `src/api/openapi.yaml` | Scalar at `/api-docs` |

A new contributor — or an agent — can see the **entire component inventory and
API surface without reading source code**.

## The design-first loop

```
            ┌─ design ─────────────┐        ┌─ design ──────────────┐
            │  Component.stories.tsx│        │  src/api/openapi.yaml │
            │  (states: default,    │        │  (the request/response│
            │   loading, error,     │        │   contract)           │
            │   empty)              │        │                       │
            └──────────┬───────────┘        └───────────┬───────────┘
                       ▼                                ▼
            Component.tsx (implements          npm run api:types
              the documented props)            → src/api/schema.gen.ts
                       │                                │
                       ▼                                ▼
            Pages assemble existing      src/api/hello.ts implements
              component states            against the generated types
```

The arrows only ever point **down**: design → implement → assemble. You never
implement a component without a story, and never write a handler without the
spec. See [`CLAUDE.md`](./CLAUDE.md) / [`.cursorrules`](./.cursorrules) for the
agent-enforced version of these rules.

## Quickstart

```bash
npm install
npm run api:types     # generate API types from the spec (also part of build)
npm run dev           # starts everything below, concurrently
```

`npm run dev` runs three processes:

| URL | What | Backed by |
|---|---|---|
| http://localhost:4321 | Astro site (incl. `/demo`) | `astro dev` |
| http://localhost:4321/api-docs | API reference (Scalar) | reads `openapi.yaml` |
| http://localhost:6006 | Storybook component library | `storybook dev` |
| http://localhost:3001/hello | Live Hello API | `scripts/api-local.ts` |

The header nav on the site links to **API Demo**, **API Docs**, and
**Storybook**, so the full inventory is reachable from the home page.

> The `/demo` page is a worked example of "assembly": it composes the
> already-designed `HelloCard` states and `Button`, and calls the typed
> `/hello` endpoint. It invents nothing new.

## Running with SST

`npm run dev` works with **zero AWS setup** — the API runs as a local Node shim
so the docs have a live server to hit. To run the real Lambda live against AWS:

```bash
npm run dev:sst      # = sst dev   (requires AWS credentials)
```

`sst.config.ts` defines:

- an **`ApiGatewayV2`** construct with a `GET /hello` route → `src/api/hello.handler`
- an **`Astro`** site, with the API linked in as `PUBLIC_API_URL` so the
  frontend calls the deployed endpoint with no hard-coded URLs.

Deploy with `npx sst deploy --stage production`.

## Components

Components live in `src/components/ui/` as Preact (`.tsx`) components, each with
a collocated story:

```
src/components/ui/
  Button.tsx          Button.stories.tsx
  HelloCard.tsx       HelloCard.stories.tsx     ← default / loading / error / empty
  HelloApiDemo.tsx    (container: assembles the above + the typed API)
```

**Adding a component (the required order):**

1. Write `MyThing.stories.tsx` describing the prop API and every state.
2. Implement `MyThing.tsx` to satisfy those stories.
3. Assemble it into a page or container — using only states that have stories.

Tailwind is wired through `postcss.config.cjs`, so stories render with the exact
same utility classes as production pages — no separate styling pipeline to drift.

## API

`src/api/openapi.yaml` is the contract and is authored first. Types flow from it:

```bash
npm run api:types     # openapi.yaml → src/api/schema.gen.ts (do not edit by hand)
```

`src/api/hello.ts` imports the generated `paths` types, so the handler
**cannot** return a shape the spec doesn't describe — the contract and the
implementation are kept in lockstep by the type checker.

**Adding/changing an endpoint (the required order):**

1. Edit `src/api/openapi.yaml`.
2. `npm run api:types`.
3. Implement the handler in `src/api/` against the regenerated types.
4. Wire the route in `sst.config.ts`.

> Want runtime validation too? Swap the spec-first flow for a schema-first one
> with [`zod-to-openapi`](https://github.com/asteasolutions/zod-to-openapi) or
> TypeBox: define a Zod/TypeBox schema, generate `openapi.yaml` from it, and
> reuse the schema to validate at runtime. The type-sharing seam
> (`schema.gen.ts`) stays the same.

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Astro + Storybook + local API, concurrently |
| `npm run dev:sst` | `sst dev` — live Lambda against AWS |
| `npm run build` | `api:types` → Astro build → Storybook build (into `dist/storybook`) |
| `npm run api:types` | Regenerate API types from `openapi.yaml` |
| `npm run api:local` | Run the Hello handler over plain HTTP (no AWS) |
| `npm run storybook` | Storybook only, on `:6006` |
| `npm test` | Unit tests (Vitest) |
| `npm run fetch` | Data pipeline for the directory pages (see below) |

## Tech stack

- [Astro 4](https://astro.build) — pages, static output
- [Preact](https://preactjs.com) + [Storybook 8](https://storybook.js.org) — component library & docs
- [SST v3](https://sst.dev) — API Gateway + Lambda + site deploy
- [OpenAPI 3.1](https://www.openapis.org) + [openapi-typescript](https://github.com/openapi-ts/openapi-typescript) — API contract → types
- [Scalar](https://scalar.com) — API reference UI
- [Tailwind CSS 3](https://tailwindcss.com) — styling (shared Astro/Storybook pipeline)

---

## Directory data pipeline (inherited)

This template also ships the original Astro Directory loader: a build-time
pipeline that turns any data source into a typed `SiteItem[]` for the `/`,
`/items`, and `/items/[id]` pages.

- **`scripts/fetch-data.ts`** — fetches data and writes `src/data/items.yaml`
  (the default example pulls 20 Pokémon from [PokéAPI](https://pokeapi.co)).
- **`src/config/schema.yaml`** — maps your source fields to the canonical roles
  (`id`, `title`, `image`, `description`, `tags`).
- **`src/lib/loader.ts`** — reads, renames, validates, and returns `SiteItem[]`.

Run `npm run fetch` to regenerate the data. Field-mapping and validation rules
are covered by `src/lib/loader.test.ts` (`npm test`). Adapt it by editing the
fetch script and the schema — no other files need to change.

## License

MIT
