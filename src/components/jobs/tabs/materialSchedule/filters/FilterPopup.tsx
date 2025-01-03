import React, { useState } from 'react';
import { X } from 'lucide-react';
import { FilterGroup } from './FilterGroup';
import { FilterField } from './FilterField';
import { RangeFilter } from './RangeFilter';
import { Filter } from '../../../types/filters';
import { validateFilters } from '../../../utils/filterValidation';

interface FilterPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: Filter[]) => void;
  existingFilters?: Filter[];
}

export function FilterPopup({ isOpen, onClose, onApply, existingFilters = [] }: FilterPopupProps) {
  const [filters, setFilters] = useState({
    mark: '',
    bar: '',
    length: { min: '', max: '' },
    weight: { min: '', max: '' }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleApply = () => {
    const validationResult = validateFilters(filters);
    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      return;
    }

    const activeFilters: Filter[] = [];

    if (filters.mark) {
      activeFilters.push({
        id: crypto.randomUUID(),
        field: 'mark',
        value: filters.mark,
        display: filters.mark,
        type: 'text'
      });
    }

    if (filters.bar) {
      activeFilters.push({
        id: crypto.randomUUID(),
        field: 'bar',
        value: filters.bar,
        display: filters.bar,
        type: 'text'
      });
    }

    if (filters.length.min || filters.length.max) {
      activeFilters.push({
        id: crypto.randomUUID(),
        field: 'length',
        value: { min: filters.length.min, max: filters.length.max },
        display: `${filters.length.min || '0'} - ${filters.length.max || '∞'} mm`,
        type: 'range'
      });
    }

    if (filters.weight.min || filters.weight.max) {
      activeFilters.push({
        id: crypto.randomUUID(),
        field: 'weight',
        value: { min: filters.weight.min, max: filters.weight.max },
        display: `${filters.weight.min || '0'} - ${filters.weight.max || '∞'} kg`,
        type: 'range'
      });
    }

    onApply(activeFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="relative w-full max-w-lg transform rounded-xl bg-white shadow-xl transition-all">
          <div className="absolute right-4 top-4">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Filter Schedule</h3>

            <div className="space-y-6">
              <FilterGroup label="Identification">
                <div className="grid grid-cols-2 gap-4">
                  <FilterField
                    label="Mark / Tag"
                    value={filters.mark}
                    onChange={(value) => {
                      setFilters(prev => ({ ...prev, mark: value }));
                      setErrors(prev => ({ ...prev, mark: '' }));
                    }}
                    error={errors.mark}
                    placeholder="e.g., P1"
                  />
                  <FilterField
                    label="Bar"
                    value={filters.bar}
                    onChange={(value) => {
                      setFilters(prev => ({ ...prev, bar: value }));
                      setErrors(prev => ({ ...prev, bar: '' }));
                    }}
                    error={errors.bar}
                    placeholder="e.g., Y16"
                  />
                </div>
              </FilterGroup>

              <FilterGroup label="Measurements">
                <RangeFilter
                  label="Length"
                  unit="mm"
                  value={filters.length}
                  onChange={(value) => {
                    setFilters(prev => ({ ...prev, length: value }));
                    setErrors(prev => ({ ...prev, length: '' }));
                  }}
                  error={errors.length}
                />
                <RangeFilter
                  label="Weight"
                  unit="kg"
                  value={filters.weight}
                  onChange={(value) => {
                    setFilters(prev => ({ ...prev, weight: value }));
                    setErrors(prev => ({ ...prev, weight: '' }));
                  }}
                  error={errors.weight}
                />
              </FilterGroup>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}