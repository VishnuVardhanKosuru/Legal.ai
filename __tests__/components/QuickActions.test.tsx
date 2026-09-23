import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import QuickActions from '@/components/QuickActions';

describe('QuickActions Component', () => {
  it('renders all standard quick action buttons', () => {
    render(<QuickActions onAction={vi.fn()} compareMode={false} />);

    expect(screen.getByRole('button', { name: /summarize document/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /identify risks/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /simplify legal terms/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate obligations checklist/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /questions for lawyer/i })).toBeInTheDocument();
  });

  it('triggers onAction with correct action type on click', () => {
    const onAction = vi.fn();
    render(<QuickActions onAction={onAction} compareMode={false} />);

    fireEvent.click(screen.getByRole('button', { name: /summarize document/i }));
    expect(onAction).toHaveBeenCalledWith('summarize');

    fireEvent.click(screen.getByRole('button', { name: /identify risks/i }));
    expect(onAction).toHaveBeenCalledWith('risks');

    fireEvent.click(screen.getByRole('button', { name: /questions for lawyer/i }));
    expect(onAction).toHaveBeenCalledWith('lawyer');
  });

  it('shows compare button only when compareMode is enabled', () => {
    const { rerender } = render(<QuickActions onAction={vi.fn()} compareMode={false} />);
    expect(screen.queryByRole('button', { name: /compare document a and b/i })).not.toBeInTheDocument();

    rerender(<QuickActions onAction={vi.fn()} compareMode={true} />);
    expect(screen.getByRole('button', { name: /compare document a and b/i })).toBeInTheDocument();
  });

  it('disables all buttons when disabled prop is true', () => {
    render(<QuickActions onAction={vi.fn()} compareMode={true} disabled={true} />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });
});
