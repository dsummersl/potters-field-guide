import type { Meta, StoryObj } from '@storybook/preact';
import { ItemCard, type ItemCardProps } from './ItemCard';
import type { SiteItem } from '@/lib/types';

// A representative record from the data pipeline (the Pokémon sample dataset).
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
  // "Current/" = live, shipped components. This card is the directory's primary
  // artifact; its proposed restyle is "Next/Directory/ItemCard".
  title: 'Current/Directory/ItemCard',
  component: ItemCard,
  tags: ['autodocs', 'current'],
  args: { base: '/' },
  // Constrain width so the card looks like one grid cell, not full-bleed.
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

// No image in the source row → the placeholder glyph is shown.
export const NoImage: Story = {
  args: { item: { ...bulbasaur, title: 'missingno', image: '' } },
};

// A row with no tags omits the tag strip entirely.
export const NoTags: Story = {
  args: { item: { ...bulbasaur, tags: [] } },
};

// Long title/description are clamped (line-clamp-2 / line-clamp-3).
export const LongContent: Story = {
  args: {
    item: {
      ...bulbasaur,
      title: 'a-very-long-pokemon-name-that-should-be-clamped-to-two-lines',
      description:
        'A long description that runs well past three lines so the card demonstrates its line-clamp behaviour and keeps every cell in the grid the same height regardless of content length.',
      tags: ['grass', 'poison', 'seed', 'overgrow', 'kanto'],
    },
  },
};
