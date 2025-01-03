import React from 'react';
import { FileText, FileSpreadsheet, Download, Send, Save } from 'lucide-react';

interface MaterialScheduleActionsProps {
  selectedFormat: 'pdf' | 'csv' | 'xlsx';
  onFormatChange: (format: 'pdf' | 'csv' | 'xlsx') => void;
}

export function MaterialScheduleActions({ selectedFormat, onFormatChange }: MaterialScheduleActionsProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Format Selection */}
      <div className="flex items-center bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => onFormatChange('pdf')}
          className={`p-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
            selectedFormat === 'pdf'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>PDF</span>
        </button>
        <button
          onClick={() => onFormatChange('csv')}
          className={`p-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
            selectedFormat === 'csv'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>CSV</span>
        </button>
        <button
          onClick={() => onFormatChange('xlsx')}
          className={`p-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
            selectedFormat === 'xlsx'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Excel</span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
          <Download className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
          <Send className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
          <Save className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}