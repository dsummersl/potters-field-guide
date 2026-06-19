import type { Meta, StoryObj } from '@storybook/preact-vite';
import { Button, type ButtonProps } from './Button';

const meta: Meta<ButtonProps> = {
  // Top-level "Current/" groups the live, shipped components in Storybook's
  // sidebar — the only track pages are allowed to import. Proposed redesigns
  // live under "Next/" (src/components/next).
  title: 'Current/UI/Button',
  component: Button,
  tags: ['autodocs', 'current'],
  args: {
    label: 'Click me',
    variant: 'primary',
    disabled: false,
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary'] },
  },
};

export default meta;
type Story = StoryObj<ButtonProps>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: { variant: 'secondary', label: 'Cancel' },
};

export const Disabled: Story = {
  args: { disabled: true },
};
