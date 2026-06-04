# `next/` — the future-design track

This folder is a **sandbox for proposed component redesigns**. It exists so an
agent (or a developer) can iterate on the *next* version of the UI while the
live site keeps running on the current components untouched.

## The two tracks

| Track     | Location                 | Imported by pages? | Storybook group |
| --------- | ------------------------ | ------------------ | --------------- |
| Current   | `src/components/ui/`     | **Yes** — only this track | `Current/…` |
| Next      | `src/components/next/`   | **No, never**      | `Next/…`        |

One Storybook renders both, so `Current/UI/HelloCard` and `Next/UI/HelloCard`
sit side by side for comparison.

## Rules

1. **Keep the same public prop API** as the current component you are redesigning
   (re-use the exported `…Props` type from `components/ui`). Promotion must be a
   drop-in swap.
2. **Pages and island containers must not import from `next/`.** This is enforced
   by `no-page-imports.test.ts` — a failing build means the site would be coupled
   to an unfinished design.
3. **Cover the full state contract.** A data-backed redesign still needs
   `default` / `loading` / `error` / `empty` stories before it can be promoted.

## Telling an agent to work here

> "Apply the redesign to `src/components/next/HelloCard.tsx`. Keep `HelloCardProps`
> identical and update `Next/UI/HelloCard` stories. Do not touch `components/ui`
> or any page."

Because nothing on the site imports `next/`, this work cannot break the live
site no matter how far the redesign goes.

## Promotion

When a developer is happy with a `next/` component, promote it at their leisure:

```bash
# replace the live component with the redesign, then delete the next/ copy
cp src/components/next/HelloCard.tsx src/components/ui/HelloCard.tsx
# (carry over / merge the stories, run the contract checks, commit)
```

This is the **only** moment the live UI changes, and it is a deliberate human
decision — not a side effect of design work.
