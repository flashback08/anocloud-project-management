'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UserRole } from '@/types';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('MEMBER');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('All core validation configuration inputs are mandatory.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = '/login';
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none animate-glow" />
      <div className="w-full max-w-md z-10">
        <Card variant="glass">
          <CardHeader className="text-center space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-100 via-indigo-200 to-cyan-200 bg-clip-text text-transparent">
              Create Secure Identity
            </h1>
            <p className="text-xs text-slate-400">Instantiate platform tenancy allocation</p>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <Input
                label="Full Handle User Name"
                type="text"
                placeholder="Alex Rivera"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                label="System Route Mapping Email"
                type="email"
                placeholder="name@anocloud.internal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Primary Pass Key Phrase"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase pl-0.5">
                  Requested Security Allocation
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full bg-slate-950/50 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm focus:outline-none text-white transition-colors shadow-inner appearance-none"
                >
                  <option value="MEMBER">Member (Standard Task Scope)</option>
                  <option value="ADMIN">Admin (Root System Management Context)</option>
                </select>
              </div>
              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 font-medium">
                  ⚠️ {error}
                </div>
              )}
              <Button type="submit" variant="primary" className="w-full mt-2" isLoading={isLoading}>
                Deploy Identity Matrix
              </Button>
            </form>
          </CardBody>
          <CardFooter className="justify-center text-xs text-slate-500 border-t border-slate-800/40 pt-4">
            <a href="/login" className="text-indigo-400 hover:underline">Return to Access Gateway</a>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}