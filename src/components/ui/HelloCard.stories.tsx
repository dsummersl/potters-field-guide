import type { Meta, StoryObj } from '@storybook/preact-vite';
import { HelloCard, type HelloCardProps } from './HelloCard';

const meta: Meta<HelloCardProps> = {
  // "Current/" = live, shipped components (the only track pages import).
  // Proposed redesigns live under "Next/" (src/components/next).
  title: 'Current/UI/HelloCard',
  component: HelloCard,
  tags: ['autodocs', 'current'],
  argTypes: {
    state: {
      control: 'inline-radio',
      options: ['default', 'loading', 'error', 'empty'],
    },
  },
};

export default meta;
type Story = StoryObj<HelloCardProps>;

// One story per canonical state — this IS the visual contract for the
// component. A page may only assemble states that exist here.
export const Default: Story = {
  args: {
    state: 'default',
    message: 'Hello, Ada!',
    timestamp: new Date().toISOString(),
  },
};

export const Loading: Story = {
  args: { state: 'loading' },
};

export const Error: Story = {
  args: { state: 'error', error: 'Failed to reach the Hello API' },
};

export const Empty: Story = {
  args: { state: 'empty' },
};
