'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useScholarshipStore } from '../../stores/scholarshipStore';
import { useAuthStore } from '../../stores/authStore';
import { Search, SlidersHorizontal, BookOpen, Calendar, HelpCircle, Save } from 'lucide-react';

export default function ScholarshipsPage() {
  const { scholarships, fetchScholarships, searchScholarships, saveScholarship, saved, fetchSaved, loading } = useScholarshipStore();
  const { isAuthenticated } = useAuthStore();

  const [keyword, setKeyword] = useState('');
  
  // Active Filter state
  const [selectedState, setSelectedState] = useState('');
  const [selectedEducation, setSelectedEducation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchScholarships({
      state: selectedState || undefined,
      education: selectedEducation || undefined,
    });
    if (isAuthenticated) {
      fetchSaved();
    }
  }, [fetchScholarships, fetchSaved, isAuthenticated, selectedState, selectedEducation, selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      searchScholarships(keyword, selectedState || undefined);
    } else {
      fetchScholarships({
        state: selectedState || undefined,
        education: selectedEducation || undefined,
      });
    }
  };

  const handleClearFilters = () => {
    setSelectedState('');
    setSelectedEducation('');
    setSelectedCategory('');
    setKeyword('');
    fetchScholarships();
  };

  const handleSave = async (id: string) => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    await saveScholarship(id);
  };

  const isSaved = (id: string) => saved.some(s => s.id === id || (s as any).scholarshipId === id);

  return (
    <div className="flex-grow max-w-7xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Explore Scholarships</h1>
        <form onSubmit={handleSearchSubmit} className="flex gap-3 max-w-2xl">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search by keywords (e.g. Merit, Minority, NSP...)"
              className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Side Filters */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-gray-200/60 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-md font-bold text-gray-900 inline-flex items-center">
              <SlidersHorizontal className="w-4 h-4 mr-2 text-gray-500" />
              Filter By
            </h2>
            <button
              onClick={handleClearFilters}
              className="text-xs text-blue-600 hover:text-blue-500 font-semibold"
            >
              Reset
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">State</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
              >
                <option value="">All States</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Delhi">Delhi</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Education Level</label>
              <select
                value={selectedEducation}
                onChange={(e) => setSelectedEducation(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
              >
                <option value="">All Levels</option>
                <option value="School (up to 10th)">School</option>
                <option value="Higher Secondary (11th-12th)">Higher Secondary</option>
                <option value="Diploma">Diploma</option>
                <option value="Engineering">Engineering</option>
                <option value="Medicine">Medicine</option>
                <option value="Undergraduate">Undergraduate</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
              >
                <option value="">All Categories</option>
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="Minority">Minority</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Listing Grid */}
        <div className="lg:col-span-9 space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white p-6 rounded-2xl border border-gray-200/60 shadow-sm animate-pulse h-40"></div>
              ))}
            </div>
          ) : scholarships.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-gray-200/60 shadow-sm text-center space-y-4">
              <HelpCircle className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="text-lg font-bold text-gray-800">No scholarships found</h3>
              <p className="text-gray-500 text-sm font-light">
                No active records match the selected keyword or region filters.
              </p>
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {scholarships.map((s) => (
                <div
                  key={s.id}
                  className="bg-white p-6 rounded-2xl border border-gray-200/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <span className="px-2 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                        {s.provider}
                      </span>
                      {isSaved(s.id) && (
                        <span className="text-xs text-green-600 font-bold">✓ Saved</span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{s.title}</h3>
                    <p className="text-gray-600 text-sm font-light line-clamp-2 leading-relaxed">
                      {s.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                    <div>
                      <span className="text-gray-400 block text-xs">BENEFIT</span>
                      <span className="font-bold text-gray-900">₹{s.amount.toLocaleString()}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-400 block text-xs">DEADLINE</span>
                      <span className="font-bold text-amber-600">
                        {s.deadline ? new Date(s.deadline).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 flex gap-2">
                    <Link
                      href={`/scholarships/${s.id}`}
                      className="flex-grow inline-flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 text-xs font-semibold rounded-lg transition-colors"
                    >
                      View Details
                    </Link>
                    {!isSaved(s.id) && (
                      <button
                        onClick={() => handleSave(s.id)}
                        className="px-3 py-2 border border-gray-200 hover:bg-gray-50 text-gray-500 rounded-lg"
                        title="Save Bookmark"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
