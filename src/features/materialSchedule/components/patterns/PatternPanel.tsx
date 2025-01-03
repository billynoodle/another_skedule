import React from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { TagPatternList } from './TagPatternList';
import { TagPatternForm } from './TagPatternForm';
import { ProcessButton } from './ProcessButton';
import { AutoLinkToggle } from './AutoLinkToggle';
import { TagPattern } from '../../types/patterns';

interface PatternPanelProps {
  patterns: TagPattern[];
  selectedAnnotationId: string | null;
  linkedPatterns: Record<string, string[]>;
  loading: boolean;
  error: string | null;
  autoLinkEnabled: boolean;
  onAutoLinkChange: (enabled: boolean) => void;
  onSavePattern: (pattern: Omit<TagPattern, 'id'>) => Promise<void>;
  onUpdatePattern: (pattern: TagPattern) => Promise<void>;
  onDeletePattern: (patternId: string) => Promise<void>;
  onLinkPattern: (patternId: string) => Promise<void>;
  onHoverPattern?: (annotationIds: string[] | null) => void;
  isCollapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  showPatternForm?: boolean;
  onPatternFormClose?: () => void;
  onAddPattern?: () => void;
  onProcess?: () => void;
}

export function PatternPanel({
  patterns,
  selectedAnnotationId,
  linkedPatterns,
  loading,
  error,
  autoLinkEnabled,
  onAutoLinkChange,
  onSavePattern,
  onUpdatePattern,
  onDeletePattern,
  onLinkPattern,
  onHoverPattern,
  isCollapsed = false,
  onCollapse,
  showPatternForm = false,
  onPatternFormClose,
  onAddPattern,
  onProcess
}: PatternPanelProps) {
  if (isCollapsed) {
    return (
      <button
        onClick={() => onCollapse?.(false)}
        className="w-8 bg-white border-l border-gray-200 hover:bg-gray-50 flex items-center justify-center"
      >
        <ChevronLeft className="w-5 h-5 text-gray-400" />
      </button>
    );
  }

  return (
    <div className="w-96 bg-white rounded-r-xl border-t border-r border-b border-gray-200">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-medium text-gray-900">Tag Patterns</h2>
            <div className="flex items-center gap-2">
              <AutoLinkToggle 
                enabled={autoLinkEnabled}
                onChange={onAutoLinkChange}
              />
              <button
                onClick={onAddPattern}
                className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                title="Add new pattern"
              >
                <Plus className="w-5 h-5" />
              </button>
              {onCollapse && (
                <button
                  onClick={() => onCollapse(true)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"
                  title="Collapse panel"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-auto p-4">
          {showPatternForm ? (
            <TagPatternForm
              onSave={onSavePattern}
              onCancel={onPatternFormClose}
            />
          ) : (
            <TagPatternList
              patterns={patterns}
              selectedAnnotationId={selectedAnnotationId}
              linkedPatterns={linkedPatterns}
              loading={loading}
              error={error}
              onLinkPattern={onLinkPattern}
              onUpdatePattern={onUpdatePattern}
              onDeletePattern={onDeletePattern}
              onHoverPattern={onHoverPattern}
            />
          )}
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
          <ProcessButton 
            onProcess={onProcess || (() => {})}
            disabled={patterns.length === 0 || loading}
          />
        </div>
      </div>
    </div>
  );
}