import { log } from '../../../../utils/logger';

export function normalizeText(text: string): string {
  const normalized = text
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .replace(/[^A-Z0-9\-\s]/g, '');

  log('PatternNormalizer', 'Text normalized', { 
    original: text, 
    normalized 
  });

  return normalized;
}

export function normalizePrefix(prefix: string): string {
  const normalized = prefix
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9\-]/g, '');

  log('PatternNormalizer', 'Prefix normalized', {
    original: prefix,
    normalized
  });

  return normalized;
}