import React from 'react';
import { Scale } from 'lucide-react';

export default function Loading() {
  return (
    <div className="system-state-page" role="status" aria-label="Loading Legal.ai">
      <Scale size={40} color="#2563eb" style={{ animation: 'bounce 1.4s infinite ease-in-out' }} />
      <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>
        Initializing Legal.ai Assistant...
      </p>
    </div>
  );
}
