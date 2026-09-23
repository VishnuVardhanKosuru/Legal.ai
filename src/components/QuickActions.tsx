'use client';

import React, { memo } from 'react';
import {
  BookOpen,
  AlertTriangle,
  CheckSquare,
  AlertCircle,
  ListChecks,
  GitCompareArrows,
} from 'lucide-react';

interface QuickActionsProps {
  onAction: (actionType: string) => void;
  compareMode: boolean;
  disabled?: boolean;
}

/**
 * QuickActions — Pre-built prompt shortcut buttons.
 * Grounded prompts designed to extract specific legal insights reliably.
 */
function QuickActions({ onAction, compareMode, disabled = false }: QuickActionsProps) {
  return (
    <div className="quick-actions" role="toolbar" aria-label="Pre-built legal analysis actions">
      <button
        type="button"
        id="action-summarize"
        className="action-btn"
        onClick={() => onAction('summarize')}
        disabled={disabled}
        aria-label="Summarize Document"
        title="Generate plain-language executive summary of the document"
      >
        <BookOpen size={16} aria-hidden="true" />
        <span>Summarize</span>
      </button>

      <button
        type="button"
        id="action-risks"
        className="action-btn"
        onClick={() => onAction('risks')}
        disabled={disabled}
        aria-label="Identify Risks and Liabilities"
        title="Spot hidden risks, liabilities, and unusual obligations"
      >
        <AlertTriangle size={16} aria-hidden="true" />
        <span>Identify Risks</span>
      </button>

      <button
        type="button"
        id="action-simplify"
        className="action-btn"
        onClick={() => onAction('simplify')}
        disabled={disabled}
        aria-label="Simplify Legal Terms"
        title="Translate complex legalese into clear, plain terms"
      >
        <CheckSquare size={16} aria-hidden="true" />
        <span>Simplify Terms</span>
      </button>

      <button
        type="button"
        id="action-checklist"
        className="action-btn"
        onClick={() => onAction('checklist')}
        disabled={disabled}
        aria-label="Generate Obligations Checklist"
        title="Create an actionable checklist of duties, deadlines, and deliverables"
      >
        <ListChecks size={16} aria-hidden="true" />
        <span>Checklist</span>
      </button>

      {compareMode && (
        <button
          type="button"
          id="action-compare"
          className="action-btn compare-btn"
          onClick={() => onAction('compare')}
          disabled={disabled}
          aria-label="Compare Document A and B"
          title="Perform clause-by-clause comparison of both documents"
        >
          <GitCompareArrows size={16} aria-hidden="true" />
          <span>Compare Docs</span>
        </button>
      )}

      <button
        type="button"
        id="action-lawyer"
        className="action-btn lawyer-btn"
        onClick={() => onAction('lawyer')}
        disabled={disabled}
        aria-label="Generate Questions for Lawyer"
        title="Generate critical questions to ask your attorney before signing"
      >
        <AlertCircle size={16} aria-hidden="true" />
        <span>Questions for Lawyer</span>
      </button>
    </div>
  );
}

export default memo(QuickActions);
