"use client";

import React, { useState, useRef, useEffect } from 'react';
import { FileText, Send, Scale, AlertTriangle, ShieldCheck, CheckSquare, MessageSquare, BookOpen, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function Home() {
  const [documentText, setDocumentText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your Legal.ai assistant. Please paste a legal document on the left, and I can help you summarize it, identify risks, or answer specific questions based *only* on the provided text." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleAction = async (actionType: string) => {
    if (!documentText.trim()) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Please provide a legal document on the left before requesting an analysis." }]);
      return;
    }
    
    let prompt = '';
    switch(actionType) {
      case 'summarize':
        prompt = 'Please provide a plain-language summary of this document.';
        break;
      case 'risks':
        prompt = 'Please identify any potential risks, liabilities, or unusual obligations in this document.';
        break;
      case 'simplify':
        prompt = 'Please explain the core purpose of this agreement in simple terms for a non-lawyer.';
        break;
      case 'lawyer':
        prompt = 'Based on this document, what are 3-5 clarifying questions I should ask a human legal professional before signing or agreeing?';
        break;
      default:
        return;
    }

    await handleSendMessage(prompt);
  };

  const handleSendMessage = async (userMessage: string = input) => {
    if (!userMessage.trim()) return;

    if (!documentText.trim()) {
      setMessages(prev => [...prev, { role: 'user', content: userMessage }, { role: 'assistant', content: "Please provide a legal document on the left first." }]);
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
          chatHistory: newMessages,
          prompt: userMessage
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "An error occurred while analyzing the document. Please check your API key and try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header glass">
        <h1><Scale size={24} color="#3b82f6" /> Legal.ai Assistant</h1>
        <div style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>AI for Legal Assistance & Access</div>
      </header>

      <main className="main-content">
        {/* Left Pane: Document Viewer */}
        <section className="pane glass" aria-label="Legal Document Input">
          <div className="document-header">
            <FileText size={18} /> Document Text
          </div>
          <textarea
            className="document-input"
            placeholder="Paste your legal document, contract, or policy here..."
            value={documentText}
            onChange={(e) => setDocumentText(e.target.value)}
            aria-label="Paste legal document text here"
          />
        </section>

        {/* Right Pane: AI Assistant */}
        <section className="pane glass chat-container" aria-label="AI Chat Assistant">
          <div className="chat-history">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.role}`}>
                <div className="message-bubble">
                  {msg.role === 'assistant' ? (
                    <div className="markdown-content">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message assistant">
                <div className="message-bubble">
                  <div className="typing-indicator">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="quick-actions">
            <button className="action-btn" onClick={() => handleAction('summarize')} aria-label="Summarize Document">
              <BookOpen size={16} /> Summarize
            </button>
            <button className="action-btn" onClick={() => handleAction('risks')} aria-label="Identify Risks">
              <AlertTriangle size={16} /> Identify Risks
            </button>
            <button className="action-btn" onClick={() => handleAction('simplify')} aria-label="Simplify Terms">
              <CheckSquare size={16} /> Simplify Terms
            </button>
            <button className="action-btn lawyer-btn" onClick={() => handleAction('lawyer')} aria-label="Questions for Lawyer">
              <AlertCircle size={16} /> Questions for Lawyer
            </button>
          </div>

          <div className="chat-input-area">
            <textarea
              className="chat-input"
              placeholder="Ask a question about the document..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              aria-label="Type your question"
            />
            <button 
              className="send-btn" 
              onClick={() => handleSendMessage()} 
              disabled={isLoading || !input.trim()}
              aria-label="Send Message"
            >
              <Send size={20} />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
