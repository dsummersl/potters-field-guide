// NEXT / proposed redesign of the shipped src/components/ui/HelloCard.
//
// Rules for this track:
//   • Keep the SAME public prop API as the current component so promotion is a
//     drop-in swap (here we re-use HelloCardProps from the live component).
//   • No page or island container may import from src/components/next — a guard
//     test enforces this, so editing anything here cannot affect the live site.
//   • Promote by copying this file over src/components/ui/HelloCard.tsx when a
//     developer is happy with it.
import type { HelloCardProps } from '@/components/ui/HelloCard';

const CARD =
  'rounded-2xl border p-6 shadow-md bg-gradient-to-br from-white to-gray-50 min-h-[8rem] flex flex-col justify-center';

/**
 * Redesigned Hello card: softer surface, a status dot, and clearer typographic
 * hierarchy — while modelling the exact same four states as the shipped card.
 */
export function HelloCard({
  state = 'default',
  message = 'Hello, world!',
  timestamp,
  error,
}: HelloCardProps) {
  if (state === 'loading') {
    return (
      <div class={`${CARD} border-gray-200 animate-pulse`} aria-busy="true">
        <div class="h-4 w-2/3 bg-gray-200 rounded-full mb-3" />
        <div class="h-3 w-1/3 bg-gray-100 rounded-full" />
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div class={`${CARD} border-red-200 from-red-50 to-red-50`} role="alert">
        <div class="flex items-center gap-2">
          <span class="h-2.5 w-2.5 rounded-full bg-red-500" aria-hidden="true" />
          <p class="font-semibold text-red-700">Something went wrong</p>
        </div>
        <p class="text-sm text-red-600 mt-1">{error ?? 'Unknown error'}</p>
      </div>
    );
  }

  if (state === 'empty') {
    return (
      <div class={`${CARD} border-dashed border-gray-300 text-center`}>
        <p class="text-gray-400 text-sm">No greeting yet — try a name above.</p>
      </div>
    );
  }

  return (
    <div class={`${CARD} border-gray-200`}>
      <div class="flex items-center gap-2">
        <span class="h-2.5 w-2.5 rounded-full bg-brand-500" aria-hidden="true" />
        <p class="text-lg font-semibold tracking-tight text-gray-900">{message}</p>
      </div>
      {timestamp && (
        <p class="text-xs text-gray-400 mt-2 pl-[1.125rem]">
          generated {new Date(timestamp).toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
