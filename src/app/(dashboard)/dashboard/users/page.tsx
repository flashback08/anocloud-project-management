import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { deleteUserAction } from '@/app/actions/authActions';

export const dynamic = 'force-dynamic';

export default async function UserManagementPage() {
  const cookieStore = await cookies();
  const sessionEmail = cookieStore.get('active_session_email')?.value;

  if (!sessionEmail) redirect('/');
  const activeUser = await prisma.user.findUnique({ where: { email: sessionEmail } });
  if (!activeUser) redirect('/');

  const users = await prisma.user.findMany({ orderBy: { createdAt: 'asc' } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">User Management</h1>
        <p className="text-xs text-slate-400 font-mono">System identities inside public.users schema</p>
      </div>

      <div className="space-y-2">
        {users.map((u) => (
          <div key={u.id} className="bg-slate-900/40 border border-slate-800/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-800 transition-colors">
            <div className="flex flex-wrap items-center gap-3">
              <div className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-300">
                {u.id}
              </div>
              <div>
                <span className="text-sm font-bold text-slate-200">{u.name}</span>
                <span className="text-xs text-slate-500 block font-mono">{u.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold border ${
                u.role === 'ADMIN' 
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {u.role}
              </span>

              {u.id !== activeUser.id ? (
                <form action={deleteUserAction}>
                  <input type="hidden" name="userId" value={u.id} />
                  <input type="hidden" name="operatorId" value={activeUser.id} />
                  <button type="submit" className="px-3 py-1 bg-rose-950/40 hover:bg-rose-900/50 text-rose-400 border border-rose-900/30 font-mono text-xs rounded-lg transition-all">
                    Drop Row [🗑️]
                  </button>
                </form>
              ) : (
                <span className="text-[10px] font-mono text-slate-600 italic px-2">Active Node</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}