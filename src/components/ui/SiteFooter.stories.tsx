import type { Meta, StoryObj } from '@storybook/preact';
import { SiteFooter, type SiteFooterProps } from './SiteFooter';

const meta: Meta<SiteFooterProps> = {
  title: 'Current/Directory/SiteFooter',
  component: SiteFooter,
  tags: ['autodocs', 'current'],
  parameters: { layout: 'fullscreen' },
  args: {
    brand: 'SheetSite',
    homeHref: '/',
    links: [
      { href: '/', label: 'Home' },
      { href: '/items', label: 'Browse' },
      { href: '/search', label: 'Search' },
    ],
    year: 2026,
  },
};

export default meta;
type Story = StoryObj<SiteFooterProps>;

export const Default: Story = {};
