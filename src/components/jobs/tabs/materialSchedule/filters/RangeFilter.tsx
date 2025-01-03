import React from 'react';

interface RangeFilterProps {
  label: string;
  unit: string;
  value: { min: string; max: string };
  onChange: (value: { min: string; max: string }) => void;
  error?: string;
}

export function RangeFilter({ label, unit, value, onChange, error }: RangeFilterProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} ({unit})
      </label>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            type="number"
            value={value.min}
            onChange={(e) => onChange({ ...value, min: e.target.value })}
            className={`
              block w-full rounded-lg border px-3 py-2 text-sm
              ${error 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }
            `}
            placeholder="Min"
          />
        </div>
        <div>
          <input
            type="number"
            value={value.max}
            onChange={(e) => onChange({ ...value, max: e.target.value })}
            className={`
              block w-full rounded-lg border px-3 py-2 text-sm
              ${error 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }
            `}
            placeholder="Max"
          />
        </div>
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}