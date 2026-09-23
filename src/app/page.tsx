'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Scale } from 'lucide-react';
import DocumentInput from '@/components/DocumentInput';
import ChatMessage from '@/components/ChatMessage';
import QuickActions from '@/components/QuickActions';
import ChatInputBar from '@/components/ChatInputBar';

/** Shape of a single chat message. */
type Message = {
  role: 'user' | 'assistant';
  content: string;
};

/** Maps quick-action types to carefully crafted prompts. */
const ACTION_PROMPTS: Record<string, string> = {
  summarize:
    'Please provide a clear, plain-language summary of this document. Highlight the purpose, parties involved, and key terms.',
  risks:
    'Identify all potential risks, liabilities, penalties, or unusual obligations in this document. For each risk, quote the relevant clause.',
  simplify:
    'Explain the core purpose and terms of this agreement in simple, everyday language that a non-lawyer can understand.',
  checklist:
    'Generate a structured checklist of all obligations, deadlines, and action items from this document. Use checkboxes (- [ ]) in Markdown.',
  compare:
    'Compare Document A and Document B clause-by-clause. Highlight any differences, conflicts, missing terms, or terms that are more favorable in one document vs. the other. Present this in a table format.',
  lawyer:
    'Based on this document, what are 5 important clarifying questions I should ask a qualified legal professional before signing or agreeing? Explain why each question matters.',
};

const WELCOME_MESSAGE: Message = {
  role: 'assistant',
  content:
    "Welcome to **Legal.ai**! 👋\n\nPaste a legal document on the left, and I'll help you:\n- **Summarize** it in plain language\n- **Identify risks** and obligations\n- **Generate a checklist** of action items\n- **Compare** two documents side-by-side\n- Prepare **questions for your lawyer**\n\nI answer *only* based on the text you provide — no guessing.",
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
  }, [messages]);

  /**
   * Sends a message to the /api/analyze backend and appends the response.
   * Handles both free-text questions and quick-action prompts.
   */
  const handleSendMessage = useCallback(
    async (userMessage: string = input) => {
      if (!userMessage.trim()) return;

      if (!documentText.trim()) {
        setMessages((prev) => [
          ...prev,
          { role: 'user', content: userMessage },
          { role: 'assistant', content: 'Please paste a legal document on the left before asking a question.' },
        ]);
        setInput('');
        return;
      }

      const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
      setMessages(newMessages);
      setInput('');
      setIsLoading(true);

      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            document: documentText,
            documentB: compareMode ? documentBText : undefined,
            chatHistory: newMessages,
            prompt: userMessage,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || data.reply || 'Request failed');
        }

        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      } catch (error: any) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `⚠️ ${error.message || 'An error occurred. Please check your API key and try again.'}`,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, documentText, documentBText, compareMode, messages],
  );

  /** Handles quick-action button clicks by mapping to a predefined prompt. */
  const handleAction = useCallback(
    (actionType: string) => {
      const prompt = ACTION_PROMPTS[actionType];
      if (!prompt) return;
      handleSendMessage(prompt);
    },
    [handleSendMessage],
  );

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header glass" role="banner">
        <h1>
          <Scale size={24} aria-hidden="true" /> Legal.ai
        </h1>
        <span className="header-subtitle">AI-Powered Legal Document Assistant</span>
      </header>

      {/* Disclaimer banner */}
      <div className="disclaimer-banner" role="status">
        ⚖️ This tool provides information only — it does not constitute legal advice. Always consult a qualified attorney for legal decisions.
      </div>

      <main className="main-content">
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
        <section className="pane glass chat-container" aria-label="AI Chat Assistant">
          <div className="document-header">
            <span>💬 AI Assistant</span>
          </div>

          <div className="chat-history" role="list" aria-live="polite">
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} role={msg.role} content={msg.content} />
            ))}
            {isLoading && (
              <div className="message assistant" role="listitem">
                <div className="message-bubble">
                  <div className="typing-indicator" aria-label="Assistant is typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <QuickActions onAction={handleAction} compareMode={compareMode} />

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
