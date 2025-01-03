import React, { useState } from 'react';
import { CheckCircle, PauseCircle, PlayCircle, ChevronDown } from 'lucide-react';
import { getStatusColor } from '../../utils/jobUtils';

interface StatusSelectProps {
  status: 'active' | 'completed' | 'on-hold';
  onChange: (status: 'active' | 'completed' | 'on-hold') => void;
}

export function StatusSelect({ status, onChange }: StatusSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const statusOptions = [
    { value: 'active', label: 'Active', icon: PlayCircle },
    { value: 'completed', label: 'Completed', icon: CheckCircle },
    { value: 'on-hold', label: 'On Hold', icon: PauseCircle }
  ] as const;

  const selectedOption = statusOptions.find(option => option.value === status);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          inline-flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors
          ${getStatusColor(status)} hover:bg-opacity-80
        `}
      >
        {selectedOption && (
          <>
            <selectedOption.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{selectedOption.label}</span>
            <ChevronDown className="w-4 h-4 ml-1" />
          </>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-20">
            <div className="py-1">
              {statusOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-2 px-4 py-2 text-sm
                    ${status === option.value ? 'bg-gray-100' : 'hover:bg-gray-50'}
                    ${status === option.value ? 'font-medium' : 'font-normal'}
                  `}
                >
                  <option.icon 
                    className={`
                      w-4 h-4
                      ${option.value === 'active' && 'text-green-600'}
                      ${option.value === 'completed' && 'text-blue-600'}
                      ${option.value === 'on-hold' && 'text-yellow-600'}
                    `}
                  />
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}