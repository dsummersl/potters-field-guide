import type { Meta, StoryObj } from '@storybook/preact';
import { ItemCard } from './ItemCard';
import type { ItemCardProps } from '@/components/ui/ItemCard';
import type { SiteItem } from '@/lib/types';

const bulbasaur: SiteItem = {
  id: '1',
  title: 'bulbasaur',
  image:
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
  description: 'https://pokeapi.co/api/v2/pokemon-species/1/',
  tags: ['grass', 'poison'],
  extras: {},
};

const meta: Meta<ItemCardProps> = {
  // "Next/" — proposed restyle shown beside the live "Current/Directory/ItemCard"
  // for comparison. Not imported by any page until promoted.
  title: 'Next/Directory/ItemCard',
  component: ItemCard,
  tags: ['autodocs', 'next'],
  args: { base: '/' },
  decorators: [
    (Story) => (
      <div style={{ width: '20rem' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<ItemCardProps>;

export const Default: Story = {
  args: { item: bulbasaur },
};

export const NoImage: Story = {
  args: { item: { ...bulbasaur, title: 'missingno', image: '' } },
};

export const NoTags: Story = {
  args: { item: { ...bulbasaur, tags: [] } },
};
