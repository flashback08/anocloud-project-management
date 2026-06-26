'use client';

import React, { useState } from 'react';
import { createProjectAction, createUserAction } from '@/app/actions/authActions';
import { deleteProjectAction } from '@/app/actions/projectActions';

interface Task {
  id: string;
  projectId: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string | Date;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  createdAt: string | Date;
  tasks: Task[];
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string | Date;
}

interface ActivityLog {
  id: string;
  action: string;
  entityType: string;
  createdAt: string | Date;
  user: {
    name: string;
    role: string;
  };
}

interface DashboardClientProps {
  initialProjects: Project[];
  systemUsers: User[];
  currentAdminId: string;
  activityLogs: ActivityLog[];
}

export default function DashboardClient({ initialProjects, systemUsers, currentAdminId, activityLogs }: DashboardClientProps) {
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  const metrics = {
    totalProjects: initialProjects.length,
    totalTasks: initialProjects.reduce((acc, curr) => acc + (curr.tasks?.length || 0), 0),
    totalUsers: systemUsers.length,
  };

  const formatStableDate = (dateVal: string | Date) => {
    return new Date(dateVal).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatStableTime = (dateVal: string | Date) => {
    return new Date(dateVal).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).toUpperCase();
  };

  return (
    <div className="space-y-8">
      
      {/* ANALYTICS TELEMETRY PANEL */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl shadow-md">
          <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Active Projects</p>
          <p className="text-3xl font-black text-white mt-1">{metrics.totalProjects}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl shadow-md">
          <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Intercepted Tasks</p>
          <p className="text-3xl font-black text-white mt-1">{metrics.totalTasks}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl shadow-md">
          <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Registered Nodes</p>
          <p className="text-3xl font-black text-white mt-1">{metrics.totalUsers}</p>
        </div>
      </div>

      {/* MANAGEMENT CONTROLS PLATFORM */}
      <div className="flex flex-wrap items-center gap-4">
        <button 
          onClick={() => setShowProjectModal(true)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold rounded-xl transition-all shadow-lg"
        >
          Deploy New Project Matrix [+]
        </button>
        <button 
          onClick={() => setShowUserModal(true)}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-mono font-bold rounded-xl transition-all shadow-md"
        >
          Provision User Node [+]
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SUB-LEDGER VISUALIZATION: PROJECT STREAM SNAPSHOT */}
        <div className="lg:col-span-2 bg-slate-900/30 border border-slate-900 rounded-2xl p-6 space-y-4 h-fit">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-mono text-slate-400 uppercase tracking-wider">Recent Project Deployments</h3>
            <span className="text-[10px] font-mono text-slate-500">Real-time DB Pull</span>
          </div>

          <div className="divide-y divide-slate-950">
            {initialProjects.slice(0, 5).map((project) => (
              <div key={project.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-slate-200 truncate">{project.name}</span>
                    <span className="text-[9px] font-mono bg-indigo-950/60 text-indigo-400 border border-indigo-900 px-1.5 py-0.5 rounded">
                      {project.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{project.description || 'No description assigned.'}</p>
                  <span className="text-[10px] font-mono text-slate-500 block mt-1">
                    Created: {formatStableDate(project.createdAt)}
                  </span>
                </div>
                
                {/* DELETION CONTROLS BLOCK */}
                <div className="shrink-0">
                  <form action={deleteProjectAction}>
                    <input type="hidden" name="projectId" value={project.id} />
                    <input type="hidden" name="operatorId" value={currentAdminId} />
                    <button 
                      type="submit"
                      className="px-2.5 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-950 text-[11px] font-mono rounded-lg transition-colors"
                      onClick={(e) => { if (!confirm('Confirm project matrix deletion? This will clear all linked sub-schema rows.')) e.preventDefault(); }}
                    >
                      Purge [🗑️]
                    </button>
                  </form>
                </div>
              </div>
            ))}
            {initialProjects.length === 0 && (
              <p className="text-xs font-mono text-slate-600 italic py-6 text-center">No projects detected in workspace.</p>
            )}
          </div>
        </div>

        {/* ACTIVE TELEMETRY ACTION LOGS ENGINE */}
        <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-6 space-y-4">
          <div>
            <h3 className="text-sm font-mono text-slate-400 uppercase tracking-wider">Activity Logs</h3>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">Track all major system actions.</p>
          </div>

          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {activityLogs.map((log) => (
              <div key={log.id} className="bg-slate-950/60 border border-slate-900/50 p-3 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span className="text-indigo-400 font-bold">{formatStableTime(log.createdAt)}</span>
                  <span>{log.user?.name || 'Operator'}</span>
                </div>
                <p className="text-xs text-slate-300 font-sans leading-tight">
                  {log.action}
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-slate-900/30 text-[9px] font-mono text-slate-600">
                  <span>SCOPE: {log.entityType}</span>
                  <span>{formatStableDate(log.createdAt)}</span>
                </div>
              </div>
            ))}
            {activityLogs.length === 0 && (
              <p className="text-xs font-mono text-slate-600 italic py-6 text-center">No log traces compiled.</p>
            )}
          </div>
        </div>
      </div>

      {/* MODAL 1: PROJECT INSERTION FIELD ENGINE */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div>
              <h4 className="text-base font-bold text-white font-mono">Initialize Project Entry</h4>
              <p className="text-xs text-slate-400">Pushes a new relational row matrix into Supabase</p>
            </div>
            <form action={async (formData) => {
              await createProjectAction(formData);
              setShowProjectModal(false);
            }} className="space-y-3">
              <input type="hidden" name="createdBy" value={currentAdminId} />
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Project Name *</label>
                <input name="name" type="text" required placeholder="Alpha Engine Core" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none" />
              </div>
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Parameter Description</label>
                <textarea name="description" placeholder="Optional architectural framework definitions..." rows={3} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Start Delta</label>
                  <input name="startDate" type="date" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none" />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">End Evaluation Delta</label>
                  <input name="endDate" type="date" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Operational State Status</label>
                <select name="status" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none">
                  <option value="NOT_STARTED">NOT_STARTED</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowProjectModal(false)} className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-slate-400 text-xs font-mono rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold rounded-xl transition-colors">Commit Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: USER PROVISIONING COMPONENT WINDOW */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div>
              <h4 className="text-base font-bold text-white font-mono">Provision New Operator Node</h4>
              <p className="text-xs text-slate-400">Maps user payload configurations directly to public.users schema</p>
            </div>
            <form action={async (formData) => {
              await createUserAction(formData);
              setShowUserModal(false);
            }} className="space-y-3">
              <input type="hidden" name="operatorId" value={currentAdminId} />
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">User Matrix ID Key (id) *</label>
                <input name="id" type="text" required placeholder="usr_dev_77" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none" />
              </div>
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Account Display Name (name) *</label>
                <input name="name" type="text" required placeholder="Marcus Vance" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none" />
              </div>
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Email Coordinate Mapping *</label>
                <input name="email" type="email" required placeholder="marcus@anocloud.internal" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none" />
              </div>
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Security Role Profile Domain</label>
                <select name="role" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none">
                  <option value="MEMBER">MEMBER</option>
                  <option value="DEVELOPER">DEVELOPER</option>
                  <option value="PROJECT_MANAGER">PROJECT_MANAGER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowUserModal(false)} className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-slate-400 text-xs font-mono rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold rounded-xl transition-colors">Deploy Profile Node</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
