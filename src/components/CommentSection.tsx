'use client';

import React, { useState } from 'react';

interface Comment {
  id: string;
  comment: string; // Aligned directly with comment table schema
  createdAt: string | Date;
  user: {
    name: string;
    role: string;
  };
}

interface CommentSectionProps {
  taskId: string; // Strictly required now due to 'task_id text not null' layout constraint
  initialComments: Comment[];
  currentAdminId: string;
}

export default function CommentSection({ taskId, initialComments, currentAdminId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text,
          taskId,
          userId: currentAdminId
        }),
      });

      if (res.ok) {
        const newComment = await res.json();
        setComments([newComment, ...comments]);
        setText('');
      } else {
        const operationalError = await res.json();
        console.error('Schema insertion rejected:', operationalError.error);
      }
    } catch (err) {
      console.error('Network execution breakdown:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-950/40 border border-slate-900 rounded-2xl p-6 space-y-4">
      <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
        Discussion Matrix Thread ({comments.length})
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Append log entry message to this workspace stream matching database parameters..."
          rows={3}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none resize-none focus:border-slate-700 transition-colors"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-mono text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Committing...' : 'Commit Message 💬'}
          </button>
        </div>
      </form>

      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
        {comments.map((c) => (
          <div key={c.id} className="bg-slate-950 border border-slate-900/60 p-3 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-slate-300 font-bold">
                {c.user?.name || 'System Operator'} ({c.user?.role || 'MEMBER'})
              </span>
              <span className="text-slate-500">
                {new Date(c.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
              </span>
            </div>
            <p className="text-xs text-slate-400">{c.comment}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-xs font-mono text-slate-600 italic text-center py-2">Thread empty. No entries compiled.</p>
        )}
      </div>
    </div>
  );
}