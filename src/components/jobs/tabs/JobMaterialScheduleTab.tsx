import React, { useState } from 'react';
import { MaterialScheduleHeader } from './materialSchedule/MaterialScheduleHeader';
import { MaterialScheduleTable } from './materialSchedule/MaterialScheduleTable';
import { MaterialScheduleSummary } from './materialSchedule/MaterialScheduleSummary';
import { SavedSchedules } from './materialSchedule/SavedSchedules';
import { FilterPopup } from './materialSchedule/popups/FilterPopup';
import { SendPopup } from './materialSchedule/popups/SendPopup';
import { SavePopup } from './materialSchedule/popups/SavePopup';
import { Document } from '../../../types/document';

interface JobMaterialScheduleTabProps {
  document: Document;
  jobId: string;
}

export function JobMaterialScheduleTab({ document, jobId }: JobMaterialScheduleTabProps) {
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'csv' | 'xlsx'>('pdf');
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [showSendPopup, setShowSendPopup] = useState(false);
  const [showSavePopup, setShowSavePopup] = useState(false);

  const handleFilter = (filters: any) => {
    console.log('Applying filters:', filters);
  };

  const handleSend = (data: { email: string; message: string }) => {
    console.log('Sending schedule:', data);
  };

  const handleSave = (data: { name: string; description: string }) => {
    console.log('Saving schedule:', data);
  };

  return (
    <div className="h-[calc(100vh-12rem)] bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
      <MaterialScheduleHeader 
        selectedFormat={selectedFormat}
        onFormatChange={setSelectedFormat}
        onFilter={() => setShowFilterPopup(true)}
      />

      <div className="flex-1 overflow-auto p-6 space-y-8">
        <MaterialScheduleTable jobId={jobId} documentId={document.id} />
        <MaterialScheduleSummary jobId={jobId} documentId={document.id} />
        <SavedSchedules jobId={jobId} documentId={document.id} />
      </div>

      <FilterPopup
        isOpen={showFilterPopup}
        onClose={() => setShowFilterPopup(false)}
        onApply={handleFilter}
      />

      <SendPopup
        isOpen={showSendPopup}
        onClose={() => setShowSendPopup(false)}
        onSend={handleSend}
      />

      <SavePopup
        isOpen={showSavePopup}
        onClose={() => setShowSavePopup(false)}
        onSave={handleSave}
      />
    </div>
  );
}