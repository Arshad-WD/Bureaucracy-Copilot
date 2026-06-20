'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTrackerStore, Application } from '../../stores/trackerStore';
import { useAuthStore } from '../../stores/authStore';
import { Columns, Calendar, ArrowRight, HelpCircle, FileCheck, Layers } from 'lucide-react';

export default function ApplicationsPage() {
  const router = useRouter();
  const { applications, fetchApplications, updateApplicationStatus } = useTrackerStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!localStorage.getItem('bc_access_token')) {
      router.push('/login');
      return;
    }
    fetchApplications();
  }, [router, fetchApplications]);

  const columns = [
    { id: 'INTERESTED', name: 'Interested', color: 'border-t-gray-400 bg-gray-50/50' },
    { id: 'PREPARING_DOCUMENTS', name: 'Preparing Docs', color: 'border-t-blue-500 bg-blue-50/20' },
    { id: 'APPLIED', name: 'Applied', color: 'border-t-amber-500 bg-amber-50/20' },
    { id: 'UNDER_REVIEW', name: 'Under Review', color: 'border-t-purple-500 bg-purple-50/20' },
    { id: 'APPROVED', name: 'Approved', color: 'border-t-green-500 bg-green-50/20' },
    { id: 'REJECTED', name: 'Rejected', color: 'border-t-red-500 bg-red-50/20' },
  ];

  const handleStatusChange = async (appId: string, newStatus: string) => {
    await updateApplicationStatus(appId, newStatus);
  };

  const getCardsForColumn = (columnId: string) => {
    return applications.filter((app) => app.status === columnId);
  };

  return (
    <div className="flex-grow max-w-7xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="border-b pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 inline-flex items-center">
            <Columns className="w-8 h-8 text-blue-600 mr-2.5" />
            Application Tracker
          </h1>
          <p className="text-gray-500 text-sm font-light mt-1">Manage steps and files for active scholarship applications</p>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white p-16 border rounded-2xl text-center max-w-2xl mx-auto space-y-4">
          <HelpCircle className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-lg font-bold text-gray-800">No active applications tracked</h3>
          <p className="text-gray-500 text-sm font-light">
            Go to any scholarship detail page and click "Update Tracker Board" to map it here.
          </p>
          <a
            href="/scholarships"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
          >
            Explore Opportunities
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-6">
          {columns.map((col) => {
            const cards = getCardsForColumn(col.id);
            return (
              <div
                key={col.id}
                className={`flex-shrink-0 min-w-[180px] p-4 rounded-xl border border-gray-200/60 shadow-sm border-t-4 ${col.color} flex flex-col h-[500px] overflow-y-auto`}
              >
                <div className="flex justify-between items-center mb-4 pb-2 border-b">
                  <span className="font-bold text-gray-800 text-sm">{col.name}</span>
                  <span className="bg-gray-200/80 text-gray-700 text-xs px-2 py-0.5 rounded-full font-bold">
                    {cards.length}
                  </span>
                </div>

                <div className="space-y-3 flex-grow overflow-y-auto">
                  {cards.map((app) => (
                    <div
                      key={app.id}
                      className="bg-white p-3 rounded-lg border border-gray-200/60 shadow-sm space-y-2 hover:border-blue-400 transition-colors"
                    >
                      <h4 className="font-bold text-gray-900 text-xs line-clamp-2">
                        {app.scholarship?.title}
                      </h4>
                      <div className="text-[10px] text-gray-500 space-y-1">
                        <p>Benefit: ₹{app.scholarship?.amount?.toLocaleString()}</p>
                        <p className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1 text-amber-600" />
                          Deadline:{' '}
                          {app.scholarship?.deadline
                            ? new Date(app.scholarship.deadline).toLocaleDateString()
                            : 'N/A'}
                        </p>
                      </div>

                      {/* Dropdown status update */}
                      <div className="pt-2 border-t mt-2">
                        <label className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                          Move to
                        </label>
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          className="w-full px-1.5 py-1 border border-gray-200 rounded text-[10px] bg-white text-gray-700 focus:outline-none"
                        >
                          <option value="INTERESTED">Interested</option>
                          <option value="PREPARING_DOCUMENTS">Preparing Docs</option>
                          <option value="APPLIED">Applied</option>
                          <option value="UNDER_REVIEW">Under Review</option>
                          <option value="APPROVED">Approved</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
