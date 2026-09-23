import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ChatInputBar from '@/components/ChatInputBar';

describe('ChatInputBar Component', () => {
  it('renders textarea and send button', () => {
    render(
      <ChatInputBar
        input=""
        onInputChange={vi.fn()}
        onSend={vi.fn()}
        isLoading={false}
      />
    );

    const textarea = screen.getByPlaceholderText(/Ask any specific question/i);
    const sendButton = screen.getByRole('button', { name: /send/i });

    expect(textarea).toBeInTheDocument();
    expect(sendButton).toBeInTheDocument();
    expect(sendButton).toBeDisabled();
  });

  it('calls onInputChange when user types', () => {
    const onInputChange = vi.fn();
    render(
      <ChatInputBar
        input=""
        onInputChange={onInputChange}
        onSend={vi.fn()}
        isLoading={false}
      />
    );

    const textarea = screen.getByPlaceholderText(/Ask any specific question/i);
    fireEvent.change(textarea, { target: { value: 'What is the termination period?' } });

    expect(onInputChange).toHaveBeenCalledWith('What is the termination period?');
  });

  it('calls onSend when send button is clicked with input', () => {
    const onSend = vi.fn();
    render(
      <ChatInputBar
        input="What is the governing law?"
        onInputChange={vi.fn()}
        onSend={onSend}
        isLoading={false}
      />
    );

    const sendButton = screen.getByRole('button', { name: /send/i });
    expect(sendButton).not.toBeDisabled();
    fireEvent.click(sendButton);

    expect(onSend).toHaveBeenCalledTimes(1);
  });

  it('submits on Enter key press but allows Shift+Enter for newline', () => {
    const onSend = vi.fn();
    render(
      <ChatInputBar
        input="Explain clause 3"
        onInputChange={vi.fn()}
        onSend={onSend}
        isLoading={false}
      />
    );

    const textarea = screen.getByPlaceholderText(/Ask any specific question/i);

    // Shift + Enter should NOT send
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });
    expect(onSend).not.toHaveBeenCalled();

    // Enter alone should send
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });
    expect(onSend).toHaveBeenCalledTimes(1);
  });

  it('disables textarea and button during isLoading state', () => {
    render(
      <ChatInputBar
        input="Analyzing..."
        onInputChange={vi.fn()}
        onSend={vi.fn()}
        isLoading={true}
      />
    );

    const textarea = screen.getByPlaceholderText(/Ask any specific question/i);
    const button = screen.getByRole('button', { name: /analyzing document/i });

    expect(textarea).toBeDisabled();
    expect(button).toBeDisabled();
  });
});
