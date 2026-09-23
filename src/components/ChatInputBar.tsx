'use client';

import React, { memo } from 'react';
import { Send } from 'lucide-react';

interface ChatInputBarProps {
  input: string;
  onInputChange: (text: string) => void;
  onSend: () => void;
  isLoading: boolean;
}

/**
 * ChatInputBar — Text input and submission controller for conversational legal inquiries.
 * Supports Enter to send and Shift+Enter for multiline questions.
 */
function ChatInputBar({ input, onInputChange, onSend, isLoading }: ChatInputBarProps) {
  return (
    <div className="chat-input-area" role="form" aria-label="Ask assistant form">
      <label htmlFor="chat-input" className="sr-only">
        Type your legal question or instruction here
      </label>
      <textarea
        id="chat-input"
        className="chat-input"
        placeholder="Ask any specific question about clauses, liabilities, deadlines..."
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!isLoading && input.trim()) {
              onSend();
            }
          }
        }}
        aria-label="Type your question about the legal document"
        rows={1}
        disabled={isLoading}
      />
      <button
        type="button"
        id="send-button"
        className="send-btn"
        onClick={onSend}
        disabled={isLoading || !input.trim()}
        aria-label={isLoading ? 'Analyzing document...' : 'Send question'}
        title="Send Question (Enter)"
      >
        <Send size={18} aria-hidden="true" />
      </button>
    </div>
  );
}

export default memo(ChatInputBar);
