'use client';

import React from 'react';
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
}

/**
 * QuickActions — Pre-built prompt shortcut buttons.
 * These map to carefully crafted prompts sent to the AI.
 */
export default function QuickActions({ onAction, compareMode }: QuickActionsProps) {
  return (
    <div className="quick-actions" role="toolbar" aria-label="Quick analysis actions">
      <button
        id="action-summarize"
        className="action-btn"
        onClick={() => onAction('summarize')}
        aria-label="Summarize Document"
      >
        <BookOpen size={16} /> Summarize
      </button>
      <button
        id="action-risks"
        className="action-btn"
        onClick={() => onAction('risks')}
        aria-label="Identify Risks"
      >
        <AlertTriangle size={16} /> Identify Risks
      </button>
      <button
        id="action-simplify"
        className="action-btn"
        onClick={() => onAction('simplify')}
        aria-label="Simplify Terms"
      >
        <CheckSquare size={16} /> Simplify Terms
      </button>
      <button
        id="action-checklist"
        className="action-btn"
        onClick={() => onAction('checklist')}
        aria-label="Generate Checklist"
      >
        <ListChecks size={16} /> Checklist
      </button>
      {compareMode && (
        <button
          id="action-compare"
          className="action-btn compare-btn"
          onClick={() => onAction('compare')}
          aria-label="Compare Documents"
        >
          <GitCompareArrows size={16} /> Compare
        </button>
      )}
      <button
        id="action-lawyer"
        className="action-btn lawyer-btn"
        onClick={() => onAction('lawyer')}
        aria-label="Questions for Lawyer"
      >
        <AlertCircle size={16} /> Questions for Lawyer
      </button>
    </div>
  );
}
