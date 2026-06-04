export type HelloCardState = 'default' | 'loading' | 'error' | 'empty';

export interface HelloCardProps {
  /** Which of the four canonical states to render. */
  state?: HelloCardState;
  /** The greeting message (shown in the `default` state). */
  message?: string;
  /** ISO timestamp returned by the API (shown in the `default` state). */
  timestamp?: string;
  /** Error text (shown in the `error` state). */
  error?: string;
}

const CARD = 'rounded-xl border p-6 shadow-sm bg-white min-h-[8rem] flex flex-col justify-center';

/**
 * Presentational card for the Hello API response. It models the four states
 * every data-backed component should account for — design them all in
 * Storybook *before* wiring the component into a page.
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
        <div class="h-4 w-2/3 bg-gray-200 rounded mb-3" />
        <div class="h-3 w-1/3 bg-gray-100 rounded" />
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div class={`${CARD} border-red-200 bg-red-50`} role="alert">
        <p class="font-semibold text-red-700">Something went wrong</p>
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
      <p class="text-lg font-semibold text-gray-900">{message}</p>
      {timestamp && (
        <p class="text-xs text-gray-400 mt-2">
          generated {new Date(timestamp).toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
