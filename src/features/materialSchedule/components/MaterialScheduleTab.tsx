import React, { useState, useCallback } from 'react';
import { Document } from '../../../types/document';
import { PdfViewer } from './PdfViewer';
import { TagPatternPanel } from './patterns/TagPatternPanel';
import { useViewerStore } from '../../../stores/viewerStore';
import { useAnnotationStore } from '../../../stores/annotationStore';
import { log } from '../../../utils/logger';

interface MaterialScheduleTabProps {
  document: Document;
  jobId: string;
}

export function MaterialScheduleTab({ document, jobId }: MaterialScheduleTabProps) {
  const [autoLinkEnabled, setAutoLinkEnabled] = useState(true);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const viewerStore = useViewerStore();
  const { selectedId } = useAnnotationStore();

  const handleAnnotationComplete = useCallback(() => {
    if (autoLinkEnabled) {
      viewerStore.setMode('select');
    }
  }, [autoLinkEnabled, viewerStore]);

  return (
    <div className="h-[calc(100vh-12rem)] flex">
      <div className={`flex-1 min-w-0 bg-white rounded-${isPanelCollapsed ? 'xl' : 'l-xl'} border border-gray-200`}>
        <PdfViewer
          document={document}
          jobId={jobId}
          documentId={document.id}
          onAnnotationComplete={handleAnnotationComplete}
        />
      </div>

      <TagPatternPanel
        documentId={document.id}
        isCollapsed={isPanelCollapsed}
        onCollapse={setIsPanelCollapsed}
        selectedAnnotationId={selectedId}
        autoLinkEnabled={autoLinkEnabled}
        onAutoLinkChange={setAutoLinkEnabled}
      />
    </div>
  );
}