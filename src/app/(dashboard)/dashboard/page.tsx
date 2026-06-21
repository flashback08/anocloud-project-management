import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { createProjectAction } from '@/app/actions/authActions';

export default async function DashboardPage() {
  // 1. Fetch your user context so we can attach their ID to the project relation
  const adminUser = await prisma.user.findUnique({
    where: { email: 'alex.rivera@anocloud.internal' }
  });

  // 2. Fetch live projects from Supabase
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
    include: { tasks: true }
  });

  return (
    <main className="min-h-screen p-8 bg-slate-950 text-slate-200">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl font-bold text-white">System Dashboard</h1>
          <p className="text-slate-400 mt-1">Operator Profile: {adminUser?.name || 'Loading...'}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* FORM SIDEBAR */}
          <div className="lg:col-span-1">
            <Card variant="glass" className="sticky top-8 border-slate-800 bg-slate-900/40">
              <CardHeader>
                <h2 className="text-lg font-bold text-white">New Project Specs</h2>
              </CardHeader>
              <CardBody>
                <form action={createProjectAction} className="space-y-4">
                  <input type="hidden" name="createdById" value={adminUser?.id || ''} />

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Project Name *</label>
                    <input name="name" type="text" required placeholder="Core Infrastructure" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-slate-700 focus:outline-none"/>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Description</label>
                    <textarea name="description" placeholder="Scope definitions..." rows={2} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-slate-700 focus:outline-none resize-none"/>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Start Date</label>
                      <input name="startDate" type="date" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-2 text-xs text-white focus:border-slate-700 focus:outline-none"/>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">End Date</label>
                      <input name="endDate" type="date" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-2 text-xs text-white focus:border-slate-700 focus:outline-none"/>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Lifecycle Status</label>
                    <select name="status" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-slate-700 focus:outline-none">
                      <option value="NOT_STARTED">Not Started</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="ON_HOLD">On Hold</option>
                    </select>
                  </div>

                  <Button type="submit" variant="primary" className="w-full bg-indigo-600 hover:bg-indigo-500">
                    Commit Schema Row
                  </Button>
                </form>
              </CardBody>
            </Card>
          </div>

          {/* REPOSITORY GRID */}
          <div className="lg:col-span-3">
            {projects.length === 0 ? (
              <div className="text-center p-12 border border-dashed border-slate-800 rounded-2xl bg-slate-900/50">
                <h3 className="text-lg font-medium text-slate-300">No active projects found.</h3>
                <p className="text-slate-500 mt-2">Use the deployment sidebar to generate your first live entry.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <Card key={project.id} variant="glass" className="hover:border-slate-700 transition-colors flex flex-col justify-between">
                    <div>
                      <CardHeader className="flex justify-between items-start">
                        <h2 className="text-xl font-semibold text-white truncate max-w-[180px]">{project.name}</h2>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md">
                          {project.status.replace('_', ' ')}
                        </span>
                      </CardHeader>
                      <CardBody className="space-y-4">
                        <p className="text-sm text-slate-400 line-clamp-2">{project.description || 'No description provided.'}</p>
                        
                        <div className="text-xs text-slate-500 flex justify-between bg-slate-900/50 p-2 rounded-lg border border-slate-900">
                          <span>Start: {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'TBD'}</span>
                          <span>Target: {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'TBD'}</span>
                        </div>
                      </CardBody>
                    </div>

                    {/* LAUNCH BUTTON CONTAINER */}
                    <div className="p-4 pt-0 mt-auto border-t border-slate-900/40">
                      <Link href={`/dashboard/projects/${project.id}`} className="block w-full">
                        <Button variant="primary" className="w-full bg-indigo-600 hover:bg-indigo-500 text-xs py-2 tracking-wide font-medium">
                          Launch Project Workspace →
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}