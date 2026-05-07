import { readFileSync } from 'fs';
import { join } from 'path';
import * as yaml from 'js-yaml';
import type { SiteItem } from './types';

export interface FieldSchema {
  source: string;
  type: 'string' | 'url' | 'integer' | 'number';
  required: boolean;
}

export interface Schema {
  fields: Record<string, FieldSchema>;
}

function isValidUrl(val: string): boolean {
  try {
    new URL(val);
    return true;
  } catch {
    return false;
  }
}

function passesTypeCheck(val: string, type: FieldSchema['type']): boolean {
  switch (type) {
    case 'string':  return true;
    case 'url':     return isValidUrl(val);
    case 'integer': return /^-?\d+$/.test(val.trim());
    case 'number':  return val.trim() !== '' && !isNaN(Number(val));
  }
}

export function validateAndMap(
  rows: Record<string, unknown>[],
  schema: Schema,
): SiteItem[] {
  const schemaEntries = Object.entries(schema.fields);
  const mappedSourceKeys = new Set(schemaEntries.map(([, f]) => f.source));

  return rows.flatMap(row => {
    const rawId = String(row[schema.fields.id?.source ?? 'id'] ?? '');

    for (const [, fieldDef] of schemaEntries) {
      const rawVal = String(row[fieldDef.source] ?? '');
      if (fieldDef.required && !rawVal) {
        console.warn(`[loader] Skipping row "${rawId}": field "${fieldDef.source}" is required`);
        return [];
      }
      if (rawVal && !passesTypeCheck(rawVal, fieldDef.type)) {
        console.warn(`[loader] Skipping row "${rawId}": field "${fieldDef.source}" failed type check "${fieldDef.type}"`);
        return [];
      }
    }

    const extras: Record<string, string> = {};
    for (const [key, val] of Object.entries(row)) {
      if (!mappedSourceKeys.has(key)) {
        extras[key] = String(val ?? '');
      }
    }

    const get = (f: FieldSchema | undefined) => String(row[f?.source ?? ''] ?? '');
    const f = schema.fields;

    const tagsRaw = get(f.tags);
    const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];

    return [{
      id:          get(f.id),
      title:       get(f.title),
      image:       get(f.image),
      description: get(f.description),
      tags,
      extras,
    }];
  });
}

let _cache: SiteItem[] | null = null;

export function getItems(): SiteItem[] {
  if (_cache) return _cache;

  const schemaPath = join(process.cwd(), 'src/config/schema.yaml');
  const dataPath   = join(process.cwd(), 'src/data/items.yaml');

  const schema = yaml.load(readFileSync(schemaPath, 'utf-8')) as Schema;
  const rows   = yaml.load(readFileSync(dataPath,   'utf-8')) as Record<string, unknown>[];

  _cache = validateAndMap(rows, schema);
  return _cache;
}

export function getItem(id: string): SiteItem | undefined {
  return getItems().find(item => item.id === id);
}
