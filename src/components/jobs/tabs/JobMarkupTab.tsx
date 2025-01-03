import React, { useState, useCallback } from 'react';
import { PdfViewer } from '../../../features/materialSchedule/components/PdfViewer';
import { PatternPanel } from '../../../features/materialSchedule/components/patterns/PatternPanel';
import { useTagPatterns } from '../../../features/materialSchedule/hooks/useTagPatterns';
import { useAnnotationStore } from '../../../stores/annotationStore';
import { Document } from '../../../types/document';
import { log } from '../../../utils/logger';

interface JobMarkupTabProps {
  document: Document;
  jobId: string;
}

export function JobMarkupTab({ document, jobId }: JobMarkupTabProps) {
  const [autoLinkEnabled, setAutoLinkEnabled] = useState(true);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [showPatternForm, setShowPatternForm] = useState(false);
  const { selectedId } = useAnnotationStore();

  const {
    patterns,
    loading,
    error,
    linkedPatterns,
    savePattern,
    updatePattern,
    deletePattern,
    linkPattern,
    setHoveredPattern
  } = useTagPatterns(document.id);

  const handleAnnotationComplete = useCallback(() => {
    if (autoLinkEnabled) {
      setShowPatternForm(true);
      log('JobMarkup', 'Auto-link enabled, showing pattern form');
    }
  }, [autoLinkEnabled]);

  const handleProcess = useCallback(() => {
    log('JobMarkup', 'Processing annotations');
    // Process annotations logic will be implemented here
  }, []);

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

      <PatternPanel
        patterns={patterns}
        selectedAnnotationId={selectedId}
        linkedPatterns={linkedPatterns}
        loading={loading}
        error={error}
        autoLinkEnabled={autoLinkEnabled}
        onAutoLinkChange={setAutoLinkEnabled}
        onSavePattern={savePattern}
        onUpdatePattern={updatePattern}
        onDeletePattern={deletePattern}
        onLinkPattern={linkPattern}
        onHoverPattern={setHoveredPattern}
        isCollapsed={isPanelCollapsed}
        onCollapse={setIsPanelCollapsed}
        showPatternForm={showPatternForm}
        onPatternFormClose={() => setShowPatternForm(false)}
        onAddPattern={() => setShowPatternForm(true)}
        onProcess={handleProcess}
      />
    </div>
  );
}