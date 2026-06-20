import { useState } from 'preact/hooks';

export interface NavLink {
  href: string;
  label: string;
}

export interface SiteHeaderProps {
  /** Brand text shown next to the logo. */
  brand?: string;
  /** Where the logo/brand links to (also used to detect the active "Home"). */
  homeHref?: string;
  /** Current path, for highlighting the active link. */
  currentPath?: string;
  /** Primary navigation links (already base-prefixed by the caller). */
  links: NavLink[];
}

/**
 * The site's sticky header. Presentational + self-contained: the caller passes
 * the already-resolved nav links and current path, so the same component drives
 * the live site (hydrated for the mobile menu) and Storybook.
 */
export function SiteHeader({
  brand = 'SheetSite',
  homeHref = '/',
  currentPath = homeHref,
  links,
}: SiteHeaderProps) {
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    currentPath === href || (href !== homeHref && currentPath.startsWith(href));

  return (
    <header class="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          {/* Logo / Site name */}
          <a
            href={homeHref}
            class="flex items-center gap-2 font-bold text-xl text-brand-700 hover:text-brand-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M3 14h18M10 3v18M14 3v18M3 3h18v18H3z" />
            </svg>
            {brand}
          </a>

          {/* Desktop nav */}
          <nav class="hidden md:flex items-center gap-1">
            {links.map(({ href, label }) => (
              <a
                href={href}
                class={[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive(href)
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                ].join(' ')}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            class="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile nav */}
        <nav class={`md:hidden ${open ? 'flex' : 'hidden'} pb-4 flex-col gap-1`}>
          {links.map(({ href, label }) => (
            <a href={href} class="block px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
