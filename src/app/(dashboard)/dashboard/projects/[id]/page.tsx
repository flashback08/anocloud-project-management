import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { createTaskAction } from '@/app/actions/authActions';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectWorkspacePage({ params }: PageProps) {
  const { id } = await params;

  if (!id) return notFound();

  // Pull project metadata along with tasks and system operators to populate assignments
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      tasks: { 
        orderBy: { createdAt: 'desc' },
        include: { assignee: true }
      },
      createdBy: true
    }
  });

  if (!project) return notFound();

  // Fetch all users to populate the target assignment selector dropdown
  const systemUsers = await prisma.user.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <main className="min-h-screen p-8 bg-slate-950 text-slate-200">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Breadcrumb Map */}
        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <Link href="/dashboard" className="hover:text-slate-300 transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-slate-300">Workspaces</span>
          <span>/</span>
          <span className="text-indigo-400 font-mono text-[11px] truncate max-w-[120px]">{project.id}</span>
        </div>

        {/* METRICS HEADER */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono px-2 py-0.5 bg-slate-800 text-slate-400 rounded border border-slate-700">PROJECT_SCHEMA_NODE</span>
                <span className="text-xs uppercase font-bold px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md">{project.status}</span>
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">{project.name}</h1>
              <p className="text-slate-400 text-sm">{project.description || 'No description logged.'}</p>
            </div>
          </div>
        </div>

        {/* TASK MANAGEMENT SECTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* COMPLETE SCHEMA CONTROL FORM */}
          <div className="lg:col-span-1">
            <Card variant="glass" className="border-slate-800 bg-slate-900/40">
              <CardHeader>
                <h3 className="text-lg font-bold text-white">Create Workspace Task</h3>
                <p className="text-xs text-slate-400">Fulfills the Task schema rows explicitly</p>
              </CardHeader>
              <CardBody>
                <form action={createTaskAction} className="space-y-4">
                  <input type="hidden" name="projectId" value={project.id} />

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Task Title *</label>
                    <input name="title" type="text" required placeholder="Build schema layers" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"/>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Task Description</label>
                    <textarea name="description" placeholder="Technical implementation..." rows={2} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none resize-none"/>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Assign Operator (assignee)</label>
                    <select name="assignedTo" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none">
                      <option value="UNASSIGNED">Leave Unassigned</option>
                      {systemUsers.map(user => (
                        <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Priority</label>
                      <select name="priority" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none">
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HIGH">HIGH</option>
                        <option value="URGENT">URGENT</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Status</label>
                      <select name="status" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none">
                        <option value="TO_DO">TO_DO</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="DONE">DONE</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Due Date (due_date)</label>
                    <input name="dueDate" type="date" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"/>
                  </div>

                  <Button type="submit" variant="primary" className="w-full bg-indigo-600 hover:bg-indigo-500 mt-2">
                    Commit Task Schema Row
                  </Button>
                </form>
              </CardBody>
            </Card>
          </div>

          {/* TASKS VIEW REPOSITORY */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Task Ledger Execution Node</span>
              <span className="text-xs px-2 py-0.5 bg-slate-900 text-indigo-400 border border-slate-800 rounded-full font-mono">{project.tasks.length}</span>
            </h3>

            {project.tasks.length === 0 ? (
              <div className="text-center p-12 border border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
                <p className="text-sm text-slate-400">No operation tasks allocated to this transaction space block yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {project.tasks.map((task) => (
                  <div key={task.id} className="p-5 bg-slate-900/60 border border-slate-900 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-800 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-white">{task.title}</h4>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold border ${
                          task.priority === 'URGENT' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                          task.priority === 'HIGH' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                          'bg-slate-800 border-slate-700 text-slate-400'
                        }`}>{task.priority}</span>
                      </div>
                      <p className="text-xs text-slate-400 max-w-xl">{task.description || 'No description logged.'}</p>
                      {task.assignee && (
                        <p className="text-[11px] text-indigo-300 font-mono">Assigned to: {task.assignee.name}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {task.dueDate && (
                        <span className="text-[11px] text-slate-500">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      )}
                      <span className={`text-[10px] font-mono tracking-wider px-2 py-1 rounded border font-bold ${
                        task.status === 'DONE' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' :
                        task.status === 'IN_PROGRESS' ? 'bg-amber-500/5 border-amber-500/20 text-amber-400' :
                        'bg-slate-800 border-slate-700 text-slate-400'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </main>
  );
}