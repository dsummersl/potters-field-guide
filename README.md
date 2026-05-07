# Astro Directory Template

A static-site directory template powered by Astro. Data comes from any source you can fetch in a TypeScript script — no Google Sheets account, no database, no CMS required.

## How It Works

```
scripts/fetch-data.ts        src/config/schema.yaml
       │                              │
       ▼                              ▼
 src/data/items.yaml  ──►  src/lib/loader.ts  ──►  SiteItem[]  ──►  components
  (raw YAML, any shape)    (maps + validates)       (4 roles)
```

There are four moving parts:

1. **`scripts/fetch-data.ts`** — your data pipeline. This script fetches data from any API or remote source and writes it to `src/data/items.yaml` as a flat array of YAML objects. The template ships with a working Pokémon example that you replace with your own fetch logic.

2. **`src/config/schema.yaml`** — the only file you edit when adapting the template to a new data source. It declares which field in `items.yaml` maps to each of the five canonical roles (`id`, `title`, `image`, `description`, `tags`) and what type each field must be. Everything else is automatic.

3. **`src/lib/loader.ts`** — reads both YAML files at build time, renames source fields to canonical names, validates types, skips bad rows with descriptive warnings, and returns a typed `SiteItem[]` array. No field-name knowledge leaks past this point.

4. **Components and pages** — only ever see `SiteItem`. They have no knowledge of your source field names and require no changes when you switch data sources.

## Quickstart

```bash
# 1. Clone and install
git clone https://github.com/your-org/astro-directory-template
cd astro-directory-template
npm install

# 2. Generate data (runs the Pokémon example out of the box)
npm run fetch

# 3. Start the dev server
npm run dev
```

The site is available at `http://localhost:4321`. It displays 20 Pokémon pulled from the public PokéAPI. No configuration needed for the first run.

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero with search bar and item count, full grid of all items |
| `/search` | Client-side full-text search across title, description, and tags |
| `/items` | Browse — full grid of all items |
| `/items/[id]` | Detail — title, description, tags, and any extra fields as key/value pairs |

## Adapting to Your Own Data

### Step 1: Edit the fetch script

`scripts/fetch-data.ts` is your data pipeline. Its only contract is to write a YAML array of flat objects to `src/data/items.yaml`. The field names can be anything — you'll map them in the schema.

```typescript
// Example: pull from your own API and write flat records
const response = await fetch('https://api.example.com/products');
const products = await response.json();

const items = products.map((p: any) => ({
  id:           String(p.product_id),
  product_name: p.name,
  photo_url:    p.images[0]?.url ?? '',
  summary:      p.short_description,
  category:     p.tags.join(','),
}));

writeFileSync('src/data/items.yaml', yaml.dump(items));
```

Any secrets your script needs (API keys, tokens) should be read from `process.env`. Store them as GitHub Actions secrets and they'll be available automatically during CI builds.

### Step 2: Edit the schema

`src/config/schema.yaml` maps your source field names to the five canonical roles. This is the only file that knows your source field names:

```yaml
fields:
  id:
    source: id            # field name as written in items.yaml
    type: string
    required: true
  title:
    source: product_name  # ← your source field
    type: string
    required: true
  image:
    source: photo_url
    type: url
    required: false
  description:
    source: summary
    type: string
    required: false
  tags:
    source: category      # comma-separated → split into string[]
    type: string
    required: false
```

That's it. No other files need to change.

## Schema Reference

### Supported types

| Type | Validation rule |
|---|---|
| `string` | Always passes |
| `url` | Must parse successfully with `new URL()` |
| `integer` | Must match `/^-?\d+$/` (no decimal point) |
| `number` | Must parse as a finite number |

### Validation behavior

- A row missing a `required: true` field is **skipped** entirely and a warning is printed: `[loader] Skipping row "42": field "product_name" is required`
- A row with a value that fails its type check is **skipped** entirely with a similar warning: `[loader] Skipping row "42": field "photo_url" failed type check "url"`
- Fields present in `items.yaml` but not declared in the schema are collected into `item.extras` and rendered as key/value pairs on the detail page — no data is silently dropped

## GitHub Actions / CI

The deploy workflow runs `npm run fetch` automatically before every build:

```yaml
- name: Fetch data
  run: npm run fetch

- name: Build site
  run: npm run build
```

This means your site always reflects fresh data on every deployment. To pass secrets to your fetch script, add them in **GitHub Settings → Secrets and variables → Actions** — the script reads them via `process.env`. The workflow file itself never needs editing.

`src/data/items.yaml` is committed with pre-generated Pokémon data so the site builds immediately on first clone without any configuration.

### First-time GitHub Pages setup

1. Go to **Settings → Pages** and set *Source* to **GitHub Actions**.
2. Add the following in **Settings → Secrets and variables → Actions**:
   - **Variable** `SITE_URL` — e.g. `https://yourusername.github.io`
   - **Variable** `SITE_BASE` — e.g. `/your-repo-name` (leave empty for custom domains)
3. Push to `main` or click **Actions → Run workflow**.

## Running Tests

```bash
npm test
```

Tests cover the loader's field-mapping and type-validation logic (`src/lib/loader.test.ts`). All 7 tests run in under a second.

## Pokémon Example Walkthrough

The default `scripts/fetch-data.ts` fetches 20 Pokémon from [PokéAPI](https://pokeapi.co) and flattens the nested response into a simple YAML structure.

| PokéAPI response field | Flat key in `items.yaml` | Mapped to in schema |
|---|---|---|
| `pokemon.id` | `id` | `id` |
| `pokemon.name` | `name` | `title` |
| `pokemon.sprites.front_default` | `sprites_front_default` | `image` |
| `pokemon.species.url` | `species_url` | `description` |
| `pokemon.types[*].type.name` (joined) | `types` | `tags` |

To inspect the raw output yourself:

```bash
npm run fetch
head -30 src/data/items.yaml
```

## Customisation

**Branding** — edit `src/components/Header.astro` and `src/components/Footer.astro`.

**Colour scheme** — `tailwind.config.mjs` defines the `brand` colour palette. Change the hex values to match your project.

**Base path** — for GitHub Pages project sites (`username.github.io/repo-name`), set `SITE_URL` and `SITE_BASE` as described above.

## Tech Stack

- [Astro 4](https://astro.build) — static site generator
- [Tailwind CSS 3](https://tailwindcss.com) — utility-first styling
- [js-yaml](https://github.com/nodeca/js-yaml) — YAML parsing for the loader and fetch script
- [tsx](https://github.com/privatenumber/tsx) — run TypeScript scripts directly
- [Vitest](https://vitest.dev) — unit tests for the loader
- GitHub Actions + GitHub Pages — CI/CD and hosting

## License

MIT
