import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useUIStore } from '../../store/useUIStore.js';
import { useAuthStore } from '../../store/useAuthStore.js';
import {
  LayoutDashboard,
  FolderGit2,
  FlaskConical,
  Code2,
  Bug,
  ShieldCheck,
  FileText,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LogOut,
  User,
} from 'lucide-react';
import { cn } from '../../lib/utils.js';

export const Sidebar: React.FC = () => {
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const navItems = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/projects', label: 'Projects', icon: FolderGit2 },
    { to: '/test-lab', label: 'Test Lab', icon: FlaskConical },
    { to: '/analysis', label: 'Code & AI', icon: Code2 },
    { to: '/bugs', label: 'Bugs', icon: Bug, badge: '43' },
    { to: '/coverage', label: 'Coverage', icon: ShieldCheck, badge: '87%' },
    { to: '/reports', label: 'Reports', icon: FileText },
    { to: '/activity', label: 'Activity', icon: Activity },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside
      className={cn(
        'fixed top-0 bottom-0 left-0 z-40 bg-bg-secondary/90 backdrop-blur-glass border-r border-border-glass transition-all duration-300 flex flex-col justify-between select-none',
        isSidebarCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-5 border-b border-border-glass">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent-cyan p-0.5 flex-shrink-0 flex items-center justify-center shadow-glow">
              <div className="w-full h-full bg-bg-primary rounded-[6px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-light" />
              </div>
            </div>
            {!isSidebarCollapsed && (
              <span className="font-bold tracking-tight text-white font-mono text-sm whitespace-nowrap">
                ◈ BugLens <span className="text-primary-light text-xs font-semibold px-1 py-0.2 rounded bg-primary/20">AI</span>
              </span>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className="text-text-muted hover:text-text-primary p-1.5 rounded-lg hover:bg-white/5 transition-colors hidden md:block"
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative',
                    isActive
                      ? 'bg-primary/20 text-primary-light border border-primary/30 shadow-glow'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={cn('w-5 h-5 flex-shrink-0 transition-colors', isActive ? 'text-primary-light' : 'text-text-muted group-hover:text-text-primary')} />
                    {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                    {!isSidebarCollapsed && item.badge && (
                      <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-text-secondary border border-white/10">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-3 border-t border-border-glass space-y-1">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
              isActive
                ? 'bg-primary/20 text-primary-light border border-primary/30'
                : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
            )
          }
        >
          <Settings className="w-5 h-5 flex-shrink-0 text-text-muted" />
          {!isSidebarCollapsed && <span>Settings</span>}
        </NavLink>

        {/* User Card */}
        <div className="mt-2 pt-2 border-t border-border-light flex items-center justify-between px-2 py-1.5 rounded-xl bg-white/[0.02]">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent-violet flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {user?.name?.[0] || 'U'}
            </div>
            {!isSidebarCollapsed && (
              <div className="overflow-hidden">
                <p className="text-xs font-medium text-text-primary truncate">{user?.name || 'Developer'}</p>
                <p className="text-[10px] text-text-muted truncate">{user?.role || 'developer'}</p>
              </div>
            )}
          </div>
          {!isSidebarCollapsed && (
            <button
              onClick={handleLogout}
              className="text-text-muted hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/10 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
