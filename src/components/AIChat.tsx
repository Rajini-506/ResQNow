import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Trash2,
  AlertTriangle,
  Sparkles,
  User,
  Shield,
  PhoneCall,
  Flame,
  Activity,
  Car,
  Compass,
} from 'lucide-react';
import type { ChatMessage } from '../types';
import { geminiService } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

const SUGGESTED_QUERIES = [
  {
    label: 'Road accident with injuries',
    prompt: 'I saw a road accident and someone is injured on the shoulder.',
    icon: Car,
  },
  {
    label: 'Person collapsed & unresponsive',
    prompt: 'Someone nearby has collapsed and is not responding to voice.',
    icon: Activity,
  },
  {
    label: 'Kitchen grease fire',
    prompt: 'There is a cooking grease pan fire on the stove.',
    icon: Flame,
  },
  {
    label: 'Severe bleeding first aid',
    prompt: 'Someone has a deep cut on their arm with severe continuous bleeding.',
    icon: Shield,
  },
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome',
    role: 'assistant',
    content:
      "Hello, I am ResQ AI. I provide rapid first-response safety guidance and emergency checklists.\n\n" +
      "⚠️ **URGENT**: If anyone is in active physical peril or facing a life-threatening crisis, dial **911** or **112** immediately.\n\n" +
      "How can I assist you right now? You can describe the scene or choose one of the common situation chips below.",
    timestamp: new Date().toISOString(),
  },
];

export const AIChat: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('resqnow_chat_history');
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    localStorage.setItem('resqnow_chat_history', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input.trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const historyForApi = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await geminiService.getEmergencyGuidance(historyForApi);

      const aiMessage: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toISOString(),
        isDemo: res.isDemo,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        role: 'assistant',
        content:
          '⚠️ Emergency Guidance System Notice: In any life-threatening situation, immediately call 911 or 112 directly. Move to a safe location away from moving traffic, fire, or hazards.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages(INITIAL_MESSAGES);
    localStorage.removeItem('resqnow_chat_history');
  };

  return (
    <div
      id="resq-ai-chat-card"
      className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[650px] overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold tracking-tight">ResQ AI Assistant</h3>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/30 text-rose-200 border border-rose-400/30">
                Gemini 2.5 Flash
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Emergency safety guidance &amp; triage</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="clear-chat-history-btn"
            type="button"
            onClick={handleClear}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mandatory Safety Banner */}
      <div className="bg-rose-50/90 border-b border-rose-200/80 px-4 py-2 flex items-start gap-2 text-xs text-rose-950">
        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
        <p className="leading-tight">
          <strong>Emergency Safety Disclaimer:</strong> ResQ AI provides general informational
          guidance and is not a substitute for professional emergency services. In a real emergency,
          contact your local emergency services immediately.
        </p>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-slate-900 text-white rounded-br-xs shadow-xs'
                    : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs shadow-xs'
                }`}
              >
                {msg.isDemo && (
                  <span className="block mb-2 text-[10px] font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded uppercase tracking-wider w-fit">
                    Demo Mode Active
                  </span>
                )}

                {/* Content formatting */}
                <div className="whitespace-pre-wrap space-y-1.5">{msg.content}</div>

                <div
                  className={`mt-2 text-[10px] ${
                    isUser ? 'text-slate-400' : 'text-slate-400'
                  } text-right`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-200 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center gap-2 text-xs text-slate-600">
              <LoadingSpinner size="sm" />
              <span>ResQ AI analyzing situation...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Queries */}
      <div className="px-4 py-2 bg-slate-100/70 border-t border-slate-200 overflow-x-auto flex gap-2">
        {SUGGESTED_QUERIES.map((q) => {
          const Icon = q.icon;
          return (
            <button
              key={q.label}
              type="button"
              onClick={() => handleSend(q.prompt)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-rose-400 text-slate-700 hover:text-rose-600 text-[11px] font-medium whitespace-nowrap transition-colors shadow-2xs"
            >
              <Icon className="w-3 h-3 text-rose-500" />
              <span>{q.label}</span>
            </button>
          );
        })}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <input
          id="resq-ai-chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your emergency situation or ask for guidance..."
          className="flex-1 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50/50"
          disabled={loading}
        />

        <button
          id="send-ai-message-btn"
          type="submit"
          disabled={!input.trim() || loading}
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white font-bold transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline text-xs">Send</span>
        </button>
      </form>
    </div>
  );
};

export default AIChat;
