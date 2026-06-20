'use client';

import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { AuthProvider } from '@/context/AuthContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
        {/* Left Hand Sidebar Navigation Frame */}
        <Sidebar />

        {/* Right Hand App Core View Window Container */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Level Adaptive Navigation Banner */}
          <Header />

          {/* Core Sub Route Content Render Area Window Pipeline injector */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-950 p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}