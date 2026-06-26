'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';

export default function Sidebar() {
  const { activeRole, switchRole, currentUser } = useAuth();
  
  // Simulated fallback routing array mapping paths
  const navigationItems = [
  { 
    label: 'Dashboard', 
    path: '/dashboard', 
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' 
  },
  { 
    label: 'Projects', 
    path: '/dashboard/projects', 
    icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z' 
  },
  { 
    label: 'Tasks', 
    path: '/dashboard/tasks', 
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' 
  },
  { 
    label: 'User Management', 
    path: '/dashboard/users', 
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' 
  }
];

  return (
    <aside className="w-64 border-r border-slate-800/60 bg-slate-900/40 backdrop-blur-xl h-screen flex flex-col justify-between p-4 z-20">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-2 px-2 py-1">
          <svg className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className="font-mono text-xs font-bold tracking-widest text-slate-300">Task Tracking</span>
        </div>

        {/* Dynamic Context Links Navigation */}
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <a
              key={item.label}
              href={item.path}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800/40 border border-transparent hover:border-slate-800/50 transition-all group"
            >
              <svg className="h-4 w-4 text-slate-500 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              {item.label}
            </a>
          ))}

          {/* Conditional Admin Only Route Group Guard */}
          {activeRole === 'ADMIN' && (
            <a
              href="/dashboard/user-management"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-indigo-600/5 border border-transparent hover:border-indigo-500/10 transition-all group"
            >
              <svg className="h-4 w-4 text-slate-500 group-hover:text-rose-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="flex-1">User Management</span>
              <span className="text-[9px] bg-rose-500/10 border border-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded-md font-mono font-bold tracking-tight">ROOT</span>
            </a>
          )}
        </nav>
      </div>

      {/* Runtime Dev Simulation Switching Hub Controls */}
      <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 space-y-2">
        <div className="text-[10px] text-slate-500 font-mono tracking-wider uppercase text-center border-b border-slate-800/40 pb-1.5">
          Dev Environment Swap
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => switchRole('ADMIN')}
            className={`text-[11px] font-mono font-bold py-1.5 rounded-lg transition-colors border ${
              activeRole === 'ADMIN'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/10'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            ADMIN
          </button>
          <button
            onClick={() => switchRole('MEMBER')}
            className={`text-[11px] font-mono font-bold py-1.5 rounded-lg transition-colors border ${
              activeRole === 'MEMBER'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/10'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            MEMBER
          </button>
        </div>
        <div className="text-[10px] text-slate-400 font-medium truncate text-center pt-1 block">
          Ctx: <span className="text-slate-300 font-mono">{currentUser.name.split(' ')[0]}</span>
        </div>
      </div>
    </aside>
  );
}