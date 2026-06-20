import React from 'react';
import { ProjectStatus, TaskStatus, TaskPriority } from '../../types';

export interface BadgeProps {
  className?: string;
  value: ProjectStatus | TaskStatus | TaskPriority | string;
}

export const Badge: React.FC<BadgeProps> = ({ className = '', value }) => {
  const normalized = value.toUpperCase().replace(/\s+/g, '_');

  const themeMap: Record<string, string> = {
    // Project & Task Status Values
    NOT_STARTED: 'bg-slate-500/10 border-slate-500/30 text-slate-400',
    TO_DO: 'bg-slate-500/10 border-slate-500/30 text-slate-400',
    IN_PROGRESS: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
    REVIEW: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
    COMPLETED: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    DONE: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    ON_HOLD: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    
    // Priority Values
    LOW: 'bg-slate-500/10 border-slate-500/20 text-slate-400',
    MEDIUM: 'bg-sky-500/10 border-sky-500/30 text-sky-400',
    HIGH: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
  };

  const selectedTheme = themeMap[normalized] || 'bg-slate-500/10 border-slate-500/30 text-slate-300';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border backdrop-blur-md tracking-wide ${selectedTheme} ${className}`}>
      {value.replace('_', ' ')}
    </span>
  );
};