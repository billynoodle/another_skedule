import React, { useState } from 'react';
import { Job } from '../../../types/job';
import { Edit2 } from 'lucide-react';
import { EditJobModal } from '../EditJobModal';
import { StatusSelect } from '../StatusSelect';

interface JobDetailsTabProps {
  job: Job;
  onUpdateJob?: (job: Job) => void;
}

export function JobDetailsTab({ job, onUpdateJob }: JobDetailsTabProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleStatusChange = (newStatus: 'active' | 'completed' | 'on-hold') => {
    if (onUpdateJob) {
      onUpdateJob({
        ...job,
        status: newStatus,
        lastModified: new Date()
      });
    }
  };

  const infoFields = [
    { label: 'Client', value: job.client },
    { label: 'Project', value: job.project || 'Not specified' },
    { label: 'Section', value: job.section || 'Not specified' },
    { label: 'Reference', value: job.reference || 'Not specified' },
    { label: 'Address', value: job.address || 'Not specified' },
    { label: 'Drawing #', value: job.drawingNumber || 'Not specified' },
    { 
      label: 'Due Date', 
      value: job.dueDate ? new Date(job.dueDate).toLocaleDateString() : 'No due date' 
    }
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Status</h3>
              <StatusSelect 
                status={job.status} 
                onChange={handleStatusChange}
              />
            </div>
            {onUpdateJob && (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Edit2 className="w-4 h-4 mr-1.5" />
                Edit Job
              </button>
            )}
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Job Information</h3>
            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              {infoFields.map((field, index) => (
                <div key={index} className="border-l-2 border-gray-100 pl-4">
                  <dt className="text-sm font-medium text-gray-500">{field.label}</dt>
                  <dd className="mt-1">
                    <span className="text-sm text-gray-900">{field.value}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {onUpdateJob && isEditModalOpen && (
        <EditJobModal
          job={job}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={(updatedJob) => {
            onUpdateJob(updatedJob);
            setIsEditModalOpen(false);
          }}
        />
      )}
    </div>
  );
}