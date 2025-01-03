import { TagPattern } from '../../types/patterns';
import { log } from '../../../../utils/logger';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validatePattern(pattern: TagPattern): ValidationResult {
  const errors: string[] = [];

  // Validate prefix
  if (!pattern.prefix) {
    errors.push('Pattern prefix is required');
  } else if (pattern.prefix.length > 10) {
    errors.push('Pattern prefix must be 10 characters or less');
  }

  // Validate schedule table
  if (!pattern.scheduleTable) {
    errors.push('Schedule table name is required');
  }

  // Validate description
  if (pattern.description && pattern.description.length > 200) {
    errors.push('Description must be 200 characters or less');
  }

  const isValid = errors.length === 0;
  log('PatternValidator', 'Pattern validation', { isValid, errors });

  return { isValid, errors };
}

export function validatePatternSet(patterns: TagPattern[]): ValidationResult {
  const errors: string[] = [];
  const prefixes = new Set<string>();

  patterns.forEach(pattern => {
    // Check for duplicate prefixes
    if (prefixes.has(pattern.prefix.toUpperCase())) {
      errors.push(`Duplicate prefix found: ${pattern.prefix}`);
    }
    prefixes.add(pattern.prefix.toUpperCase());

    // Validate individual pattern
    const { errors: patternErrors } = validatePattern(pattern);
    errors.push(...patternErrors);
  });

  const isValid = errors.length === 0;
  log('PatternValidator', 'Pattern set validation', { 
    isValid, 
    patternCount: patterns.length,
    errors 
  });

  return { isValid, errors };
}