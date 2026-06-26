'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/app/actions/authActions';

interface NavProps {
  userEmail: string;
  userName: string;
  userRole: string;
}

export default function DashboardNav({ userEmail, userName, userRole }: NavProps) {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Projects', href: '/dashboard/projects' },
    { name: 'Tasks', href: '/dashboard/tasks' },
    { name: 'User Management', href: '/dashboard/users' },
  ];

  return (
    <div className="space-y-4">
      {/* SECURITY METRICS AND FORCE LOGOUT */}
      <div className="w-full bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <p className="text-xs font-mono text-slate-300">
            Active Node: <span className="text-white font-bold">{userName} ({userRole})</span> — <span className="text-slate-400">{userEmail}</span>
          </p>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="px-4 py-1.5 bg-rose-600/90 hover:bg-rose-500 text-white font-mono text-xs font-bold rounded-xl transition-all shadow-md">
            TERMINATE SESSION [🚪]
          </button>
        </form>
      </div>

      {/* CORE TOP SECTION MATRIX ROUTER NAVIGATION */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
        <div className="flex flex-wrap items-center gap-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href}>
                <button className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all border ${
                  isActive 
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-500/10 shadow-lg' 
                    : 'bg-slate-950 text-slate-400 border-slate-900 hover:text-slate-200 hover:border-slate-800'
                }`}>
                  {link.name}
                </button>
              </Link>
            );
          })}
        </div>

        <Link href="/dashboard/activity-logs" className="shrink-0">
          <button className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-mono text-xs font-bold rounded-xl transition-all shadow-md">
            See Activity Logs 📊
          </button>
        </Link>
      </div>
    </div>
  );
}