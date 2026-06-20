'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../stores/authStore';
import { api } from '../../services/api';
import { ShieldAlert, Plus, Edit, Trash2, Loader2, BarChart3, HelpCircle, Save, X } from 'lucide-react';

interface ScholarshipItem {
  id: string;
  title: string;
  provider: string;
  amount: number;
  description?: string;
  deadline?: string;
  status: string;
  documents?: any[];
  rules?: any[];
}

export default function AdminPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [scholarships, setScholarships] = useState<ScholarshipItem[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [provider, setProvider] = useState('');
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');
  const [applicationUrl, setApplicationUrl] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('ACTIVE');

  // Rule builder states
  const [ruleIncomeMax, setRuleIncomeMax] = useState(800000);
  const [ruleStates, setRuleStates] = useState('Maharashtra'); // comma sep
  const [ruleEducation, setRuleEducation] = useState('Engineering'); // comma sep
  const [ruleCategory, setRuleCategory] = useState('OBC'); // comma sep
  const [ruleDisability, setRuleDisability] = useState(false);

  // Documents list
  const [documentsStr, setDocumentsStr] = useState('Aadhaar Card, Income Certificate, Marksheet');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sRes, aRes] = await Promise.all([
        api.get('/scholarships?limit=100'),
        api.get('/admin/analytics'),
      ]);
      setScholarships(sRes.data.data);
      setAnalytics(aRes.data);
    } catch {
      // Fallback redirect if not admin
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('bc_access_token')) {
      router.push('/login');
      return;
    }
    fetchData();
  }, [router]);

  const handleOpenCreate = () => {
    setEditId(null);
    setTitle('');
    setProvider('');
    setAmount(0);
    setDescription('');
    setApplicationUrl('');
    setDeadline('');
    setStatus('ACTIVE');
    setRuleIncomeMax(800000);
    setRuleStates('Maharashtra');
    setRuleEducation('Engineering');
    setRuleCategory('OBC');
    setRuleDisability(false);
    setDocumentsStr('Aadhaar Card, Income Certificate, Marksheet');
    setShowModal(true);
  };

  const handleOpenEdit = (s: ScholarshipItem) => {
    setEditId(s.id);
    setTitle(s.title);
    setProvider(s.provider);
    setAmount(s.amount);
    setDescription(s.description || '');
    setApplicationUrl((s as any).applicationUrl || '');
    setDeadline(s.deadline ? s.deadline.split('T')[0] : '');
    setStatus(s.status);

    // Extract rules if exists
    const firstRule = s.rules?.[0]?.ruleJson;
    if (firstRule) {
      setRuleIncomeMax(firstRule.income?.max || 800000);
      setRuleStates(firstRule.state ? firstRule.state.join(', ') : '');
      setRuleEducation(firstRule.educationLevel || firstRule.education ? (firstRule.educationLevel || firstRule.education).join(', ') : '');
      setRuleCategory(firstRule.category ? firstRule.category.join(', ') : '');
      setRuleDisability(!!firstRule.disability);
    } else {
      setRuleIncomeMax(800000);
      setRuleStates('');
      setRuleEducation('');
      setRuleCategory('');
      setRuleDisability(false);
    }

    // Extract documents if exists
    if (s.documents && s.documents.length > 0) {
      setDocumentsStr(s.documents.map((d: any) => d.documentName).join(', '));
    } else {
      setDocumentsStr('');
    }

    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this scholarship?')) return;
    try {
      await api.delete(`/admin/scholarships/${id}`);
      fetchData();
    } catch {
      alert('Delete failed.');
    }
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const docArray = documentsStr
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean)
      .map((d) => ({ documentName: d, mandatory: true }));

    const statesArray = ruleStates.split(',').map((s) => s.trim()).filter(Boolean);
    const edArray = ruleEducation.split(',').map((e) => e.trim()).filter(Boolean);
    const catArray = ruleCategory.split(',').map((c) => c.trim()).filter(Boolean);

    const rulesPayload = {
      income: { max: ruleIncomeMax },
      ...(statesArray.length > 0 && { state: statesArray }),
      ...(edArray.length > 0 && { educationLevel: edArray }),
      ...(catArray.length > 0 && { category: catArray }),
      disability: ruleDisability,
    };

    const payload = {
      title,
      provider,
      amount: Number(amount),
      description,
      applicationUrl: applicationUrl || undefined,
      deadline: deadline || undefined,
      status,
      rules: rulesPayload,
      documents: docArray,
    };

    try {
      if (editId) {
        await api.patch(`/admin/scholarships/${editId}`, payload);
      } else {
        await api.post('/admin/scholarships', payload);
      }
      setShowModal(false);
      fetchData();
    } catch {
      alert('Save operation failed. Please check inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex-grow max-w-7xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Admin header */}
      <div className="border-b pb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 inline-flex items-center">
            <BarChart3 className="w-8 h-8 text-orange-500 mr-2.5" />
            Administrative Portal
          </h1>
          <p className="text-gray-500 text-sm font-light mt-1">Manage database records and eligibility guidelines</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Create Scholarship
        </button>
      </div>

      {/* Analytics widgets */}
      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 border rounded-2xl">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Registered Users</span>
            <span className="text-2xl font-black text-gray-900 mt-1 block">{analytics.totalUsers}</span>
          </div>
          <div className="bg-white p-6 border rounded-2xl">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Indexed Scholarships</span>
            <span className="text-2xl font-black text-gray-900 mt-1 block">{analytics.totalScholarships}</span>
          </div>
          <div className="bg-white p-6 border rounded-2xl">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Eligibility Checks Run</span>
            <span className="text-2xl font-black text-gray-900 mt-1 block">{analytics.eligibilityChecks}</span>
          </div>
          <div className="bg-white p-6 border rounded-2xl">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Applications Logged</span>
            <span className="text-2xl font-black text-gray-900 mt-1 block">{analytics.activeApplications}</span>
          </div>
        </div>
      )}

      {/* Scholarships Database table */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Scholarship Catalog</h2>
        <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider text-left">
              <tr>
                <th className="px-6 py-3.5">Name</th>
                <th className="px-6 py-3.5">Provider</th>
                <th className="px-6 py-3.5">Benefit</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm text-gray-600">
              {scholarships.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-bold text-gray-900">{s.title}</td>
                  <td className="px-6 py-4 text-xs font-medium text-gray-500">{s.provider}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">₹{s.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        s.status === 'ACTIVE'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button
                      onClick={() => handleOpenEdit(s)}
                      className="text-blue-600 hover:text-blue-700 inline-flex items-center text-xs font-bold"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-red-500 hover:text-red-700 inline-flex items-center text-xs font-bold"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50 sticky top-0 z-10">
              <h3 className="text-lg font-black text-gray-900">
                {editId ? 'Modify Scholarship Details' : 'Index New Scholarship'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="p-6 space-y-6 flex-grow">
              {/* Core Details */}
              <div className="space-y-4">
                <h4 className="font-bold text-gray-800 text-sm border-b pb-1">1. Base Guidelines</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Scholarship Name</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                      placeholder="e.g. NSP Fellowship"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Provider Entity</label>
                    <input
                      type="text"
                      required
                      value={provider}
                      onChange={(e) => setProvider(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                      placeholder="e.g. Ministry of Minority Affairs"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Benefit Amount (INR)</label>
                    <input
                      type="number"
                      required
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Deadline Date</label>
                    <input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Catalog Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Application Portal URL</label>
                  <input
                    type="url"
                    value={applicationUrl}
                    onChange={(e) => setApplicationUrl(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                    placeholder="https://scholarships.gov.in"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Description Summary</label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                    placeholder="Enter short details explaining benefits..."
                  />
                </div>
              </div>

              {/* Dynamic Rules Engine builder */}
              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-bold text-gray-800 text-sm border-b pb-1">2. Eligibility Criteria Rules Builder</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Maximum Family Income Limit (INR)</label>
                    <input
                      type="number"
                      value={ruleIncomeMax}
                      onChange={(e) => setRuleIncomeMax(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Allowed States (Comma separated)</label>
                    <input
                      type="text"
                      value={ruleStates}
                      onChange={(e) => setRuleStates(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                      placeholder="e.g. Maharashtra, Andhra Pradesh"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Allowed Education Levels (Comma separated)</label>
                    <input
                      type="text"
                      value={ruleEducation}
                      onChange={(e) => setRuleEducation(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                      placeholder="e.g. Engineering, Medicine, Diploma"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Allowed Categories (Comma separated)</label>
                    <input
                      type="text"
                      value={ruleCategory}
                      onChange={(e) => setRuleCategory(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                      placeholder="e.g. OBC, SC, ST, General"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <input
                    id="ruleDisability"
                    type="checkbox"
                    checked={ruleDisability}
                    onChange={(e) => setRuleDisability(e.target.checked)}
                    className="h-4.5 w-4.5 text-blue-600 rounded"
                  />
                  <label htmlFor="ruleDisability" className="text-xs font-medium text-gray-700">
                    Require disability status (Physically Disabled)
                  </label>
                </div>
              </div>

              {/* Required Documents */}
              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-bold text-gray-800 text-sm border-b pb-1">3. Checklist Documents</h4>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Required Documents (Comma separated)</label>
                  <input
                    type="text"
                    value={documentsStr}
                    onChange={(e) => setDocumentsStr(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                    placeholder="e.g. Aadhaar Card, Income Certificate, College Fee Receipt"
                  />
                </div>
              </div>

              <div className="pt-6 border-t flex justify-end gap-3 sticky bottom-0 bg-white pb-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm disabled:opacity-50 inline-flex items-center"
                >
                  {submitting && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}
                  Save Scholarship
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
