import type { NavLink } from './SiteHeader';

export interface SiteFooterProps {
  /** Brand text. */
  brand?: string;
  /** Where the brand/Home links point. */
  homeHref?: string;
  /** Footer navigation links (already base-prefixed by the caller). */
  links: NavLink[];
  /** Copyright year (defaults to the current year). */
  year?: number;
}

/**
 * The site footer. Static/presentational — rendered to plain HTML on the live
 * site (no hydration) and shown in Storybook alongside the header.
 */
export function SiteFooter({
  brand = 'SheetSite',
  homeHref = '/',
  links,
  year = new Date().getFullYear(),
}: SiteFooterProps) {
  return (
    <footer class="bg-white border-t border-gray-200 mt-16">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="text-center md:text-left">
            <p class="font-semibold text-gray-800">{brand}</p>
            <p class="text-sm text-gray-500 mt-1">
              A directory template powered by&nbsp;
              <a href="https://astro.build" class="underline hover:text-brand-600" target="_blank" rel="noopener">Astro</a>
              &nbsp;+&nbsp;
              <a href="https://sheets.google.com" class="underline hover:text-brand-600" target="_blank" rel="noopener">Google Sheets</a>.
            </p>
          </div>

          <nav class="flex gap-6 text-sm text-gray-500">
            {links.map(({ href, label }) => (
              <a href={href} class="hover:text-gray-900 transition-colors">{label}</a>
            ))}
          </nav>
        </div>

        <p class="mt-8 text-center text-xs text-gray-400">&copy; {year} {brand}. MIT License.</p>
      </div>
    </footer>
  );
}
