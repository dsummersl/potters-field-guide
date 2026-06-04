# Project conventions for AI agents

This is a **design-first** Astro + SST project. The component library and the
API contract are the source of truth. They are defined *before* implementation
so that agents never invent props, duplicate components, or let the UI drift
from the API.

Follow these rules without exception.

## Components (Storybook is the contract)

1. **Look before you build.** Before creating any component, check
   `src/components/ui/` and open Storybook (`npm run dev` → http://localhost:6006).
   If a component or a close variant already exists, reuse it. Do **not** create
   a second component for an existing concern.
2. **Story file first.** When a new component is genuinely needed, write
   `Component.stories.tsx` *before* `Component.tsx`. The stories define the
   component's prop API and every visual state (at minimum: `default`,
   `loading`, `error`, `empty` for data-backed components).
3. **Collocate.** `Component.stories.tsx` lives next to `Component.tsx`.
4. **Pages only assemble.** Page-level code (`src/pages/**`, island containers
   like `HelloApiDemo.tsx`) may only compose states that already exist as
   stories. It must not introduce new visual states inline.

## API (OpenAPI is the contract)

1. **Spec first.** Edit `src/api/openapi.yaml` *before* touching a handler.
2. **Regenerate types.** Run `npm run api:types` to regenerate
   `src/api/schema.gen.ts` from the spec.
3. **Implement against the types.** Handlers in `src/api/` import the generated
   `paths` types. A handler must not return a shape the spec does not describe —
   if you need a new shape, change the spec first (step 1).
4. **Routes are wired in `sst.config.ts`.** Add the SST route at the same time
   you add the handler.

## Verifying

- `npm run api:types && npx tsc --noEmit -p tsconfig.json` — types + contract.
- `npm run build` — Astro site + Storybook + generated API types.
- `npm test` — unit tests.

Never edit `src/api/schema.gen.ts` by hand; it is generated.
