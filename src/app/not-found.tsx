import React from 'react';
import Link from 'next/link';
import { Scale } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="system-state-page">
      <Scale size={48} color="#2563eb" style={{ marginBottom: '1rem' }} />
      <h1 className="system-state-title">404 — Page Not Found</h1>
      <p className="system-state-desc">
        The page you are looking for does not exist. Return to the Legal.ai home dashboard to analyze your contracts.
      </p>
      <Link href="/" className="system-state-btn">
        Back to Dashboard
      </Link>
    </div>
  );
}
