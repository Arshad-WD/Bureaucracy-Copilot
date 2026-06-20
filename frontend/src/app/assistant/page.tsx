'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../stores/authStore';
import { api } from '../../services/api';
import { Send, MessageSquare, Compass, ShieldCheck } from 'lucide-react';

function TypingIndicator() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-start">
      <div className="flex items-center space-x-2.5 max-w-[85%]">
        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 border mt-0.5">
          <Compass className="w-4 h-4" />
        </div>
        <div className="p-3.5 rounded-2xl rounded-tl-none bg-gray-50 border border-gray-200/60 flex items-center space-x-3">
          <div className="flex space-x-1">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-xs text-gray-400 font-medium">
            {elapsed < 3
              ? 'Thinking...'
              : elapsed < 10
              ? `Analyzing context... (${elapsed}s)`
              : `Processing with AI... (${elapsed}s)`}
          </span>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ text, role }: { text: string; role: 'user' | 'ai' }) {
  // Simple markdown-like rendering for bold, bullet lists
  const renderText = (raw: string) => {
    const lines = raw.split('\n');
    return lines.map((line, i) => {
      // Bold: **text**
      const boldified = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Bullet point
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={i} className="ml-4 list-disc" dangerouslySetInnerHTML={{ __html: boldified.slice(2) }} />
        );
      }
      // Heading ###
      if (line.startsWith('### ')) {
        return <p key={i} className="font-bold text-sm mt-2" dangerouslySetInnerHTML={{ __html: boldified.slice(4) }} />;
      }
      if (line.startsWith('## ')) {
        return <p key={i} className="font-bold mt-2" dangerouslySetInnerHTML={{ __html: boldified.slice(3) }} />;
      }
      if (line === '') return <div key={i} className="h-2" />;
      return <p key={i} dangerouslySetInnerHTML={{ __html: boldified }} />;
    });
  };

  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className="flex space-x-2.5 max-w-[85%]">
        {role === 'ai' && (
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 border mt-0.5">
            <Compass className="w-4 h-4" />
          </div>
        )}
        <div
          className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
            role === 'user'
              ? 'bg-blue-600 text-white font-medium rounded-tr-none'
              : 'bg-gray-50 text-gray-800 border border-gray-200/60 rounded-tl-none'
          }`}
        >
          {role === 'ai' ? <div className="space-y-0.5">{renderText(text)}</div> : text}
        </div>
      </div>
    </div>
  );
}

export default function AssistantPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    {
      role: 'ai',
      text: 'Hello! I am your **Bureaucracy Copilot**. I can explain scholarship requirements, checklist documents, and details from our verified catalog.\n\nAsk me anything! Note: AI responses may take **10–20 seconds** for complex queries.',
    },
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!localStorage.getItem('bc_access_token')) {
      router.push('/login');
    }
  }, [router]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatLoading]);

  const handleSendChat = async (textToSend?: string) => {
    const query = textToSend || chatInput;
    if (!query.trim() || chatLoading) return;

    setMessages((prev) => [...prev, { role: 'user', text: query }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await api.post('/ai/chat', { message: query });
      setMessages((prev) => [...prev, { role: 'ai', text: res.data.answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: 'I could not connect to the assistant service. Please check your network connection or try again in a moment.' },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const suggestions = [
    'Explain the Central Sector Scheme of Scholarship.',
    'Am I eligible for the Maharashtra Rajarshi Chhatrapati Shahu Maharaj Scheme?',
    'What documents are needed for AICTE Pragati Scholarship?',
  ];

  return (
    <div className="flex-grow max-w-4xl mx-auto w-full py-8 px-4 sm:px-6 flex flex-col h-[calc(100vh-140px)]">
      <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm flex flex-col flex-grow overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">AI Assistant</h2>
              <span className="text-xs text-green-600 font-medium inline-flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                Context: Verified Scholarship Catalog Only
              </span>
            </div>
          </div>
          {chatLoading && (
            <span className="text-xs text-blue-500 font-medium animate-pulse bg-blue-50 px-3 py-1 rounded-full">
              AI is thinking...
            </span>
          )}
        </div>

        {/* Scroll Box */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4">
          {messages.map((m, idx) => (
            <MessageBubble key={idx} role={m.role} text={m.text} />
          ))}
          {chatLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions Bar */}
        {messages.length === 1 && (
          <div className="px-6 py-3 border-t bg-gray-50/50 flex flex-wrap gap-2">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSendChat(s)}
                className="px-3.5 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-xs font-medium text-gray-600 rounded-lg transition-colors text-left"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input box */}
        <div className="p-4 border-t bg-white flex gap-3">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
            placeholder="Ask about scholarships, eligibility, documents..."
            disabled={chatLoading}
            className="flex-grow px-4 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-50"
          />
          <button
            onClick={() => handleSendChat()}
            disabled={chatLoading || !chatInput.trim()}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
