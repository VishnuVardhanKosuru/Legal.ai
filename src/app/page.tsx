'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Scale } from 'lucide-react';
import DocumentInput from '@/components/DocumentInput';
import ChatMessage from '@/components/ChatMessage';
import QuickActions from '@/components/QuickActions';
import ChatInputBar from '@/components/ChatInputBar';

/** Shape of a single chat message. */
export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

/** Maps quick-action types to carefully crafted prompts. */
const ACTION_PROMPTS: Record<string, string> = {
  summarize:
    'Please provide a clear, plain-language summary of this document. Highlight the primary purpose, parties involved, effective dates, and core obligations.',
  risks:
    'Identify all potential risks, liabilities, indemnification terms, penalties, or unusual obligations in this document. For each identified risk, quote the relevant clause verbatim.',
  simplify:
    'Explain the core purpose and critical terms of this agreement in simple, everyday language that a non-lawyer can easily understand.',
  checklist:
    'Generate a comprehensive structured checklist of all obligations, key deadlines, deliverables, and action items from this document. Format as Markdown checkboxes (- [ ]).',
  compare:
    'Compare Document A and Document B clause-by-clause. Highlight any differences, conflicting terms, missing covenants, or clauses that are noticeably more favorable to one party over the other. Present this in a structured Markdown comparison table.',
  lawyer:
    'Based on this document, what are 5 critical clarifying questions I should ask a qualified legal professional before signing or agreeing? Explain why each question matters.',
};

const WELCOME_MESSAGE: Message = {
  role: 'assistant',
  content:
    "### Welcome to Legal.ai ⚖️\n\nI am your AI Legal Assistant powered by **Google Gemini**. Paste any contract, agreement, or policy on the left—or click **'Sample NDA'** to test immediately.\n\n**What I can do:**\n- 📑 **Summarize** complex agreements in plain English\n- ⚠️ **Identify Risks** and hidden liabilities with exact clause citations\n- 🔄 **Compare Documents** clause-by-clause (toggle *Compare* mode)\n- ✅ **Generate Action Checklists** of all deadlines and obligations\n- 🧑‍⚖️ **Formulate Questions** for your lawyer before you sign\n\n*All analysis is strictly grounded in the document you provide.*",
};

export default function Home() {
  const [documentText, setDocumentText] = useState('');
  const [documentBText, setDocumentBText] = useState('');
  const [compareMode, setCompareMode] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /** Auto-scroll chat to the bottom when new messages arrive. */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  /**
   * Sends a message to the /api/analyze backend and appends the response.
   */
  const handleSendMessage = useCallback(
    async (userMessage: string = input) => {
      const trimmed = userMessage.trim();
      if (!trimmed) return;

      if (!documentText.trim()) {
        setMessages((prev) => [
          ...prev,
          { role: 'user', content: trimmed },
          {
            role: 'assistant',
            content:
              '⚠️ **Please paste a legal document on the left** (or click the **"Sample NDA"** button) before asking a question or running an analysis.',
          },
        ]);
        setInput('');
        return;
      }

      const updatedHistory: Message[] = [...messages, { role: 'user', content: trimmed }];
      setMessages(updatedHistory);
      setInput('');
      setIsLoading(true);

      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            document: documentText,
            documentB: compareMode ? documentBText : undefined,
            chatHistory: updatedHistory,
            prompt: trimmed,
          }),
        });

        const data: { reply?: string } = await response.json();

        if (!response.ok) {
          throw new Error(data.reply || `Request failed with status ${response.status}`);
        }

        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.reply || 'No response returned from the assistant.',
          },
        ]);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'A network error occurred. Please check your connection and try again.';
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `⚠️ ${errorMessage}`,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, documentText, documentBText, compareMode, messages]
  );

  /** Handles quick-action clicks */
  const handleAction = useCallback(
    (actionType: string) => {
      const prompt = ACTION_PROMPTS[actionType];
      if (!prompt) return;
      handleSendMessage(prompt);
    },
    [handleSendMessage]
  );

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header glass" role="banner">
        <h1>
          <Scale size={24} aria-hidden="true" /> Legal.ai
        </h1>
        <span className="header-subtitle">Intelligent Legal Document Assistant • Powered by Google Gemini</span>
      </header>

      {/* Persistent Disclaimer Banner */}
      <aside className="disclaimer-banner" role="status" aria-label="Legal Disclaimer">
        ⚖️ <strong>Informational Use Only:</strong> Legal.ai assists in understanding documents and does not constitute formal legal counsel. Always consult a licensed attorney for binding legal matters.
      </aside>

      {/* Main Content Area */}
      <main id="main-content" className="main-content">
        {/* Left Pane: Document Input */}
        <DocumentInput
          documentText={documentText}
          onDocumentChange={setDocumentText}
          documentBText={documentBText}
          onDocumentBChange={setDocumentBText}
          compareMode={compareMode}
          onToggleCompare={() => setCompareMode((prev) => !prev)}
        />

        {/* Right Pane: AI Assistant Chat */}
        <section
          className="pane glass chat-container"
          aria-label="AI Legal Assistant Interaction"
          aria-busy={isLoading}
        >
          <div className="document-header">
            <span>💬 Legal Assistant Consultation</span>
          </div>

          <div
            className="chat-history"
            role="log"
            aria-live="polite"
            aria-relevant="additions text"
          >
            {messages.map((msg, idx) => (
              <ChatMessage key={`msg-${idx}`} role={msg.role} content={msg.content} />
            ))}

            {isLoading && (
              <div className="message assistant" role="listitem" aria-label="Assistant analyzing">
                <div className="message-bubble">
                  <div className="typing-indicator" aria-label="Analyzing document...">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Shortcuts */}
          <QuickActions
            onAction={handleAction}
            compareMode={compareMode}
            disabled={isLoading}
          />

          {/* Chat Input Bar */}
          <ChatInputBar
            input={input}
            onInputChange={setInput}
            onSend={() => handleSendMessage()}
            isLoading={isLoading}
          />
        </section>
      </main>
    </div>
  );
}
