import React from 'react';
import { useAnnotationStore } from '../../../../stores/annotationStore';

interface MaterialScheduleTableProps {
  jobId: string;
  documentId: string;
}

export function MaterialScheduleTable({ jobId, documentId }: MaterialScheduleTableProps) {
  const { getDocumentState } = useAnnotationStore();
  const { annotations } = getDocumentState(jobId, documentId);

  // Dummy data for demonstration
  const dummyData = [
    { mark: 'P1', bar: 'Y16', qty: 4, length: 3600, weight: 22.8, comments: 'Ground floor' },
    { mark: 'P2', bar: 'Y20', qty: 6, length: 4200, weight: 41.2, comments: 'First floor' },
    { mark: 'P3', bar: 'Y25', qty: 2, length: 5000, weight: 38.6, comments: 'Column reinforcement' },
    { mark: 'B1', bar: 'Y12', qty: 8, length: 2800, weight: 19.8, comments: 'Beam ties' },
    { mark: 'B2', bar: 'Y16', qty: 4, length: 3200, weight: 20.2, comments: 'Main bars' }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th scope="col" className="sticky top-0 z-10 bg-gray-50 px-6 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mark / Tag
                  </span>
                </div>
              </th>
              <th scope="col" className="sticky top-0 z-10 bg-gray-50 px-6 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bar
                  </span>
                </div>
              </th>
              <th scope="col" className="sticky top-0 z-10 bg-gray-50 px-6 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    QTY
                  </span>
                </div>
              </th>
              <th scope="col" className="sticky top-0 z-10 bg-gray-50 px-6 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Length
                  </span>
                </div>
              </th>
              <th scope="col" className="sticky top-0 z-10 bg-gray-50 px-6 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Weight
                  </span>
                </div>
              </th>
              <th scope="col" className="sticky top-0 z-10 bg-gray-50 px-6 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comments
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dummyData.map((row, index) => (
              <tr 
                key={index} 
                className="hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900">{row.mark}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{row.bar}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{row.qty}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{row.length}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{row.weight}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{row.comments}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}