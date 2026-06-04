import type { StorybookConfig } from '@storybook/preact-vite';

const config: StorybookConfig = {
  // Stories are collocated with components: Component.stories.tsx next to
  // Component.tsx under src/components.
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/preact-vite',
    options: {},
  },
};

export default config;
