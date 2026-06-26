import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProjectsClient from './ProjectsClient';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const cookieStore = await cookies();
  const sessionEmail = cookieStore.get('active_session_email')?.value;

  if (!sessionEmail) redirect('/');
  const activeUser = await prisma.user.findUnique({ where: { email: sessionEmail } });
  if (!activeUser) redirect('/');

  // Query projects alongside task summation metrics
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { tasks: true } } }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Projects Workspace</h1>
          <p className="text-xs text-slate-400 font-mono">Index registry of active database rows</p>
        </div>
      </div>

      {/* Hand off data array to client side interface grid safely */}
      <ProjectsClient projects={projects as any} currentAdminId={activeUser.id} />
    </div>
  );
}
