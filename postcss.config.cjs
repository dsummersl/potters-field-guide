// Single Tailwind pipeline shared by Astro and Storybook.
// Vite (used by both Astro and @storybook/preact-vite) auto-loads this file,
// so stories render with the same utility classes as production pages.
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
