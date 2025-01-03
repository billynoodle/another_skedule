import React from 'react';
import { FileText, Download, Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface SavedSchedule {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  format: 'pdf' | 'csv' | 'xlsx';
}

interface SavedScheduleCardProps {
  schedule: SavedSchedule;
  onDownload: (id: string) => void;
  onDelete: (id: string) => void;
}

export function SavedScheduleCard({ schedule, onDownload, onDelete }: SavedScheduleCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">{schedule.name}</h3>
            {schedule.description && (
              <p className="mt-1 text-sm text-gray-500">{schedule.description}</p>
            )}
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{format(schedule.createdAt, 'MMM d, yyyy')}</span>
              <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 uppercase">
                {schedule.format}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onDownload(schedule.id)}
            className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(schedule.id)}
            className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}