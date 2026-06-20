'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { verifyUserContext } from '@/app/actions/authActions';

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSystemAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('All authorization fields must be populated.');
      return;
    }

    setIsLoading(true);

    // CRITICAL: We hit the Server Action directly. No mock data fallbacks!
    const validationResult = await verifyUserContext(email);

    if (validationResult.success) {
      router.push('/dashboard');
    } else {
      setError(validationResult.error || 'Access denied.');
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
      <div className="w-full max-w-md z-10">
        <Card variant="glass">
          <CardHeader className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">Live Supabase Console</h1>
            <p className="text-xs text-slate-400">Prisma transactional database handshake mapping</p>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSystemAccess} className="space-y-4">
              <Input
                label="Infrastructure Identity Email"
                type="email"
                placeholder="name@anocloud.internal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Security Access Phrase"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400">
                  ⚠️ {error}
                </div>
              )}
              <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
                Verify DB Profile
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}