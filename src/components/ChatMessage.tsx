'use client';

import React, { memo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, Download } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * ChatMessage — Renders a single chat bubble.
 * Includes copy-to-clipboard and export-to-markdown actions for assistant answers.
 */
function ChatMessage({ role, content }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API is restricted
      const textarea = document.createElement('textarea');
      textarea.value = content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `legal-analysis-${Date.now()}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`message ${role}`} role="listitem">
      <div className="message-bubble">
        {role === 'assistant' ? (
          <>
            <div className="markdown-content">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
            {content.length > 50 && (
              <div className="message-footer" role="toolbar" aria-label="Message actions">
                <button
                  type="button"
                  className="msg-action-btn"
                  onClick={handleCopy}
                  aria-label={copied ? 'Analysis copied' : 'Copy analysis to clipboard'}
                  title="Copy analysis to clipboard"
                >
                  {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  className="msg-action-btn"
                  onClick={handleDownload}
                  aria-label="Download analysis as Markdown"
                  title="Download analysis report as .md"
                >
                  <Download size={13} aria-hidden="true" />
                  <span>Export</span>
                </button>
              </div>
            )}
          </>
        ) : (
          <p>{content}</p>
        )}
      </div>
    </div>
  );
}

export default memo(ChatMessage);
