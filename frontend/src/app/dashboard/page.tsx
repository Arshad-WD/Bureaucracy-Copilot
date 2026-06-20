'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../stores/authStore';
import { useScholarshipStore } from '../../stores/scholarshipStore';
import { useTrackerStore } from '../../stores/trackerStore';
import { Award, Calendar, FolderHeart, ShieldCheck, FileCheck, ArrowRight, Compass, HelpCircle } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile } = useAuthStore();
  
  const { recommendations, fetchRecommendations, saveScholarship, saved, fetchSaved } = useScholarshipStore();
  const { applications, fetchApplications } = useTrackerStore();

  useEffect(() => {
    if (!localStorage.getItem('bc_access_token')) {
      router.push('/login');
      return;
    }

    fetchRecommendations();
    fetchSaved();
    fetchApplications();
  }, [router, fetchRecommendations, fetchSaved, fetchApplications]);

  const handleSave = async (id: string) => {
    await saveScholarship(id);
  };

  const isSaved = (id: string) => saved.some(s => s.id === id || (s as any).scholarshipId === id);

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-amber-600 bg-amber-50 border-amber-200';
  };

  // Compile timeline deadlines
  const upcomingDeadlines = recommendations
    .filter(rec => {
      const match = useScholarshipStore.getState().scholarships.find(s => s.id === rec.scholarshipId);
      return match && match.deadline;
    })
    .map(rec => {
      const match = useScholarshipStore.getState().scholarships.find(s => s.id === rec.scholarshipId)!;
      return {
        id: match.id,
        title: match.title,
        deadline: new Date(match.deadline!),
      };
    })
    .sort((a, b) => a.deadline.getTime() - b.deadline.getTime())
    .slice(0, 3);

  return (
    <div className="flex-grow max-w-7xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8">
      {/* Welcome banner */}
      <div className="relative bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl text-white p-8 md:p-12 mb-8 shadow-sm overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_50%)]"></div>
        <div className="relative z-10 space-y-2.5 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Welcome Back, {user?.name || 'Scholar'}
          </h1>
          <p className="text-blue-100 font-light text-base md:text-lg">
            We've scanned active guidelines against your profile. Here are your personalized matches.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/profile/setup"
              className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20 text-sm font-semibold rounded-lg transition-colors"
            >
              Update Match Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-gray-200/60 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-red-50 text-red-500 rounded-xl">
            <FolderHeart className="w-6 h-6" />
          </div>
          <div>
            <span className="text-gray-400 block text-xs uppercase font-bold tracking-wider">Saved Schemes</span>
            <span className="text-2xl font-black text-gray-900">{saved.length}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200/60 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-gray-400 block text-xs uppercase font-bold tracking-wider">In Progress</span>
            <span className="text-2xl font-black text-gray-900">
              {applications.filter(a => ['INTERESTED', 'PREPARING_DOCUMENTS', 'APPLIED', 'UNDER_REVIEW'].includes(a.status)).length}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200/60 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-green-50 text-green-500 rounded-xl">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-gray-400 block text-xs uppercase font-bold tracking-wider">Approved</span>
            <span className="text-2xl font-black text-gray-900">
              {applications.filter(a => a.status === 'APPROVED').length}
            </span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Recommended list */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-2xl font-black text-gray-900 inline-flex items-center">
              <Award className="w-6 h-6 text-blue-600 mr-2" />
              Matched Recommendations
            </h2>
            <Link href="/scholarships" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
              Browse Catalog
            </Link>
          </div>

          {recommendations.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200/60 p-12 text-center space-y-4">
              <HelpCircle className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="text-lg font-bold text-gray-800">No matching scholarships found</h3>
              <p className="text-gray-500 text-sm font-light max-w-md mx-auto">
                Fill out your match profile fully to allow the rule evaluator to fetch programs for you.
              </p>
              <Link
                href="/profile/setup"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
              >
                Setup Profile Now
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div
                  key={rec.scholarshipId}
                  className="bg-white p-6 rounded-2xl border border-gray-200/60 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getMatchColor(rec.score)}`}>
                        {rec.score}% Match
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{rec.title}</h3>
                    <div className="flex flex-wrap text-xs text-gray-500 gap-x-4 gap-y-1">
                      <span>Reason: {rec.reasons.slice(0, 2).join(', ')}</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-100 gap-2">
                    <Link
                      href={`/scholarships/${rec.scholarshipId}`}
                      className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 text-sm font-semibold rounded-lg transition-colors"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Link>
                    {!isSaved(rec.scholarshipId) ? (
                      <button
                        onClick={() => handleSave(rec.scholarshipId)}
                        className="text-xs text-gray-400 hover:text-blue-600 font-semibold"
                      >
                        Save for later
                      </button>
                    ) : (
                      <span className="text-xs text-green-600 font-semibold inline-flex items-center">
                        ✓ Saved
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Deadlines sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-2xl font-black text-gray-900">Upcoming Deadlines</h2>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200/60 shadow-sm space-y-6">
            {upcomingDeadlines.length === 0 ? (
              <p className="text-gray-500 text-sm font-light text-center py-4">
                No approaching deadlines for matched schemes.
              </p>
            ) : (
              <div className="flow-root">
                <ul className="-mb-8">
                  {upcomingDeadlines.map((item, idx) => (
                    <li key={item.id}>
                      <div className="relative pb-8">
                        {idx !== upcomingDeadlines.length - 1 && (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                        )}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                              <Calendar className="w-4 h-4" />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <Link href={`/scholarships/${item.id}`} className="text-sm font-bold text-gray-800 hover:text-blue-600">
                                {item.title}
                              </Link>
                            </div>
                            <div className="text-right text-xs font-semibold whitespace-nowrap text-amber-600">
                              {item.deadline.toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
