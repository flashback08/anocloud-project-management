'use client';

import React from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">System Diagnostics Overview</h1>
        <p className="text-sm text-slate-400">Real-time status analysis of current active infrastructure matrices.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="glass">
          <CardHeader><h3 className="text-sm font-semibold text-slate-400 font-mono">Active Clusters</h3></CardHeader>
          <CardBody><p className="text-3xl font-black text-indigo-400">03 / 03</p></CardBody>
        </Card>
        <Card variant="glass">
          <CardHeader><h3 className="text-sm font-semibold text-slate-400 font-mono">Thread Execution Latency</h3></CardHeader>
          <CardBody><p className="text-3xl font-black text-emerald-400">1.24 ms</p></CardBody>
        </Card>
        <Card variant="glass">
          <CardHeader><h3 className="text-sm font-semibold text-slate-400 font-mono">Identity Approvals</h3></CardHeader>
          <CardBody><p className="text-3xl font-black text-cyan-400">Secure</p></CardBody>
        </Card>
      </div>
    </div>
  );
}