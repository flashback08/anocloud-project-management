import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass';
}

export const Card: React.FC<CardProps> = ({ className = '', variant = 'glass', ...props }) => {
  const baseStyle = 'border shadow-2xl rounded-3xl overflow-hidden transition-all';
  const variants = {
    default: 'bg-slate-900 border-slate-800',
    glass: 'backdrop-blur-xl bg-slate-900/40 border-slate-700/20'
  };

  return <div className={`${baseStyle} ${variants[variant]} ${className}`} {...props} />;
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', ...props }) => {
  return <div className={`px-6 pt-6 pb-4 border-b border-slate-800/40 ${className}`} {...props} />;
};

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', ...props }) => {
  return <div className={`p-6 text-slate-300 ${className}`} {...props} />;
};

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', ...props }) => {
  return <div className={`px-6 py-4 bg-slate-950/20 border-t border-slate-800/40 flex items-center ${className}`} {...props} />;
};