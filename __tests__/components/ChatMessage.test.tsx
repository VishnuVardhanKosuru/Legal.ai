import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ChatMessage from '@/components/ChatMessage';

describe('ChatMessage Component', () => {
  it('renders user message as plain text', () => {
    render(<ChatMessage role="user" content="Can I terminate early?" />);

    expect(screen.getByText('Can I terminate early?')).toBeInTheDocument();
  });

  it('renders assistant message with markdown support', () => {
    const markdownContent =
      '### Summary of Obligations\n\n- Obligation 1: **Maintain confidentiality**\n- Obligation 2: *Return materials within 30 days*';
    render(<ChatMessage role="assistant" content={markdownContent} />);

    expect(screen.getByRole('heading', { level: 3, name: /Summary of Obligations/i })).toBeInTheDocument();
    expect(screen.getByText('Maintain confidentiality')).toBeInTheDocument();
  });

  it('renders copy and export buttons for long assistant responses', () => {
    const longContent =
      'This agreement requires both parties to indemnify and hold harmless each other for all direct damages arising from confidentiality breaches.';
    render(<ChatMessage role="assistant" content={longContent} />);

    expect(screen.getByRole('button', { name: /copy analysis to clipboard/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /download analysis as markdown/i })).toBeInTheDocument();
  });
});
