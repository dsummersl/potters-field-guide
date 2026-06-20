import type { Meta, StoryObj } from '@storybook/preact';
import { SiteHeader, type SiteHeaderProps } from './SiteHeader';

const links = [
  { href: '/', label: 'Home' },
  { href: '/items', label: 'Browse' },
  { href: '/demo', label: 'API Demo' },
  { href: '/api-docs', label: 'API Docs' },
  { href: '/storybook/', label: 'Storybook' },
];

const meta: Meta<SiteHeaderProps> = {
  title: 'Current/Directory/SiteHeader',
  component: SiteHeader,
  tags: ['autodocs', 'current'],
  // Full-bleed so the sticky header spans the canvas like it does on the site.
  parameters: { layout: 'fullscreen' },
  args: { brand: 'SheetSite', homeHref: '/', links },
};

export default meta;
type Story = StoryObj<SiteHeaderProps>;

export const Home: Story = {
  args: { currentPath: '/' },
};

export const Browsing: Story = {
  args: { currentPath: '/items' },
};
