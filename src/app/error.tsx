'use client';

import React, { useEffect } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <div className="system-state-page" role="alert">
      <AlertOctagon size={48} color="#dc2626" style={{ marginBottom: '1rem' }} />
      <h2 className="system-state-title">An Unexpected Error Occurred</h2>
      <p className="system-state-desc">
        Legal.ai encountered an issue while loading. Please try refreshing or resetting the application state.
      </p>
      <button type="button" onClick={() => reset()} className="system-state-btn">
        <RotateCcw size={16} aria-hidden="true" />
        <span>Try Again</span>
      </button>
    </div>
  );
}
