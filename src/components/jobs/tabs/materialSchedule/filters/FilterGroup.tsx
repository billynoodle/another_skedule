import React from 'react';

interface FilterGroupProps {
  label: string;
  children: React.ReactNode;
}

export function FilterGroup({ label, children }: FilterGroupProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-900">{label}</h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}