'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useScholarshipStore } from '../../stores/scholarshipStore';
import { useAuthStore } from '../../stores/authStore';
import { useTrackerStore } from '../../stores/trackerStore';
import { FolderHeart, Trash2, ArrowRight, Table, ExternalLink } from 'lucide-react';

export default function SavedPage() {
  const router = useRouter();
  const { saved, fetchSaved, unsaveScholarship } = useScholarshipStore();
  const { createApplication } = useTrackerStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!localStorage.getItem('bc_access_token')) {
      router.push('/login');
      return;
    }
    fetchSaved();
  }, [router, fetchSaved]);

  const handleUnsave = async (id: string) => {
    await unsaveScholarship(id);
  };

  const handleTrack = async (id: string) => {
    await createApplication(id, 'INTERESTED');
    router.push('/applications');
  };

  return (
    <div className="flex-grow max-w-7xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-extrabold text-gray-900 inline-flex items-center">
          <FolderHeart className="w-8 h-8 text-red-500 mr-2.5" />
          Saved Scholarships
        </h1>
        <p className="text-gray-500 text-sm font-light mt-1">Keep track of interesting schemes and track deadlines</p>
      </div>

      {saved.length === 0 ? (
        <div className="bg-white p-16 border rounded-2xl text-center max-w-2xl mx-auto space-y-4">
          <FolderHeart className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-lg font-bold text-gray-800">No saved scholarships</h3>
          <p className="text-gray-500 text-sm font-light">
            You haven't bookmarked any opportunities yet.
          </p>
          <Link
            href="/scholarships"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider text-left">
              <tr>
                <th className="px-6 py-3.5">Scheme Details</th>
                <th className="px-6 py-3.5">Provider</th>
                <th className="px-6 py-3.5">Benefit</th>
                <th className="px-6 py-3.5">Deadline</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm text-gray-600">
              {saved.map((item: any) => {
                const s = item.scholarship || item;
                const sId = s.id || item.scholarshipId;
                return (
                  <tr key={item.id || sId} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <Link href={`/scholarships/${sId}`} className="font-bold text-gray-900 hover:text-blue-600">
                        {s.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-gray-500">{s.provider}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">₹{s.amount?.toLocaleString()}</td>
                    <td className="px-6 py-4 font-medium text-amber-600">
                      {s.deadline ? new Date(s.deadline).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button
                        onClick={() => handleTrack(sId)}
                        className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-700"
                      >
                        Track Application
                        <ExternalLink className="w-3.5 h-3.5 ml-1" />
                      </button>
                      <button
                        onClick={() => handleUnsave(sId)}
                        className="inline-flex items-center text-red-500 hover:text-red-700"
                        title="Remove Bookmark"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
