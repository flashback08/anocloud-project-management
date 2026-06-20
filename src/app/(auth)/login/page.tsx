'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('All core credential parameters are required.');
      return;
    }

    if (!email.includes('@')) {
      setError('Please supply a valid structured network identity email address.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = '/dashboard';
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none animate-glow" />
      <div className="w-full max-w-md z-10">
        <Card variant="glass">
          <CardHeader className="text-center space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-100 via-indigo-200 to-cyan-200 bg-clip-text text-transparent">
              Access Gateway Terminal
            </h1>
            <p className="text-xs text-slate-400">Initialize secure session handshake</p>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <Input
                label="Identity Mapping Email"
                type="email"
                placeholder="name@anocloud.internal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Secure Security Token Key"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 font-medium">
                  ⚠️ {error}
                </div>
              )}
              <Button type="submit" variant="primary" className="w-full mt-2" isLoading={isLoading}>
                Authorize Credentials
              </Button>
            </form>
          </CardBody>
          <CardFooter className="justify-between text-xs text-slate-500 border-t border-slate-800/40 pt-4">
            <span>Core Version // 2026.1</span>
            <a href="/register" className="text-indigo-400 hover:underline">Register Root Profile</a>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}