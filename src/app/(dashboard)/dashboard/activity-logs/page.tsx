import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function ActivityLogsPage() {
  const cookieStore = await cookies();
  const sessionEmail = cookieStore.get('active_session_email')?.value;

  if (!sessionEmail) redirect('/');

  const activeUser = await prisma.user.findUnique({ where: { email: sessionEmail } });
  if (!activeUser) redirect('/');

  // Fetch the latest 50 logs matching the custom table schema parameters definition
  const auditLogs = await prisma.activityLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: { user: true }
  });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 p-8 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <Link href="/dashboard" className="hover:text-slate-300 transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-slate-300">Audit Center</span>
          <span>/</span>
          <span className="text-indigo-400 font-mono">ActivityLogsTable</span>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 rounded-2xl flex justify-between items-center shadow-xl">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Activity Transaction Audit Ledger</h1>
            <p className="text-xs text-slate-400 font-mono">TABLESPACE public.activity_logs schema entries</p>
          </div>
          <Link href="/dashboard">
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold rounded-xl transition-all shadow-md">
              ← Return To System Dashboard
            </button>
          </Link>
        </div>

        {/* LOG RECORD TABLE GRID ROSTER VIEW */}
        <div className="border border-slate-800 rounded-xl bg-slate-950 overflow-x-auto shadow-2xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                <th className="p-3.5">Log Primary Key ID</th>
                <th className="p-3.5">Operator Identity Name</th>
                <th className="p-3.5">Action Code Event</th>
                <th className="p-3.5">Target Entity Typename</th>
                <th className="p-3.5">Target entity_id Key String</th>
                <th className="p-3.5 text-right">Logged UTC Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 font-mono text-slate-300">
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-12 text-slate-500 italic font-sans text-xs">
                    No administrative audit events currently intercepted inside tablespace streams.
                  </td>
                </tr>
              ) : (
                auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/40 text-[11px]">
                    <td className="p-3.5 text-slate-500 truncate max-w-[100px]" title={log.id}>{log.id}</td>
                    <td className="p-3.5 text-white font-sans font-medium">{log.user?.name || log.userId}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        log.action.includes('DELETE') ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                        log.action.includes('CREATE') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400 font-bold">{log.entityType}</td>
                    <td className="p-3.5 text-indigo-300 truncate max-w-[120px]" title={log.entityId}>{log.entityId}</td>
                    <td className="p-3.5 text-right text-slate-500 font-sans">{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </main>
  );
}