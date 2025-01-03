import React from 'react';
import { Play } from 'lucide-react';

interface ProcessButtonProps {
  onProcess: () => void;
  disabled?: boolean;
}

export function ProcessButton({ onProcess, disabled }: ProcessButtonProps) {
  return (
    <button
      onClick={onProcess}
      disabled={disabled}
      className={`
        w-full flex items-center justify-center gap-2 px-4 py-3 
        text-sm font-medium rounded-lg transition-all duration-200
        ${disabled 
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md'
        }
      `}
    >
      <Play className="w-4 h-4" />
      <span>Process Annotations</span>
    </button>
  );
}