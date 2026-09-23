import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DocumentInput from '@/components/DocumentInput';
import { SAMPLE_CONTRACT } from '@/lib/utils';

describe('DocumentInput Component', () => {
  it('renders primary document textarea and stats bar', () => {
    render(
      <DocumentInput
        documentText=""
        onDocumentChange={vi.fn()}
        documentBText=""
        onDocumentBChange={vi.fn()}
        compareMode={false}
        onToggleCompare={vi.fn()}
      />
    );

    expect(screen.getByPlaceholderText(/Paste your contract, NDA/i)).toBeInTheDocument();
    expect(
      screen.getByText((_, el) => el?.tagName.toLowerCase() === 'span' && /0\s*words/.test(el.textContent || ''))
    ).toBeInTheDocument();
  });

  it('updates character and word count stats as user types', () => {
    const text = 'This Agreement is between Party A and Party B.';
    render(
      <DocumentInput
        documentText={text}
        onDocumentChange={vi.fn()}
        documentBText=""
        onDocumentBChange={vi.fn()}
        compareMode={false}
        onToggleCompare={vi.fn()}
      />
    );

    expect(
      screen.getByText((_, el) => el?.tagName.toLowerCase() === 'span' && /9\s*words/.test(el.textContent || ''))
    ).toBeInTheDocument();
  });

  it('loads sample NDA when "Sample NDA" button is clicked', () => {
    const onDocumentChange = vi.fn();
    render(
      <DocumentInput
        documentText=""
        onDocumentChange={onDocumentChange}
        documentBText=""
        onDocumentBChange={vi.fn()}
        compareMode={false}
        onToggleCompare={vi.fn()}
      />
    );

    const sampleBtn = screen.getByRole('button', { name: /load sample nda/i });
    fireEvent.click(sampleBtn);

    expect(onDocumentChange).toHaveBeenCalledWith(SAMPLE_CONTRACT);
  });

  it('toggles compare mode and displays second document textarea', () => {
    const onToggleCompare = vi.fn();
    const { rerender } = render(
      <DocumentInput
        documentText="Doc A text"
        onDocumentChange={vi.fn()}
        documentBText=""
        onDocumentBChange={vi.fn()}
        compareMode={false}
        onToggleCompare={onToggleCompare}
      />
    );

    const compareBtn = screen.getByRole('button', { name: /enable comparison mode/i });
    fireEvent.click(compareBtn);
    expect(onToggleCompare).toHaveBeenCalled();

    // Rerender with compareMode=true
    rerender(
      <DocumentInput
        documentText="Doc A text"
        onDocumentChange={vi.fn()}
        documentBText=""
        onDocumentBChange={vi.fn()}
        compareMode={true}
        onToggleCompare={onToggleCompare}
      />
    );

    expect(screen.getByPlaceholderText(/Paste the revised or counterparty document/i)).toBeInTheDocument();
  });

  it('clears document text when clear button is clicked', () => {
    const onDocumentChange = vi.fn();
    render(
      <DocumentInput
        documentText="Existing contract text to clear"
        onDocumentChange={onDocumentChange}
        documentBText=""
        onDocumentBChange={vi.fn()}
        compareMode={false}
        onToggleCompare={vi.fn()}
      />
    );

    const clearBtn = screen.getByRole('button', { name: /clear document text/i });
    fireEvent.click(clearBtn);

    expect(onDocumentChange).toHaveBeenCalledWith('');
  });
});
