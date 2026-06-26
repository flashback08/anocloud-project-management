import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import CommentSection from '@/components/CommentSection';

export const dynamic = 'force-dynamic';

interface ProjectWorkspaceProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectWorkspacePage({ params }: ProjectWorkspaceProps) {
  const { id: projectId } = await params;

  const cookieStore = await cookies();
  const sessionEmail = cookieStore.get('active_session_email')?.value;

  if (!sessionEmail) redirect('/');
  const activeUser = await prisma.user.findUnique({ where: { email: sessionEmail } });
  if (!activeUser) redirect('/');

  // Query project and deep fetch task structures with their respective comments
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      tasks: {
        orderBy: { createdAt: 'desc' },
        include: {
          comments: {
            include: {
              user: {
                select: { name: true, role: true }
              }
            },
            orderBy: { createdAt: 'desc' }
          }
        }
      }
    }
  });

  if (!project) {
    return (
      <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl font-mono text-center">
        <p className="text-sm text-rose-400">Project Matrix Node [{projectId}] does not exist.</p>
        <Link href="/dashboard/projects" className="text-xs text-indigo-400 underline mt-2 block">
          Return to Projects Ledger
        </Link>
      </div>
    );
  }

  // Aggregate comments across all tasks to populate a comprehensive project workspace stream
  const aggregatedProjectComments = project.tasks
    .flatMap((task) => task.comments)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Establish target routing handle for entries on this view
  const targetSubmissionTaskId = project.tasks[0]?.id || null;

  return (
    <div className="space-y-6">
      {/* HEADER META INFO BLOCK */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/30 border border-slate-800/80 p-6 rounded-2xl shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono bg-indigo-950 text-indigo-400 border border-indigo-900 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
              Project Domain
            </span>
            <span className="text-xs font-mono text-slate-500">ID: {project.id}</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">{project.name}</h1>
          <p className="text-xs text-slate-400 max-w-2xl">{project.description || 'No system parameter descriptions defined.'}</p>
        </div>

        <div className="text-right shrink-0">
          <span className="inline-block text-xs font-mono font-bold bg-slate-950 text-indigo-400 border border-slate-800 px-3 py-1 rounded-xl">
            STATE: {project.status}
          </span>
        </div>
      </div>

      {/* PROJECT TASKS LEDGER */}
      <div className="space-y-4">
        <div className="px-1">
          <h2 className="text-sm font-mono text-slate-400 uppercase tracking-wider">
            Project Tasks Ledger ({project.tasks.length})
          </h2>
        </div>

        <div className="space-y-3">
          {project.tasks.map((task) => (
            <div 
              key={task.id} 
              className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-800 transition-colors"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-slate-100">{task.title}</h3>
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                    task.priority === 'HIGH' 
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}>
                    {task.priority}
                  </span>
                  <span className="text-[9px] font-mono bg-indigo-950/40 text-indigo-400 border border-indigo-900 px-2 py-0.5 rounded">
                    {task.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-1">{task.description || 'No description provided.'}</p>
              </div>

              <div className="shrink-0 w-full sm:w-auto text-right">
                <Link href={`/dashboard/projects/${project.id}/tasks/${task.id}`}>
                  <button className="w-full sm:w-auto px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold rounded-lg transition-colors shadow-md">
                    Open Task Workspace →
                  </button>
                </Link>
              </div>
            </div>
          ))}

          {project.tasks.length === 0 && (
            <div className="bg-slate-900/10 border border-dashed border-slate-800 rounded-2xl p-8 text-center font-mono">
              <p className="text-xs text-slate-500 italic">No tasks assigned to this pipeline workspace context.</p>
            </div>
          )}
        </div>
      </div>

      {/* PROJECT SCOPE COMMENT STREAM MODULE */}
      <div className="pt-4">
        {targetSubmissionTaskId ? (
          <CommentSection 
            taskId={targetSubmissionTaskId} 
            initialComments={aggregatedProjectComments} 
            currentAdminId={activeUser.id} 
          />
        ) : (
          <div className="bg-slate-900/20 border border-slate-900 p-6 rounded-2xl text-center font-mono text-xs text-slate-500 italic">
            Discussion thread locked. Deployed task parameters are required in this project prior to log initiation.
          </div>
        )}
      </div>
    </div>
  );
}