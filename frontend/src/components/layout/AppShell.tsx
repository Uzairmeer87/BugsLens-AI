import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.js';
import { TopBar } from './TopBar.js';
import { CommandPalette } from './CommandPalette.js';
import { NotificationCenter } from './NotificationCenter.js';
import { AIAssistantDrawer } from './AIAssistantDrawer.js';
import { useUIStore } from '../../store/useUIStore.js';
import { cn } from '../../lib/utils.js';

export const AppShell: React.FC = () => {
  const { isSidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main View Area */}
      <div
        className={cn(
          'flex-1 flex flex-col min-w-0 transition-all duration-300',
          isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
        )}
      >
        {/* TopBar */}
        <TopBar />

        {/* Dynamic Page Content */}
        <main className="flex-1 mt-16 p-6 md:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
          <Outlet />
        </main>
      </div>

      {/* Global Overlays & Drawers */}
      <CommandPalette />
      <NotificationCenter />
      <AIAssistantDrawer />
    </div>
  );
};
