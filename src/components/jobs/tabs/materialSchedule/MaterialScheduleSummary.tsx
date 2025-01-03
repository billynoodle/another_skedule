import React from 'react';
import { Scale, Ruler } from 'lucide-react';

interface MaterialScheduleSummaryProps {
  jobId: string;
  documentId: string;
}

export function MaterialScheduleSummary({ jobId, documentId }: MaterialScheduleSummaryProps) {
  // Calculate totals from dummy data
  const totalLength = 18800; // Sum of all lengths
  const totalWeight = 142.6; // Sum of all weights

  return (
    <div className="mt-8 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-5">
        <h3 className="text-lg font-medium text-gray-900">Summary</h3>
        <p className="mt-1 text-sm text-gray-500">Total quantities and measurements</p>
      </div>
      
      <div className="border-t border-gray-200 bg-white">
        <dl className="grid grid-cols-2 divide-x divide-gray-200">
          <div className="px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Ruler className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Total Length</dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900">
                  {totalLength.toLocaleString()} <span className="text-sm font-normal text-gray-500">mm</span>
                </dd>
              </div>
            </div>
          </div>
          
          <div className="px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Scale className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Total Weight</dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900">
                  {totalWeight.toLocaleString()} <span className="text-sm font-normal text-gray-500">kg</span>
                </dd>
              </div>
            </div>
          </div>
        </dl>
      </div>
    </div>
  );
}