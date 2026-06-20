'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { currentUser, activeRole } = useAuth();

  return (
    <header className="h-16 border-b border-slate-800/60 bg-slate-900/20 backdrop-blur-xl px-6 flex items-center justify-between w-full z-10">
      {/* Greetings Dynamic Context Area */}
      <div className="flex flex-col">
        <h4 className="text-xs text-slate-400 font-medium">
          Cluster Context Operations Node
        </h4>
        <span className="text-xs font-semibold text-slate-200">
          Greeting, {currentUser.name} // Status: <span className="text-emerald-400">{activeRole}</span>
        </span>
      </div>

      {/* Profiling Controls & Trays Area Layout */}
      <div className="flex items-center gap-4">
        {/* Fixed Placeholder Zone: Notification Tray Hook */}
        <button className="h-8 w-8 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors relative">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {/* Signal Pulse Indicator Badge */}
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-indigo-500 rounded-full animate-ping" />
        </button>

        {/* Separation Rule border element */}
        <div className="h-6 w-[1px] bg-slate-800" />

        {/* Profile Avatar Frame Node */}
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 p-[1px]">
            <div className="h-full w-full bg-slate-950 rounded-[11px] flex items-center justify-center font-mono font-bold text-xs text-indigo-300">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}