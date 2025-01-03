import React from 'react';
import { SavedScheduleCard } from './SavedScheduleCard';

// Dummy data for demonstration
const DUMMY_SCHEDULES = [
  {
    id: '1',
    name: 'Ground Floor Schedule',
    description: 'Material schedule for ground floor reinforcement',
    createdAt: new Date('2024-02-15'),
    format: 'pdf' as const
  },
  {
    id: '2',
    name: 'First Floor Schedule',
    description: 'First floor reinforcement details',
    createdAt: new Date('2024-02-14'),
    format: 'xlsx' as const
  },
  {
    id: '3',
    name: 'Column Schedule',
    createdAt: new Date('2024-02-13'),
    format: 'csv' as const
  }
];

interface SavedSchedulesProps {
  jobId: string;
  documentId: string;
}

export function SavedSchedules({ jobId, documentId }: SavedSchedulesProps) {
  const handleDownload = (scheduleId: string) => {
    console.log('Downloading schedule:', scheduleId);
  };

  const handleDelete = (scheduleId: string) => {
    console.log('Deleting schedule:', scheduleId);
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Saved Schedules</h3>
      <div className="grid grid-cols-1 gap-4">
        {DUMMY_SCHEDULES.map(schedule => (
          <SavedScheduleCard
            key={schedule.id}
            schedule={schedule}
            onDownload={handleDownload}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}