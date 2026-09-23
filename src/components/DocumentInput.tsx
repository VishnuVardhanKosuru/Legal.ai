'use client';

import React from 'react';
import { FileText, GitCompareArrows } from 'lucide-react';

interface DocumentInputProps {
  documentText: string;
  onDocumentChange: (text: string) => void;
  documentBText: string;
  onDocumentBChange: (text: string) => void;
  compareMode: boolean;
  onToggleCompare: () => void;
}

/**
 * DocumentInput — Left pane of the app.
 * Handles single-document input and an optional comparison mode
 * that reveals a second document textarea.
 */
export default function DocumentInput({
  documentText,
  onDocumentChange,
  documentBText,
  onDocumentBChange,
  compareMode,
  onToggleCompare,
}: DocumentInputProps) {
  return (
    <section className="pane glass" aria-label="Legal Document Input">
      <div className="document-header">
        <FileText size={18} />
        <span>{compareMode ? 'Document A' : 'Document Text'}</span>
        <button
          className="compare-toggle-btn"
          onClick={onToggleCompare}
          aria-label={compareMode ? 'Disable comparison mode' : 'Enable comparison mode'}
          title={compareMode ? 'Disable comparison mode' : 'Compare two documents'}
        >
          <GitCompareArrows size={16} />
          {compareMode ? 'Single Mode' : 'Compare'}
        </button>
      </div>

      <div className={`document-body ${compareMode ? 'compare-active' : ''}`}>
        <textarea
          id="document-input-a"
          className="document-input"
          placeholder="Paste your legal document, contract, or policy here..."
          value={documentText}
          onChange={(e) => onDocumentChange(e.target.value)}
          aria-label="Paste legal document text here"
        />

        {compareMode && (
          <>
            <div className="compare-divider">
              <span>VS</span>
            </div>
            <textarea
              id="document-input-b"
              className="document-input"
              placeholder="Paste the second document here for comparison..."
              value={documentBText}
              onChange={(e) => onDocumentBChange(e.target.value)}
              aria-label="Paste second legal document for comparison"
            />
          </>
        )}
      </div>
    </section>
  );
}
