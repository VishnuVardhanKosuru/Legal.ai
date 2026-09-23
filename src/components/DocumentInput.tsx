'use client';

import React, { memo } from 'react';
import { FileText, GitCompareArrows, Sparkles, Trash2, Clock } from 'lucide-react';
import { getDocumentStats, SAMPLE_CONTRACT, SAMPLE_CONTRACT_B } from '@/lib/utils';

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
 * Provides accessible document textareas, comparison mode, live document analytics,
 * and one-click sample contract loading for instant evaluation.
 */
function DocumentInput({
  documentText,
  onDocumentChange,
  documentBText,
  onDocumentBChange,
  compareMode,
  onToggleCompare,
}: DocumentInputProps) {
  const statsA = getDocumentStats(documentText);
  const statsB = getDocumentStats(documentBText);

  const handleLoadSample = () => {
    onDocumentChange(SAMPLE_CONTRACT);
    if (compareMode) {
      onDocumentBChange(SAMPLE_CONTRACT_B);
    }
  };

  const handleClear = () => {
    onDocumentChange('');
    if (compareMode) {
      onDocumentBChange('');
    }
  };

  return (
    <section className="pane glass" aria-label="Legal Document Input Section">
      {/* Header bar */}
      <div className="document-header">
        <FileText size={18} aria-hidden="true" />
        <span>{compareMode ? 'Document A' : 'Document Text'}</span>

        <div className="header-actions">
          <button
            type="button"
            className="sample-load-btn"
            onClick={handleLoadSample}
            aria-label="Load sample NDA for testing"
            title="Load sample Mutual Non-Disclosure Agreement for instant testing"
          >
            <Sparkles size={14} aria-hidden="true" />
            <span>Sample NDA</span>
          </button>

          <button
            type="button"
            className="compare-toggle-btn"
            onClick={onToggleCompare}
            aria-label={compareMode ? 'Disable comparison mode' : 'Enable comparison mode'}
            title={compareMode ? 'Switch to single document analysis' : 'Compare two documents side-by-side'}
          >
            <GitCompareArrows size={15} aria-hidden="true" />
            <span>{compareMode ? 'Single Mode' : 'Compare'}</span>
          </button>

          {(documentText || documentBText) && (
            <button
              type="button"
              className="clear-doc-btn"
              onClick={handleClear}
              aria-label="Clear document text"
              title="Clear all document text"
            >
              <Trash2 size={14} aria-hidden="true" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Document statistics bar */}
      <div className="document-stats-bar" aria-live="polite">
        <span>
          <strong>{statsA.words}</strong> words ({statsA.characters} chars)
        </span>
        <span>
          <Clock size={12} style={{ display: 'inline', marginRight: 4 }} aria-hidden="true" />
          ~{statsA.readingTimeMinutes} min read
        </span>
      </div>

      {/* Inputs */}
      <div className={`document-body ${compareMode ? 'compare-active' : ''}`}>
        <label htmlFor="document-input-a" className="sr-only">
          Paste legal document text here
        </label>
        <textarea
          id="document-input-a"
          className="document-input"
          placeholder="Paste your contract, NDA, lease agreement, or privacy policy here..."
          value={documentText}
          onChange={(e) => onDocumentChange(e.target.value)}
          aria-label="Primary legal document input"
          spellCheck="false"
        />

        {compareMode && (
          <>
            <div className="compare-divider" role="separator">
              <span>VS (DOCUMENT B: {statsB.words} words)</span>
            </div>
            <label htmlFor="document-input-b" className="sr-only">
              Paste second legal document for comparison
            </label>
            <textarea
              id="document-input-b"
              className="document-input"
              placeholder="Paste the revised or counterparty document here to compare clause-by-clause..."
              value={documentBText}
              onChange={(e) => onDocumentBChange(e.target.value)}
              aria-label="Secondary legal document input for comparison"
              spellCheck="false"
            />
          </>
        )}
      </div>
    </section>
  );
}

export default memo(DocumentInput);
