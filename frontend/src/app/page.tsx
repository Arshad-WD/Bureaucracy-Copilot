'use client';

import Link from 'next/link';
import { Compass, BookOpen, MessageSquare, Columns, ArrowRight, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

export default function Home() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 text-white py-20 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.15),transparent_45%)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none">
                Find Scholarships You <span className="text-blue-400">Qualify</span> For
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 font-light max-w-2xl">
                Answer a few simple questions about your academic background and income, and discover personalized welfare benefits, scholarships, and state incentives in 60 seconds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  href={isAuthenticated ? '/dashboard' : '/register'}
                  className="inline-flex items-center justify-center px-6 py-3.5 text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all group"
                >
                  Start Eligibility Quiz
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/scholarships"
                  className="inline-flex items-center justify-center px-6 py-3.5 text-base font-medium rounded-xl text-gray-300 bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20 transition-all"
                >
                  Browse Catalog
                </Link>
              </div>
            </div>
            
            <div className="lg:col-span-5 hidden lg:block">
              <div className="relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-500/30 rounded-xl flex items-center justify-center border border-blue-400/20">
                  <MessageSquare className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-4 pl-8">AI Assistant Guidance</h3>
                <div className="space-y-4 text-sm font-light text-gray-300">
                  <div className="p-3.5 rounded-lg bg-white/5 border border-white/5">
                    <p className="font-medium text-white mb-1">Q: Am I eligible for NSP scholarships?</p>
                    <p className="text-gray-400 text-xs">A: Based on your engineering status and family income below 6L, yes! You qualify.</p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-white/5 border border-white/5">
                    <p className="font-medium text-white mb-1">Q: What documents are required?</p>
                    <p className="text-gray-400 text-xs">A: Domicile Certificate, Annual Income Certificate, and academic marksheets.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Get Your Benefits in Three Steps
            </h2>
            <p className="text-lg text-gray-600 font-light">
              We translate bureaucratic rules into simple recommendations, so you never miss out on eligible funding.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative p-8 rounded-2xl border border-gray-100 bg-gray-50/50 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Complete Profile</h3>
              <p className="text-gray-600 text-sm font-light leading-relaxed">
                Add your region, income bracket, education details, and category to populate your eligibility profile.
              </p>
            </div>

            <div className="relative p-8 rounded-2xl border border-gray-100 bg-gray-50/50 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Get Matched</h3>
              <p className="text-gray-600 text-sm font-light leading-relaxed">
                Our rule evaluator computes match percentages against state and national guidelines instantly.
              </p>
            </div>

            <div className="relative p-8 rounded-2xl border border-gray-100 bg-gray-50/50 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Apply Successfully</h3>
              <p className="text-gray-600 text-sm font-light leading-relaxed">
                Receive precise document checklists, deadline notifications, and tracking boards to finalize your applications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Scholarships */}
      <section className="py-20 bg-gray-50 border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">Featured Opportunities</h2>
              <p className="text-gray-600 mt-2 font-light">Index of schemes open for current academic year</p>
            </div>
            <Link href="/scholarships" className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center mt-4 md:mt-0">
              View all scholarships
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200/60 shadow-sm flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-1 text-xs font-semibold bg-green-50 text-green-700 rounded-full border border-green-200">
                  National Opportunity
                </span>
                <h3 className="text-lg font-bold mt-4 text-gray-900">National Merit Scholarship (NSP)</h3>
                <p className="text-gray-500 text-xs mt-1">Provider: Central Government of India</p>
                <p className="text-gray-600 text-sm mt-3 line-clamp-2">
                  Central Government scheme to support merit-based students from low-income families.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                <div>
                  <span className="text-gray-400 block text-xs">BENEFIT</span>
                  <span className="font-bold text-gray-900">₹50,000 / year</span>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 block text-xs">DEADLINE</span>
                  <span className="font-bold text-amber-600">Dec 15, 2026</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200/60 shadow-sm flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                  State Scheme
                </span>
                <h3 className="text-lg font-bold mt-4 text-gray-900">Maharashtra State Merit Scholarship</h3>
                <p className="text-gray-500 text-xs mt-1">Provider: Government of Maharashtra</p>
                <p className="text-gray-600 text-sm mt-3 line-clamp-2">
                  State welfare scheme supporting degree students residing in Maharashtra State with partial tuition fee waiver.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                <div>
                  <span className="text-gray-400 block text-xs">BENEFIT</span>
                  <span className="font-bold text-gray-900">₹25,000 / year</span>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 block text-xs">DEADLINE</span>
                  <span className="font-bold text-amber-600">Nov 30, 2026</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200/60 shadow-sm flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-1 text-xs font-semibold bg-purple-50 text-purple-700 rounded-full border border-purple-200">
                  Fellowship
                </span>
                <h3 className="text-lg font-bold mt-4 text-gray-900">Minority Students Fellowship</h3>
                <p className="text-gray-500 text-xs mt-1">Provider: Ministry of Minority Affairs</p>
                <p className="text-gray-600 text-sm mt-3 line-clamp-2">
                  Tuition support scheme targeting higher education students from religious and linguistic minority groups.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                <div>
                  <span className="text-gray-400 block text-xs">BENEFIT</span>
                  <span className="font-bold text-gray-900">₹30,000 / year</span>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 block text-xs">DEADLINE</span>
                  <span className="font-bold text-amber-600">Oct 10, 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
