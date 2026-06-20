'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '../stores/authStore';
import { BookOpen, User, LogOut, Compass, MessageSquare, Columns, Bell, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { user, isAuthenticated, logout, getMe, loadProfile } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Initial verification of JWT tokens on reload
    if (localStorage.getItem('bc_access_token')) {
      getMe();
      loadProfile();
    }
  }, [getMe, loadProfile]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const isActive = (path: string) => pathname === path;

  const linkClass = (path: string) =>
    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
      isActive(path)
        ? 'border-blue-600 text-blue-600'
        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
    }`;

  const mobileLinkClass = (path: string) =>
    `block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors ${
      isActive(path)
        ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
    }`;

  return (
    <nav className="bg-white shadow border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-2 text-blue-600 font-bold text-xl hover:opacity-90">
                <Compass className="w-7 h-7" />
                <span>Bureaucracy Copilot</span>
              </Link>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link href="/scholarships" className={linkClass('/scholarships')}>
                <BookOpen className="w-4 h-4 mr-1.5" />
                Explore
              </Link>
              <Link href="/assistant" className={linkClass('/assistant')}>
                <MessageSquare className="w-4 h-4 mr-1.5" />
                AI Assistant
              </Link>
              {isAuthenticated && (
                <>
                  <Link href="/dashboard" className={linkClass('/dashboard')}>
                    Dashboard
                  </Link>
                  <Link href="/saved" className={linkClass('/saved')}>
                    Saved
                  </Link>
                  <Link href="/applications" className={linkClass('/applications')}>
                    <Columns className="w-4 h-4 mr-1.5" />
                    Tracker
                  </Link>
                  {user?.role === 'ADMIN' && (
                    <Link href="/admin" className={linkClass('/admin')}>
                      <Shield className="w-4 h-4 mr-1.5 text-orange-500" />
                      Admin
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link href="/notifications" className="p-1.5 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-50 relative">
                  <Bell className="w-5 h-5" />
                </Link>
                <div className="flex items-center space-x-2 border border-gray-200 rounded-full px-3 py-1.5 bg-gray-50">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-50 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 text-red-500" />
                </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link
                  href="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 border-blue-100 transition-all"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0/96 960 960"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M120 240h720v80H120v-80zm0 200h720v80H120v-80zm0 200h720v80H120v-80z" />
              </svg>
              <svg
                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0/96 960 960"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M240 300l240 240 240-240v60L480 600 240 360v-60z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden bg-white border-b border-gray-100">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/scholarships" className={mobileLinkClass('/scholarships')} onClick={() => setIsOpen(false)}>
              Explore Scholarships
            </Link>
            <Link href="/assistant" className={mobileLinkClass('/assistant')} onClick={() => setIsOpen(false)}>
              AI Assistant
            </Link>
            {isAuthenticated && (
              <>
                <Link href="/dashboard" className={mobileLinkClass('/dashboard')} onClick={() => setIsOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/saved" className={mobileLinkClass('/saved')} onClick={() => setIsOpen(false)}>
                  Saved
                </Link>
                <Link href="/applications" className={mobileLinkClass('/applications')} onClick={() => setIsOpen(false)}>
                  Tracker
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link href="/admin" className={mobileLinkClass('/admin')} onClick={() => setIsOpen(false)}>
                    Admin Panel
                  </Link>
                )}
              </>
            )}
          </div>
          <div className="pt-4 pb-4 border-t border-gray-100">
            {isAuthenticated ? (
              <div className="space-y-1">
                <div className="px-4 py-2 text-xs font-semibold text-gray-400">LOGGED IN AS</div>
                <div className="px-4 py-1 text-sm font-bold text-gray-700">{user?.name}</div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-gray-50 transition-colors"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="space-y-2 px-4">
                <Link
                  href="/login"
                  className="block w-full text-center px-4 py-2 border border-blue-500 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
