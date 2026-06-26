'use client';

import React from 'react';
import { deleteTaskAction, createCommentAction, deleteCommentAction } from '@/app/actions/authActions';

interface TaskItemProps {
  task: any;
  projectId: string;
  systemUsers: any[];
  currentAdminId: string;
}

export default function TaskItemComponent({ task, projectId, systemUsers, currentAdminId }: TaskItemProps) {
  const latestFiveComments = (task.comments || []).slice(0, 5);

  return (
    <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-6 hover:border-slate-800 transition-all space-y-6">
      
      {/* CARD TOP BAR DATA HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-950 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-base font-bold text-white tracking-tight">{task.title}</h4>
            <span className="text-[9px] px-1.5 py-0.5 bg-slate-800 text-slate-400 font-mono rounded border border-slate-700">{task.priority}</span>
            <span className="text-[9px] px-1.5 py-0.5 bg-indigo-950 text-indigo-400 font-mono rounded border border-indigo-900">{task.status}</span>
          </div>
          <p className="text-xs text-slate-400">{task.description || 'No optional metadata provided.'}</p>
        </div>

        {/* DROP TASK ACTION ROW ROW CONTROLLER */}
        <form action={deleteTaskAction} className="shrink-0">
          <input type="hidden" name="taskId" value={task.id} />
          <input type="hidden" name="projectId" value={projectId} />
          <input type="hidden" name="operatorId" value={currentAdminId} />
          <button type="submit" className="px-3 py-1.5 bg-rose-950/30 hover:bg-rose-900/40 text-rose-400 border border-rose-900/40 text-xs font-mono rounded-xl transition-all">
            Drop Task Row Entity [🗑️]
          </button>
        </form>
      </div>

      {/* SCHEMA AND DISCUSSION LAYERS VISIBLE SIDE-BY-SIDE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* VIEW SCHEMATIC ATTR COMPONENT WINDOW */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-500 block">
            Public.tasks Internal Database Table Tuple Row Schema Definition
          </span>
          <div className="bg-slate-950 text-[11px] font-mono p-4 rounded-xl border border-slate-900 text-slate-400 leading-relaxed whitespace-pre select-all block overflow-x-auto">
{`Tuple Schema Snapshot:
- id           : "${task.id}"
- project_id   : "${projectId}"
- title        : "${task.title}"
- description  : "${task.description || 'NULL'}"
- assigned_to  : "${task.assignedTo || 'NULL'}"
- priority     : "${task.priority}"
- status       : "${task.status}"
- created_at   : "${new Date(task.createdAt).toISOString()}"`}
          </div>
        </div>

        {/* SCROLLABLE RECENT LOGGED COMMENTS FEED PANEL */}
        <div className="space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-500 block">
              Discussion Feed Execution Vector (Latest 5 Stack entries shown)
            </span>
            <div className="bg-slate-950 border border-slate-900 rounded-xl p-3 max-h-[125px] overflow-y-auto space-y-2 divide-y divide-slate-900/60">
              {latestFiveComments.length === 0 ? (
                <p className="text-[11px] font-mono text-slate-600 italic text-center pt-8">No comment items mapped.</p>
              ) : (
                latestFiveComments.map((com: any) => (
                  <div key={com.id} className="text-[11px] font-mono pt-2 first:pt-0 flex justify-between items-start gap-4">
                    <div>
                      <span className="text-white font-bold">{com.user?.name} ({com.user?.role}):</span>
                      <p className="text-slate-300 font-sans mt-0.5 text-xs">{com.comment}</p>
                    </div>
                    <form action={deleteCommentAction}>
                      <input type="hidden" name="commentId" value={com.id} />
                      <input type="hidden" name="projectId" value={projectId} />
                      <input type="hidden" name="operatorId" value={currentAdminId} />
                      <button type="submit" className="text-rose-400/70 hover:text-rose-400 underline text-[10px]">✕</button>
                    </form>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* APPEND FEED COMMENT ROW FORM */}
          <form action={createCommentAction} className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-900">
            <input type="hidden" name="taskId" value={task.id} />
            <input type="hidden" name="projectId" value={projectId} />
            <input type="hidden" name="userId" value={currentAdminId} />
            <input 
              name="comment" 
              type="text" 
              required 
              placeholder="Append log item comment..." 
              className="col-span-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-slate-700"
            />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs py-1.5 rounded-xl transition-all">
              Add Row
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}