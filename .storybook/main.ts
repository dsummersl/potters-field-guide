import type { StorybookConfig } from '@storybook/preact-vite';

const config: StorybookConfig = {
  // Stories are collocated with components: Component.stories.tsx next to
  // Component.tsx under src/components.
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  // Storybook 9+ folds controls/actions/viewport into core; `addon-docs`
  // provides the autodocs pages (tags: ['autodocs']).
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/preact-vite',
    options: {},
  },
};

export default config;
