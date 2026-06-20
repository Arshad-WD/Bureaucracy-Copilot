'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../stores/authStore';
import { api } from '../../services/api';
import { Bell, Check, Loader2, AlertCircle, HelpCircle } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('bc_access_token')) {
      router.push('/login');
      return;
    }
    fetchList();
  }, [router]);

  const handleMarkRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      // Update local state
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch {}
  };

  return (
    <div className="flex-grow max-w-4xl mx-auto w-full py-8 px-4 sm:px-6 space-y-6">
      <div className="border-b pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 inline-flex items-center">
            <Bell className="w-8 h-8 text-blue-600 mr-2.5" />
            Notifications
          </h1>
          <p className="text-gray-500 text-sm font-light mt-1">Deadlines, matches, and application alerts history</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white p-12 border rounded-2xl text-center max-w-lg mx-auto space-y-4">
          <HelpCircle className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-lg font-bold text-gray-800">No notifications</h3>
          <p className="text-gray-500 text-sm font-light">
            You will receive alerts when saved scholarship deadlines are closing soon.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-5 rounded-2xl border transition-all flex justify-between items-start gap-4 ${
                n.read
                  ? 'bg-white border-gray-200/60'
                  : 'bg-blue-50/30 border-blue-100 hover:bg-blue-50/50'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 block flex-shrink-0" />
                  )}
                  <h4 className="font-bold text-gray-900 text-sm">{n.title}</h4>
                </div>
                <p className="text-gray-600 text-xs leading-relaxed font-light">{n.message}</p>
                <span className="text-[10px] text-gray-400 block pt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>

              {!n.read && (
                <button
                  onClick={() => handleMarkRead(n.id)}
                  className="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg text-xs font-semibold flex items-center justify-center"
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
