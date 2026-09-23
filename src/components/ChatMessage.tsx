'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * ChatMessage — Renders a single chat message bubble.
 * Assistant messages are rendered as Markdown; user messages as plain text.
 */
export default function ChatMessage({ role, content }: ChatMessageProps) {
  return (
    <div className={`message ${role}`} role="listitem">
      <div className="message-bubble">
        {role === 'assistant' ? (
          <div className="markdown-content">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          content
        )}
      </div>
    </div>
  );
}
