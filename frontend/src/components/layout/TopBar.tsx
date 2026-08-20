import React from 'react';
import { useUIStore } from '../../store/useUIStore.js';
import { useAuthStore } from '../../store/useAuthStore.js';
import { Search, Bell, Sparkles, Command, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils.js';

export const TopBar: React.FC = () => {
  const {
    isSidebarCollapsed,
    setCommandPaletteOpen,
    isAIAssistantOpen,
    setAIAssistantOpen,
    isNotificationsOpen,
    setNotificationsOpen,
  } = useUIStore();

  const { user } = useAuthStore();

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 h-16 bg-bg-primary/80 backdrop-blur-glass border-b border-border-glass transition-all duration-300 flex items-center justify-between px-6',
        isSidebarCollapsed ? 'left-20' : 'left-64'
      )}
    >
      {/* Global Search Trigger (Ctrl+K / Cmd+K) */}
      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-white/[0.03] border border-border-glass text-text-muted hover:text-text-primary hover:border-border-glass-hover transition-all w-64 md:w-80 text-xs cursor-pointer group"
      >
        <Search className="w-3.5 h-3.5 text-text-muted group-hover:text-primary transition-colors" />
        <span className="flex-1 text-left truncate">Search projects, bugs, tests...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-text-muted">
          <Command className="w-2.5 h-2.5" /> K
        </kbd>
      </button>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Demo AI Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Demo AI Active</span>
        </div>

        {/* AI Assistant Quick Launcher */}
        <button
          onClick={() => setAIAssistantOpen(!isAIAssistantOpen)}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer border',
            isAIAssistantOpen
              ? 'bg-primary text-white border-primary shadow-glow'
              : 'bg-primary/10 text-primary-light border-primary/30 hover:bg-primary/20 shadow-glow'
          )}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden md:inline">✦ TestAI</span>
        </button>

        {/* Notifications Trigger */}
        <button
          onClick={() => setNotificationsOpen(!isNotificationsOpen)}
          className={cn(
            'relative p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 border border-transparent transition-all',
            isNotificationsOpen && 'bg-white/5 border-border-glass text-text-primary'
          )}
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-bg-primary" />
        </button>
      </div>
    </header>
  );
};
