'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useScholarshipStore } from '../../../stores/scholarshipStore';
import { useTrackerStore } from '../../../stores/trackerStore';
import { useAuthStore } from '../../../stores/authStore';
import { api } from '../../../services/api';
import { Calendar, Award, CheckSquare, ExternalLink, ArrowLeft, MessageSquare, Send, Loader2 } from 'lucide-react';

export default function ScholarshipDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { current, fetchDetails, saveScholarship, saved, fetchSaved } = useScholarshipStore();
  const { createApplication } = useTrackerStore();
  const { isAuthenticated } = useAuthStore();

  const [trackerStatus, setTrackerStatus] = useState('INTERESTED');
  const [trackerSuccess, setTrackerSuccess] = useState(false);

  // AI Chat Sidebar State
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    fetchDetails(id);
    if (isAuthenticated) {
      fetchSaved();
    }
  }, [id, fetchDetails, fetchSaved, isAuthenticated]);

  const handleSave = async () => {
    if (!isAuthenticated) return;
    await saveScholarship(id);
  };

  const handleTrack = async () => {
    if (!isAuthenticated) return;
    const success = await createApplication(id, trackerStatus);
    if (success) {
      setTrackerSuccess(true);
      setTimeout(() => setTrackerSuccess(false), 3000);
    }
  };

  const handleSendChat = async (textToSend?: string) => {
    const query = textToSend || chatInput;
    if (!query.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { role: 'user', text: query }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await api.post('/ai/chat', {
        message: query,
        scholarshipId: id,
      });
      // Add AI reply
      setMessages((prev) => [...prev, { role: 'ai', text: res.data.answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: 'Sorry, the AI assistant is currently unavailable. Please try again later.' },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendChat(suggestion);
  };

  const isSaved = () => saved.some(s => s.id === id || (s as any).scholarshipId === id);

  if (!current) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Parse eligibility parameters
  let rulesDesc = 'Open eligibility criteria.';
  if (current.rules && current.rules.length > 0) {
    const rules = current.rules[0].ruleJson;
    if (rules) {
      const incomeStr = rules.income?.max ? `Income under ₹${rules.income.max.toLocaleString()}` : '';
      const stateStr = rules.state ? `State: ${rules.state.join(', ')}` : '';
      const edStr = rules.educationLevel || rules.education ? `Level: ${(rules.educationLevel || rules.education).join(', ')}` : '';
      const catStr = rules.category ? `Category: ${rules.category.join(', ')}` : '';
      rulesDesc = [incomeStr, stateStr, edStr, catStr].filter(Boolean).join(' | ');
    }
  }

  return (
    <div className="flex-grow max-w-7xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8">
      {/* Back button */}
      <div className="mb-6">
        <Link href="/scholarships" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to list
        </Link>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Main detail content */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-gray-200/60 shadow-sm space-y-6">
            <div>
              <span className="px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                {current.provider}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-4 leading-tight">{current.title}</h1>
              <p className="text-gray-500 text-sm mt-1">Status: Active Opportunity</p>
            </div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="flex items-center space-x-3">
                <Award className="w-5 h-5 text-blue-600" />
                <div>
                  <span className="text-gray-400 block text-xs">AMOUNT</span>
                  <span className="font-bold text-gray-900">₹{current.amount.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-amber-600" />
                <div>
                  <span className="text-gray-400 block text-xs">DEADLINE</span>
                  <span className="font-bold text-gray-900">
                    {current.deadline ? new Date(current.deadline).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed font-light">{current.description}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Eligibility Guidelines</h3>
              <p className="text-gray-600 text-sm font-semibold">{rulesDesc}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Required Documents</h3>
              {current.documents && current.documents.length > 0 ? (
                <ul className="space-y-2">
                  {current.documents.map((d) => (
                    <li key={d.id} className="text-sm text-gray-600 flex items-center space-x-2">
                      <CheckSquare className="w-4 h-4 text-blue-500" />
                      <span>
                        {d.documentName} {d.mandatory ? <span className="text-red-500 text-xs font-bold">(Mandatory)</span> : <span className="text-gray-400 text-xs font-light">(Optional)</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm font-light">No documents specified.</p>
              )}
            </div>

            <div className="pt-6 border-t flex flex-wrap gap-4 items-center justify-between">
              {current.applicationUrl && (
                <a
                  href={current.applicationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors"
                >
                  Apply on Official Site
                  <ExternalLink className="w-4 h-4 ml-1.5" />
                </a>
              )}

              {isAuthenticated && (
                <div className="flex gap-2">
                  {!isSaved() ? (
                    <button
                      onClick={handleSave}
                      className="px-4 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold"
                    >
                      Save Scheme
                    </button>
                  ) : (
                    <span className="px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-semibold">
                      ✓ Saved
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Application tracking trigger card */}
          {isAuthenticated && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200/60 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Application Tracker Status</h3>
              <p className="text-gray-500 text-xs font-light">
                Add this opportunity to your Kanban board tracker to organize files and deadlines.
              </p>
              <div className="flex flex-wrap gap-3 items-center pt-2">
                <select
                  value={trackerStatus}
                  onChange={(e) => setTrackerStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                >
                  <option value="INTERESTED">Interested</option>
                  <option value="PREPARING_DOCUMENTS">Preparing Documents</option>
                  <option value="APPLIED">Applied</option>
                </select>
                <button
                  onClick={handleTrack}
                  className="px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-lg"
                >
                  Update Tracker Board
                </button>
                {trackerSuccess && (
                  <span className="text-xs font-semibold text-green-600 animate-pulse">✓ Added to Kanban!</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* AI assistant sidebar */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <div className="bg-white p-6 rounded-2xl border border-gray-200/60 shadow-sm flex flex-col h-[520px] justify-between">
            <div className="flex items-center space-x-2 border-b pb-3 mb-3">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <h3 className="text-md font-bold text-gray-900">AI Assistant Guidance</h3>
            </div>

            {/* Message Area */}
            <div className="flex-grow overflow-y-auto space-y-3 p-1.5 text-xs">
              {messages.length === 0 ? (
                <div className="text-center py-10 text-gray-400 space-y-3 font-light">
                  <p>Ask a question about this scholarship!</p>
                  <div className="flex flex-col gap-2 pt-2">
                    <button
                      onClick={() => handleSuggestionClick('Am I eligible for this scholarship?')}
                      className="px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-600 text-left border border-gray-100"
                    >
                      Am I eligible?
                    </button>
                    <button
                      onClick={() => handleSuggestionClick('What documents do I need?')}
                      className="px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-600 text-left border border-gray-100"
                    >
                      What documents do I need?
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {messages.map((m, idx) => (
                    <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
                          m.role === 'user'
                            ? 'bg-blue-600 text-white font-medium rounded-tr-none'
                            : 'bg-gray-100 text-gray-800 font-light rounded-tl-none border border-gray-200/60'
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="p-3 bg-gray-50 text-gray-400 rounded-xl rounded-tl-none border flex items-center space-x-2">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Copilot is typing...</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Input area */}
            <div className="flex gap-2 border-t pt-3 mt-3">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                placeholder="Ask about rules, benefits..."
                className="flex-grow px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={() => handleSendChat()}
                disabled={chatLoading}
                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
