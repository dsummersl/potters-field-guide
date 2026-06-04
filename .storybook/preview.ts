import type { Preview } from '@storybook/preact';
// Same Tailwind pipeline as the Astro pages (see postcss.config.cjs), so stories
// look exactly like production.
import '../src/styles/tailwind.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
  },
};

export default preview;
