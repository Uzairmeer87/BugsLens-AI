import React from 'react';
import { cn } from '../../lib/utils.js';

export const GlassPanel: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn('glass-panel p-6 shadow-2xl relative', className)}>
    {children}
  </div>
);
