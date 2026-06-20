import React, { InputHTMLAttributes, useId } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, type = 'text', ...props }, ref) => {
    const generatedId = useId();
    
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label 
            htmlFor={generatedId} 
            className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase pl-0.5"
          >
            {label}
          </label>
        )}
        <input
          id={generatedId}
          type={type}
          ref={ref}
          className={`w-full bg-slate-950/50 border ${error ? 'border-rose-500/50 focus:border-rose-500' : 'border-slate-800 focus:border-indigo-500'} rounded-xl px-4 py-3 text-sm focus:outline-none text-white placeholder-slate-600 transition-colors shadow-inner`}
          {...props}
        />
        {error && (
          <span className="text-xs text-rose-400 font-medium pl-0.5 mt-0.5 flex items-center gap-1">
            ⚠️ {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';