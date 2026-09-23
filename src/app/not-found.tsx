import React from 'react';
import Link from 'next/link';
import { Scale } from 'lucide-react';

export default function NotFound() {
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
    >
      <Scale size={48} color="#2563eb" style={{ marginBottom: '1rem' }} />
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
        404 — Page Not Found
      </h1>
      <p style={{ color: '#475569', maxWidth: '440px', marginBottom: '1.5rem' }}>
        The page you are looking for does not exist. Return to the Legal.ai home dashboard to analyze your contracts.
      </p>
      <Link
        href="/"
        style={{
          padding: '0.6rem 1.25rem',
          background: '#2563eb',
          color: '#ffffff',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 600,
        }}
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
