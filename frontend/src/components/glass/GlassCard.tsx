import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils.js';

export interface GlassCardProps extends HTMLMotionProps<'div'> {
  hoverEffect?: boolean;
  glowColor?: 'primary' | 'cyan' | 'rose' | 'amber' | 'emerald';
  children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  hoverEffect = true,
  glowColor,
  ...props
}) => {
  const glowClasses = {
    primary: 'hover:shadow-glow hover:border-primary/40',
    cyan: 'hover:shadow-glow-cyan hover:border-cyan-500/40',
    rose: 'hover:shadow-glow-rose hover:border-rose-500/40',
    amber: 'hover:shadow-amber-500/20 hover:border-amber-500/40',
    emerald: 'hover:shadow-emerald-500/20 hover:border-emerald-500/40',
  };

  return (
    <motion.div
      whileHover={hoverEffect ? { y: -3, transition: { duration: 0.2 } } : undefined}
      className={cn(
        'glass-card p-6 relative overflow-hidden',
        glowColor && glowClasses[glowColor],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
