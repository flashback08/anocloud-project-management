'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction, registerAccountAction } from '@/app/actions/authActions';

export default function Home() {
  const router = useRouter();
  const [loginErr, setLoginErr] = useState('');
  const [regErr, setRegErr] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const res = await loginAction(data);
    if (res.success) {
      router.push('/dashboard');
      router.refresh();
    } else {
      setLoginErr(res.error || 'Authentication denied.');
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const res = await registerAccountAction(data);
    if (res.success) {
      router.push('/dashboard');
      router.refresh();
    } else {
      setRegErr(res.error || 'Registration failed.');
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* LOGIN FORM MODULE */}
        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl space-y-4 shadow-xl">
          <div>
            <h2 className="text-xl font-bold text-white">Console Session Initialization</h2>
            <p className="text-xs text-slate-400">Access active operator environment parameters</p>
          </div>
          {loginErr && <p className="text-xs text-rose-400 font-mono">{loginErr}</p>}
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Identity Email Context</label>
              <input name="email" type="email" required placeholder="alex.rivera@anocloud.internal" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-slate-700"/>
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2.5 rounded-xl transition-all">
              Initialize Active Session
            </button>
          </form>
        </div>

        {/* REGISTER ACCOUNT FORM (public.users SCHEMA compliant) */}
        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl space-y-4 shadow-xl">
          <div>
            <h2 className="text-xl font-bold text-white">Register Account Node</h2>
            <p className="text-xs text-slate-400">Inject new immutable operator row entity to public.users</p>
          </div>
          {regErr && <p className="text-xs text-rose-400 font-mono">{regErr}</p>}
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">User Primary ID Key (id) *</label>
              <input name="id" type="text" required placeholder="usr_dev_100" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-700"/>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Account Display Name (name) *</label>
              <input name="name" type="text" required placeholder="Evelyn Foster" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-700"/>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Email Coordinates (email) *</label>
              <input name="email" type="email" required placeholder="evelyn@anocloud.internal" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-700"/>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">System UserRole Domain Selection</label>
              <select name="role" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none">
                <option value="MEMBER">MEMBER</option>
                <option value="DEVELOPER">DEVELOPER</option>
                <option value="PROJECT_MANAGER">PROJECT_MANAGER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2.5 rounded-xl transition-all">
              Commit New User Entity Row
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}