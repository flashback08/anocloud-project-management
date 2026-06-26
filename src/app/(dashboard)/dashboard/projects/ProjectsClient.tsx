'use client';

import React from 'react';
import Link from 'next/link';
import { deleteProjectAction } from '@/app/actions/projectActions';

interface ProjectWithCount {
  id: string;
  name: string;
  description: string | null;
  status: string;
  _count: {
    tasks: number;
  };
}

interface ProjectsClientProps {
  projects: ProjectWithCount[];
  currentAdminId: string;
}

export default function ProjectsClient({ projects, currentAdminId }: ProjectsClientProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <div key={project.id} className="bg-slate-900/50 border border-slate-800/60 p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors shadow-md">
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-white text-sm truncate">{project.name}</h3>
              <span className="text-[9px] font-mono bg-indigo-950 text-indigo-400 px-2 py-0.5 rounded border border-indigo-900 shrink-0">
                {project.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 line-clamp-2">{project.description || 'No database description parameters initialized.'}</p>
          </div>
          
          <div className="pt-3 border-t border-slate-800/40 flex flex-col space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Tasks: {project._count.tasks}</span>
              <span>ID: {project.id.substring(0, 8)}...</span>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              {/* INLINE ROW PURGING MECHANISM WITH SAFE CLIENT DETACHED FORM INTERACTION */}
              <form 
                action={deleteProjectAction} 
                onSubmit={(e) => {
                  if (!confirm(`Are you sure you want to completely purge "${project.name}"?\nThis action will delete all nested task records.`)) {
                    e.preventDefault();
                  }
                }}
                className="shrink-0"
              >
                <input type="hidden" name="projectId" value={project.id} />
                <input type="hidden" name="operatorId" value={currentAdminId} />
                <button 
                  type="submit" 
                  className="px-3 py-1.5 bg-rose-950/30 hover:bg-rose-900/50 text-rose-400 border border-rose-900/20 font-mono text-xs rounded-lg transition-colors"
                >
                  Purge Row [🗑️]
                </button>
              </form>

              <Link href={`/dashboard/projects/${project.id}`}>
                <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs rounded-lg transition-colors shadow-md">
                  Open Workspace →
                </button>
              </Link>
            </div>
          </div>
        </div>
      ))}
      {projects.length === 0 && (
        <p className="text-xs font-mono text-slate-500 italic py-6 col-span-full">No project environments deployed.</p>
      )}
    </div>
  );
}
