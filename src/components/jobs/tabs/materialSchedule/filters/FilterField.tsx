import React from 'react';
import { ChevronDown } from 'lucide-react';

interface FilterFieldProps {
  label: string;
  value: string | number;
  type?: 'text' | 'number';
  placeholder?: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  suggestions?: string[];
  error?: string;
}

export function FilterField({
  label,
  value,
  type = 'text',
  placeholder,
  onChange,
  onFocus,
  suggestions,
  error
}: FilterFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          className={`
            block w-full rounded-lg border px-3 py-2 text-sm
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }
            ${suggestions ? 'pr-8' : ''}
          `}
          placeholder={placeholder}
        />
        {suggestions && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}