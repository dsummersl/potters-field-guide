import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import * as yaml from 'js-yaml';

interface PokeListEntry { name: string; url: string; }
interface PokeDetail {
  id: number;
  name: string;
  sprites: { front_default: string | null };
  species: { url: string };
  types: { type: { name: string } }[];
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  return res.json() as Promise<T>;
}

async function main() {
  const list = await fetchJson<{ results: PokeListEntry[] }>(
    'https://pokeapi.co/api/v2/pokemon?limit=20'
  );

  const items = await Promise.all(
    list.results.map(async ({ url }) => {
      const detail = await fetchJson<PokeDetail>(url);
      return {
        id:                    String(detail.id),
        name:                  detail.name,
        sprites_front_default: detail.sprites.front_default ?? '',
        species_url:           detail.species.url,
        types:                 detail.types.map(t => t.type.name).join(','),
      };
    })
  );

  const outPath = join(process.cwd(), 'src/data/items.yaml');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, yaml.dump(items));
  console.log(`[fetch-data] Wrote ${items.length} items to src/data/items.yaml`);
}

main().catch(err => { console.error(err); process.exit(1); });
