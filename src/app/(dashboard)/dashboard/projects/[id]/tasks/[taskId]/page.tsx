import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import CommentSection from '@/components/CommentSection';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    id: string;
    taskId: string;
  }>;
}

export default async function TaskWorkspacePage({ params }: PageProps) {
  const { id: projectId, taskId } = await params;

  const cookieStore = await cookies();
  const sessionEmail = cookieStore.get('active_session_email')?.value;

  if (!sessionEmail) redirect('/');
  const activeUser = await prisma.user.findUnique({ where: { email: sessionEmail } });
  if (!activeUser) redirect('/');

  // Query single database task node matching exact parameter mapping properties
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      project: true,
      comments: {
        include: {
          user: {
            select: { name: true, role: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!task) {
    return (
      <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl font-mono">
        <p className="text-sm text-rose-400">Error: Task entry node [{taskId}] not found.</p>
        <Link href={`/dashboard/projects/${projectId}`} className="text-xs text-indigo-400 underline mt-2 block">
          ← Return to Project Workspace
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* BREADCRUMB NAVIGATION DATA STREAM LINK */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
        <Link href="/dashboard/projects" className="hover:text-slate-300">projects</Link>
        <span>/</span>
        <Link href={`/dashboard/projects/${projectId}`} className="hover:text-slate-300 truncate max-w-[150px]">
          {task.project.name}
        </Link>
        <span>/</span>
        <span className="text-slate-400 truncate max-w-[150px]">{task.title}</span>
      </div>

      {/* DETAILED TASK NODE ENVIRONMENT SURFACE BLOCK */}
      <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-4">
          <div>
            <span className="text-[10px] font-mono bg-indigo-950 text-indigo-400 border border-indigo-900 px-2 py-0.5 rounded font-bold tracking-wider uppercase">
              Task Execution Node
            </span>
            <h1 className="text-xl font-black text-white mt-1">{task.title}</h1>
          </div>
          <div className="flex gap-2 text-[10px] font-mono">
            <span className="bg-slate-950 text-slate-400 border border-slate-800 px-2 py-1 rounded">STATUS: {task.status}</span>
            <span className="bg-slate-950 text-amber-400 border border-amber-900/40 px-2 py-1 rounded">PRIORITY: {task.priority}</span>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-xs font-mono text-slate-500 uppercase">Description</h3>
          <p className="text-sm text-slate-300 bg-slate-950/40 border border-slate-900 p-4 rounded-xl leading-relaxed">
            {task.description || 'No database context strings initialized for this task row.'}
          </p>
        </div>
      </div>

      {/* COMMIT SECTIONS LINKING DIRECTLY VIA TASK FIELD IDENTITY */}
      <div className="pt-2">
        <CommentSection 
          taskId={task.id} 
          initialComments={task.comments as any} 
          currentAdminId={activeUser.id} 
        />
      </div>
    </div>
  );
}