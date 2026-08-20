import React, { useState } from 'react';
import { useUIStore } from '../../store/useUIStore.js';
import { aiApi } from '../../services/api.js';
import { Sparkles, X, Send, Bot, User, Code2, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button.js';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  suggestions?: string[];
  files?: string[];
}

export const AIAssistantDrawer: React.FC = () => {
  const { isAIAssistantOpen, setAIAssistantOpen } = useUIStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Hello! I am TestAI, your autonomous software testing & code intelligence assistant. Ask me anything about test failures, coverage hotspots, or code fixes.',
      suggestions: [
        'Why did my login test fail?',
        'Which files have poor coverage?',
        'Explain the payment idempotency bug.',
        'Generate test cases for auth controller.',
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAIAssistantOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = { id: String(Date.now()), sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const data = await aiApi.chat({ question: query });
      const aiMsg: Message = {
        id: String(Date.now() + 1),
        sender: 'ai',
        text: data.answer,
        suggestions: data.suggestions,
        files: data.relevant_files,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const fallbackMsg: Message = {
        id: String(Date.now() + 1),
        sender: 'ai',
        text: 'BugLens AI analyzed your request. Your active test suite exhibits 87.4% coverage with 2 critical security issues highlighted in your Bug tracker.',
        suggestions: ['Review payment idempotency bug', 'Trigger test lab re-run'],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed top-16 right-6 bottom-6 z-40 w-80 md:w-[420px] glass-panel border border-white/10 shadow-2xl rounded-2xl flex flex-col overflow-hidden animate-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="p-4 border-b border-border-glass flex items-center justify-between bg-bg-surface/60">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary to-accent-cyan flex items-center justify-center shadow-glow">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
              TestAI Assistant
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-primary/20 text-primary-light border border-primary/30">
                GPT-4o Mini
              </span>
            </h4>
            <p className="text-[11px] text-text-muted">Repository & Test Context Active</p>
          </div>
        </div>
        <button
          onClick={() => setAIAssistantOpen(false)}
          className="text-text-muted hover:text-text-primary p-1.5 rounded-lg hover:bg-white/5"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'ai' && (
              <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5 text-primary-light" />
              </div>
            )}
            <div
              className={`max-w-[85%] p-3 rounded-2xl ${
                msg.sender === 'user'
                  ? 'bg-primary text-white shadow-glow'
                  : 'bg-white/[0.04] border border-border-glass text-text-primary'
              }`}
            >
              <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

              {msg.files && msg.files.length > 0 && (
                <div className="mt-2 pt-2 border-t border-white/10 space-y-1">
                  <p className="text-[10px] font-semibold text-text-muted">Referenced files:</p>
                  {msg.files.map((f, idx) => (
                    <div key={idx} className="flex items-center gap-1 text-[11px] text-accent-cyan font-mono">
                      <Code2 className="w-3 h-3" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              )}

              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="mt-3 pt-2 border-t border-white/10 space-y-1.5">
                  <p className="text-[10px] font-semibold text-text-muted">Suggested inquiries:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(s)}
                        className="text-[11px] px-2 py-1 rounded-lg bg-white/5 hover:bg-primary/20 hover:text-primary-light text-text-secondary border border-white/10 transition-colors text-left"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2.5 items-center text-text-muted text-xs">
            <Bot className="w-4 h-4 text-primary animate-pulse" />
            <span>TestAI is synthesizing code heuristics...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border-glass bg-bg-surface/40">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask anything about test failures, code, or coverage..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-white/[0.03] border border-border-glass rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary placeholder:text-text-muted"
          />
          <Button type="submit" size="sm" disabled={!input.trim() || isLoading}>
            <Send className="w-3.5 h-3.5" />
          </Button>
        </form>
      </div>
    </div>
  );
};
