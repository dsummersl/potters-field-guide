// NEXT / proposed restyle of the shipped src/components/ui/ItemCard.
//
// Same public prop API (re-uses ItemCardProps) so promotion is a drop-in swap:
// copy this file over src/components/ui/ItemCard.tsx when the design is signed
// off. No page imports from src/components/next (enforced by the guard test).
import type { ItemCardProps } from '@/components/ui/ItemCard';

/**
 * WIP redesign: a square image with the title overlaid on a gradient scrim,
 * pill-shaped brand-coloured tags, and a stronger hover lift. Demonstrates a
 * "next" design direction for the directory card without touching the live one.
 */
export function ItemCard({ item, base = '/' }: ItemCardProps) {
  const href = `${base}items/${item.id}`;

  return (
    <a
      href={href}
      class="group flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Image with title overlaid on a gradient scrim */}
      <div class="relative aspect-square bg-gradient-to-br from-brand-50 to-gray-100 overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            class="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div class="w-full h-full flex items-center justify-center text-brand-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
          <h3 class="font-semibold text-white capitalize line-clamp-1 drop-shadow">{item.title}</h3>
        </div>
      </div>

      {/* Tags as brand-coloured pills */}
      {item.tags.length > 0 && (
        <div class="p-4 flex flex-wrap gap-1.5">
          {item.tags.slice(0, 3).map((tag) => (
            <span class="text-xs font-medium text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full capitalize">
              {tag}
            </span>
          ))}
        </div>
      )}
    </a>
  );
}
