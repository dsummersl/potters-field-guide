import type { SiteItem } from '@/lib/types';

export interface ItemCardProps {
  /** The directory record to render (mapped from the data pipeline). */
  item: SiteItem;
  /** Base URL prefix for the item link (e.g. '/' or '/my-repo/'). */
  base?: string;
}

/**
 * The directory's primary artifact: a single record from the data pipeline
 * (`src/data/items.yaml` → `getItems()`), rendered as a linked card. Pages
 * map over `getItems()` and assemble a grid of these — they invent no markup.
 *
 * This is the live, shipped card. A proposed restyle lives at
 * `src/components/next/ItemCard.tsx` (Storybook group `Next/`).
 */
export function ItemCard({ item, base = '/' }: ItemCardProps) {
  const href = `${base}items/${item.id}`;

  return (
    <a
      href={href}
      class="group flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md hover:border-brand-300 transition-all duration-200"
    >
      {/* Image (falls back to a placeholder glyph when absent) */}
      <div class="aspect-video bg-gray-100 overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div class="w-full h-full flex items-center justify-center text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div class="p-5 flex flex-col flex-1">
        <h3 class="font-semibold text-gray-900 group-hover:text-brand-700 transition-colors line-clamp-2 leading-snug mb-2">
          {item.title}
        </h3>

        <p class="text-sm text-gray-600 line-clamp-3 flex-1">{item.description}</p>

        {item.tags.length > 0 && (
          <div class="mt-3 flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map((tag) => (
              <span class="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}
