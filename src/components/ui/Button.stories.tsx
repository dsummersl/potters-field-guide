import type { Meta, StoryObj } from '@storybook/preact';
import { Button, type ButtonProps } from './Button';

const meta: Meta<ButtonProps> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
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
