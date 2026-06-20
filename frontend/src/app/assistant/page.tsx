'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../stores/authStore';
import { api } from '../../services/api';
import { Send, Loader2, MessageSquare, Compass, ShieldCheck } from 'lucide-react';

export default function AssistantPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    {
      role: 'ai',
      text: 'Hello! I am your Bureaucracy Copilot. I can explain scholarship requirements, checklist documents, and details from our verified catalog. Ask me anything!',
    },
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('bc_access_token')) {
      router.push('/login');
    }
  }, [router]);

  const handleSendChat = async (textToSend?: string) => {
    const query = textToSend || chatInput;
    if (!query.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', text: query }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await api.post('/ai/chat', {
        message: query,
      });
      setMessages((prev) => [...prev, { role: 'ai', text: res.data.answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: 'I could not connect to the assistant service. Please check your environment key configurations.' },
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
        </div>

        {/* Scroll Box */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="flex space-x-2.5 max-w-[85%]">
                {m.role === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 border mt-0.5">
                    <Compass className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`p-3.5 rounded-2xl leading-relaxed text-sm ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white font-medium rounded-tr-none'
                      : 'bg-gray-150 text-gray-800 font-light border border-gray-200/60 rounded-tl-none bg-gray-50'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            </div>
          ))}

          {chatLoading && (
            <div className="flex justify-start">
              <div className="flex space-x-2.5 items-center text-sm text-gray-400 pl-11">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Copilot is parsing context details...</span>
              </div>
            </div>
          )}
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
            placeholder="Type your question (e.g. Am I eligible? What are the NSP benefits?)..."
            className="flex-grow px-4 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <button
            onClick={() => handleSendChat()}
            disabled={chatLoading}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors flex items-center justify-center disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
