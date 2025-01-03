import React, { useState } from 'react';
import { X } from 'lucide-react';

interface FilterPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
}

export function FilterPopup({ isOpen, onClose, onApply }: FilterPopupProps) {
  const [filters, setFilters] = useState({
    mark: '',
    bar: '',
    minLength: '',
    maxLength: '',
    minWeight: '',
    maxWeight: ''
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="relative w-full max-w-md transform rounded-lg bg-white p-6 shadow-xl transition-all">
          <div className="absolute right-4 top-4">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>

          <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Schedule</h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Mark / Tag</label>
                <input
                  type="text"
                  value={filters.mark}
                  onChange={e => setFilters({ ...filters, mark: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="e.g., P1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bar</label>
                <input
                  type="text"
                  value={filters.bar}
                  onChange={e => setFilters({ ...filters, bar: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="e.g., Y16"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Length (mm)</label>
              <div className="mt-1 grid grid-cols-2 gap-4">
                <input
                  type="number"
                  value={filters.minLength}
                  onChange={e => setFilters({ ...filters, minLength: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Min"
                />
                <input
                  type="number"
                  value={filters.maxLength}
                  onChange={e => setFilters({ ...filters, maxLength: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Max"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
              <div className="mt-1 grid grid-cols-2 gap-4">
                <input
                  type="number"
                  value={filters.minWeight}
                  onChange={e => setFilters({ ...filters, minWeight: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Min"
                />
                <input
                  type="number"
                  value={filters.maxWeight}
                  onChange={e => setFilters({ ...filters, maxWeight: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onApply(filters);
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}