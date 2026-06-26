import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const sessionEmail = cookieStore.get('active_session_email')?.value;

  if (!sessionEmail) redirect('/');
  const activeUser = await prisma.user.findUnique({ where: { email: sessionEmail } });
  if (!activeUser) redirect('/');

  // Query projects for snapshot view
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
    include: { tasks: true }
  });

  const systemUsers = await prisma.user.findMany({ orderBy: { createdAt: 'asc' } });

  // Query public.activity_logs sorted by newest records
  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 15,
    include: {
      user: {
        select: {
          name: true,
          role: true
        }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">System Dashboard</h1>
        <p className="text-xs text-slate-400 font-mono">
          Operator Node: {activeUser.name} ({activeUser.role})
        </p>
      </div>
      
      <DashboardClient 
        initialProjects={projects as any} 
        systemUsers={systemUsers as any} 
        currentAdminId={activeUser.id}
        activityLogs={logs as any}
      />
    </div>
  );
}
