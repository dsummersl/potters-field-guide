import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

// Guard for the two-track design system: the "next/" track (proposed redesigns)
// must never be imported by page-level code, so editing a redesign can never
// affect the live site. Promotion is a deliberate copy into components/ui.
//
// We scan every page and island container for an import that resolves into
// src/components/next and fail loudly if one exists.

const here = dirname(fileURLToPath(import.meta.url)); // src/components/next
const srcRoot = join(here, '..', '..'); // src

// Matches: '@/components/next/...', '../next/...', '../../components/next/...'
const NEXT_IMPORT =
  /from\s+['"]([^'"]*(?:@\/components\/next|(?:\.\.\/)+(?:components\/)?next)\/[^'"]*)['"]/;

/** All files under `dir` whose name matches `test`, recursively. */
function walk(dir: string, test: (name: string) => boolean): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, test));
    else if (test(entry.name)) out.push(full);
  }
  return out;
}

/**
 * Page-level code per CLAUDE.md: everything under src/pages, plus island
 * containers (the *Demo.tsx in components/ui that wire components to the API).
 */
function pageFiles(): string[] {
  const pages = walk(join(srcRoot, 'pages'), (n) =>
    /\.(astro|ts|tsx)$/.test(n),
  );
  const islands = walk(join(srcRoot, 'components', 'ui'), (n) =>
    /Demo\.tsx$/.test(n),
  );
  return [...pages, ...islands];
}

describe('next/ design track isolation', () => {
  it('finds page-level files to check (sanity)', () => {
    expect(pageFiles().length).toBeGreaterThan(0);
  });

  it('no page or island container imports from components/next', () => {
    const offenders = pageFiles().filter((file) =>
      NEXT_IMPORT.test(readFileSync(file, 'utf8')),
    );

    expect(
      offenders.map((f) => relative(srcRoot, f)),
      'Pages must import from components/ui (the live track), never components/next. ' +
        'Promote a redesign by copying it into components/ui first.',
    ).toEqual([]);
  });
});
