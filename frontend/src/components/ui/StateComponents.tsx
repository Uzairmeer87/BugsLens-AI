import React from 'react';
import { cn } from '../../lib/utils.js';

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('animate-pulse rounded-md bg-white/5', className)} />
);

export const EmptyState: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02]">
    <div className="p-4 rounded-2xl bg-white/5 text-primary mb-4">{icon}</div>
    <h4 className="text-base font-semibold text-text-primary mb-1">{title}</h4>
    <p className="text-sm text-text-secondary max-w-sm mb-6">{description}</p>
    {action}
  </div>
);

export const ErrorState: React.FC<{
  title?: string;
  message?: string;
  onRetry?: () => void;
}> = ({ title = 'Failed to load content', message = 'Something unexpected occurred while connecting to the engine.', onRetry }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-rose-500/20 bg-rose-500/5">
    <h4 className="text-base font-semibold text-rose-300 mb-1">{title}</h4>
    <p className="text-sm text-text-secondary max-w-md mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="text-xs font-medium px-4 py-2 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors cursor-pointer"
      >
        Retry
      </button>
    )}
  </div>
);
