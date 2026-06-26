import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import TaskItemComponent from '../projects/[id]/TaskItemComponent';

export const dynamic = 'force-dynamic';

export default async function TasksPage() {
  const cookieStore = await cookies();
  const sessionEmail = cookieStore.get('active_session_email')?.value;

  if (!sessionEmail) redirect('/');
  const activeUser = await prisma.user.findUnique({ where: { email: sessionEmail } });
  if (!activeUser) redirect('/');

  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      comments: {
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  const systemUsers = await prisma.user.findMany({ orderBy: { createdAt: 'asc' } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Task Ledger</h1>
        <p className="text-xs text-slate-400 font-mono">Global task items and runtime schemas</p>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskItemComponent 
            key={task.id} 
            task={task} 
            projectId={task.projectId} 
            systemUsers={systemUsers} 
            currentAdminId={activeUser.id} 
          />
        ))}
        {tasks.length === 0 && (
          <p className="text-xs font-mono text-slate-500 italic py-6 text-center">No tasks intercepted inside tablespace streams.</p>
        )}
      </div>
    </div>
  );
}