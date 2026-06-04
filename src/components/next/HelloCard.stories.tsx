import type { Meta, StoryObj } from '@storybook/preact';
import { HelloCard } from './HelloCard';
import type { HelloCardProps } from '@/components/ui/HelloCard';

const meta: Meta<HelloCardProps> = {
  // "Next/" groups proposed redesigns in Storybook's sidebar, alongside the
  // live "Current/HelloCard" so the two can be compared at a glance. Nothing on
  // the site imports this component until it is promoted into components/ui.
  title: 'Next/UI/HelloCard',
  component: HelloCard,
  tags: ['autodocs', 'next'],
  argTypes: {
    state: {
      control: 'inline-radio',
      options: ['default', 'loading', 'error', 'empty'],
    },
  },
};

export default meta;
type Story = StoryObj<HelloCardProps>;

// Same four canonical states as the shipped card — the redesign must cover the
// full contract before it can be promoted.
export const Default: Story = {
  args: {
    state: 'default',
    message: 'Hello, Ada!',
    timestamp: new Date().toISOString(),
  },
};

export const Loading: Story = { args: { state: 'loading' } };

export const Error: Story = {
  args: { state: 'error', error: 'Failed to reach the Hello API' },
};

export const Empty: Story = { args: { state: 'empty' } };
