import React from 'react';
import { X } from 'lucide-react';
import { Filter } from '../../../types/filters';

interface FilterBarProps {
  activeFilters: Filter[];
  onRemoveFilter: (id: string) => void;
  onClearFilters: () => void;
}

export function FilterBar({ activeFilters, onRemoveFilter, onClearFilters }: FilterBarProps) {
  if (activeFilters.length === 0) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 border-b border-gray-200">
      <div className="flex flex-wrap gap-2 flex-1">
        {activeFilters.map(filter => (
          <div
            key={filter.id}
            className="flex items-center gap-2 px-2 py-1 bg-white rounded-lg border border-gray-200 text-sm"
          >
            <span className="font-medium text-gray-600">{filter.field}:</span>
            <span className="text-gray-900">{filter.display}</span>
            <button
              onClick={() => onRemoveFilter(filter.id)}
              className="p-0.5 hover:bg-gray-100 rounded-md text-gray-400 hover:text-gray-600"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={onClearFilters}
        className="text-sm text-gray-600 hover:text-gray-900"
      >
        Clear all
      </button>
    </div>
  );
}