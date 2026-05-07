import { describe, it, expect, vi } from 'vitest';
import { validateAndMap } from './loader';

const schema = {
  fields: {
    id:          { source: 'id',                    type: 'string'  as const, required: true },
    title:       { source: 'name',                  type: 'string'  as const, required: true },
    image:       { source: 'sprites_front_default', type: 'url'     as const, required: false },
    description: { source: 'species_url',           type: 'string'  as const, required: false },
    tags:        { source: 'types',                 type: 'string'  as const, required: false },
  },
};

describe('validateAndMap', () => {
  it('maps source fields to canonical SiteItem fields', () => {
    const rows = [{
      id: '1',
      name: 'bulbasaur',
      sprites_front_default: 'https://example.com/1.png',
      species_url: 'https://pokeapi.co/api/v2/pokemon-species/1/',
      types: 'grass,poison',
    }];

    const [item] = validateAndMap(rows, schema);

    expect(item.id).toBe('1');
    expect(item.title).toBe('bulbasaur');
    expect(item.image).toBe('https://example.com/1.png');
    expect(item.description).toBe('https://pokeapi.co/api/v2/pokemon-species/1/');
    expect(item.tags).toEqual(['grass', 'poison']);
  });

  it('collects unmapped fields into extras', () => {
    const rows = [{ id: '1', name: 'bulbasaur', weight: '69', height: '7' }];

    const [item] = validateAndMap(rows, schema);

    expect(item.extras).toEqual({ weight: '69', height: '7' });
  });

  it('skips rows missing a required field and warns', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const rows = [{ id: '2', name: '' }];

    const result = validateAndMap(rows, schema);

    expect(result).toHaveLength(0);
    expect(warn).toHaveBeenCalledWith(
      '[loader] Skipping row "2": field "name" is required'
    );
    warn.mockRestore();
  });

  it('skips rows where a url field contains a non-URL value and warns', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const rows = [{
      id: '3',
      name: 'charmander',
      sprites_front_default: 'not-a-url',
    }];

    const result = validateAndMap(rows, schema);

    expect(result).toHaveLength(0);
    expect(warn).toHaveBeenCalledWith(
      '[loader] Skipping row "3": field "sprites_front_default" failed type check "url"'
    );
    warn.mockRestore();
  });

  it('allows optional fields to be absent (empty string default)', () => {
    const rows = [{ id: '4', name: 'squirtle' }];

    const [item] = validateAndMap(rows, schema);

    expect(item.id).toBe('4');
    expect(item.title).toBe('squirtle');
    expect(item.image).toBe('');
    expect(item.description).toBe('');
    expect(item.tags).toEqual([]);
  });

  it('handles integer type validation', () => {
    const intSchema = {
      fields: {
        id:          { source: 'id',    type: 'string'  as const, required: true },
        title:       { source: 'name',  type: 'string'  as const, required: true },
        image:       { source: 'score', type: 'integer' as const, required: false },
        description: { source: 'desc',  type: 'string'  as const, required: false },
        tags:        { source: 'tags',  type: 'string'  as const, required: false },
      },
    };
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const rows = [{ id: '5', name: 'pikachu', score: '3.14' }];

    const result = validateAndMap(rows, intSchema);

    expect(result).toHaveLength(0);
    expect(warn).toHaveBeenCalledWith(
      '[loader] Skipping row "5": field "score" failed type check "integer"'
    );
    warn.mockRestore();
  });

  it('splits comma-separated tags and trims whitespace', () => {
    const rows = [{ id: '6', name: 'gengar', types: 'ghost, poison , shadow ' }];

    const [item] = validateAndMap(rows, schema);

    expect(item.tags).toEqual(['ghost', 'poison', 'shadow']);
  });
});
