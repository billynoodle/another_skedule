import { FilterState } from '../types/filters';

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateFilters(filters: FilterState): ValidationResult {
  const errors: Record<string, string> = {};

  // Validate mark/tag format
  if (filters.mark && !/^[A-Z0-9]+$/i.test(filters.mark)) {
    errors.mark = 'Invalid mark format';
  }

  // Validate bar format (e.g., Y16, R12)
  if (filters.bar && !/^[A-Z][0-9]+$/i.test(filters.bar)) {
    errors.bar = 'Invalid bar format (e.g., Y16)';
  }

  // Validate length range
  if (filters.length.min && filters.length.max) {
    const min = Number(filters.length.min);
    const max = Number(filters.length.max);
    if (min > max) {
      errors.length = 'Min length cannot be greater than max';
    }
  }

  // Validate weight range
  if (filters.weight.min && filters.weight.max) {
    const min = Number(filters.weight.min);
    const max = Number(filters.weight.max);
    if (min > max) {
      errors.weight = 'Min weight cannot be greater than max';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}