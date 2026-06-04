import { useState } from 'preact/hooks';
import { HelloCard, type HelloCardState } from './HelloCard';
import { Button } from './Button';
import type { paths } from '@/api/schema.gen';

type Greeting =
  paths['/hello']['get']['responses']['200']['content']['application/json'];

// PUBLIC_API_URL is injected by SST (linked from the Api construct). Falls back
// to the local dev shim (`npm run api:local`) when running without AWS.
const API_URL =
  import.meta.env.PUBLIC_API_URL ?? 'http://localhost:3001';

/**
 * The "page assembly" layer: it only composes already-designed primitives
 * (HelloCard's states + Button) and the typed API contract. No new visual
 * states are invented here.
 */
export function HelloApiDemo() {
  const [name, setName] = useState('');
  const [state, setState] = useState<HelloCardState>('empty');
  const [greeting, setGreeting] = useState<Greeting | null>(null);
  const [error, setError] = useState<string>();

  async function fetchGreeting() {
    setState('loading');
    setError(undefined);
    try {
      const url = new URL('/hello', API_URL);
      if (name) url.searchParams.set('name', name);
      const res = await fetch(url);
      if (!res.ok) throw new Error(`API responded ${res.status}`);
      setGreeting((await res.json()) as Greeting);
      setState('default');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed');
      setState('error');
    }
  }

  return (
    <div class="flex flex-col gap-4 max-w-md">
      <div class="flex gap-2">
        <input
          type="text"
          value={name}
          placeholder="Your name"
          onInput={(e) => setName((e.target as HTMLInputElement).value)}
          class="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-300"
        />
        <Button label="Greet me" onClick={fetchGreeting} />
      </div>
      <HelloCard
        state={state}
        message={greeting?.message}
        timestamp={greeting?.timestamp}
        error={error}
      />
    </div>
  );
}
