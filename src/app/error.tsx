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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem',
        textAlign: 'center',
        background: '#f8fafc',
      }}
      role="alert"
    >
      <AlertOctagon size={48} color="#dc2626" style={{ marginBottom: '1rem' }} />
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a' }}>
        An Unexpected Error Occurred
      </h2>
      <p style={{ color: '#475569', maxWidth: '480px', marginBottom: '1.5rem' }}>
        Legal.ai encountered an issue while loading. Please try refreshing or resetting the application state.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.6rem 1.25rem',
          background: '#2563eb',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        <RotateCcw size={16} />
        <span>Try Again</span>
      </button>
    </div>
  );
}
