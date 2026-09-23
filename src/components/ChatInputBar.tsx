'use client';

import React from 'react';
import { Send } from 'lucide-react';

interface ChatInputBarProps {
  input: string;
  onInputChange: (text: string) => void;
  onSend: () => void;
  isLoading: boolean;
}

/**
 * ChatInputBar — Text input and send button for the chat pane.
 * Supports Enter to send and Shift+Enter for newlines.
 */
export default function ChatInputBar({ input, onInputChange, onSend, isLoading }: ChatInputBarProps) {
  return (
    <div className="chat-input-area">
      <textarea
        id="chat-input"
        className="chat-input"
        placeholder="Ask a question about the document..."
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
        aria-label="Type your question about the legal document"
      />
      <button
        id="send-button"
        className="send-btn"
        onClick={onSend}
        disabled={isLoading || !input.trim()}
        aria-label="Send Message"
      >
        <Send size={20} />
      </button>
    </div>
  );
}
