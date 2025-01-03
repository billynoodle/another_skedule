import React from 'react';
import { FileText, FileSpreadsheet, Download, Send, Save, Filter } from 'lucide-react';

interface MaterialScheduleHeaderProps {
  selectedFormat: 'pdf' | 'csv' | 'xlsx';
  onFormatChange: (format: 'pdf' | 'csv' | 'xlsx') => void;
  onFilter: () => void;
}

export function MaterialScheduleHeader({ selectedFormat, onFormatChange, onFilter }: MaterialScheduleHeaderProps) {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-medium text-gray-900">Material Schedule</h2>
          <button
            onClick={onFilter}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Format Selection */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onFormatChange('pdf')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${
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
              className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${
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
              className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${
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
          <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
            <button 
              className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>
            <button 
              className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
              title="Send"
            >
              <Send className="w-5 h-5" />
            </button>
            <button 
              className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
              title="Save"
            >
              <Save className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}