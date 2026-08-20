import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../../store/useUIStore.js';
import { searchApi } from '../../services/api.js';
import { Search, FolderGit2, Bug, FlaskConical, Play, Settings, Sparkles, X } from 'lucide-react';
import { cn } from '../../lib/utils.js';

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, setCommandPaletteOpen, setAIAssistantOpen } = useUIStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    projects: Array<{ id: string; title: string; subtitle: string; type: string }>;
    bugs: Array<{ id: string; title: string; subtitle: string; type: string }>;
    testCases: Array<{ id: string; title: string; subtitle: string; type: string }>;
    testRuns: Array<{ id: string; title: string; subtitle: string; type: string }>;
  }>({ projects: [], bugs: [], testCases: [], testRuns: [] });

  const navigate = useNavigate();

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  // Search query debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults({ projects: [], bugs: [], testCases: [], testRuns: [] });
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const data = await searchApi.globalSearch(query);
        setResults(data);
      } catch {
        // ignore
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isCommandPaletteOpen) return null;

  const quickActions = [
    { label: 'Run Full Test Lab Simulation', icon: Play, action: () => navigate('/test-lab') },
    { label: 'Launch AI Assistant', icon: Sparkles, action: () => setAIAssistantOpen(true) },
    { label: 'View 43 Detected Bugs', icon: Bug, action: () => navigate('/bugs') },
    { label: 'Open Platform Settings', icon: Settings, action: () => navigate('/settings') },
  ];

  const handleSelect = (action: () => void) => {
    action();
    setCommandPaletteOpen(false);
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
      <div
        onClick={() => setCommandPaletteOpen(false)}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-xl glass-panel p-4 z-10 border border-white/10 shadow-2xl overflow-hidden rounded-2xl">
        {/* Input Bar */}
        <div className="flex items-center gap-3 px-3 py-2 border-b border-border-glass">
          <Search className="w-5 h-5 text-primary" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command or search (projects, bugs, tests)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-text-primary text-sm focus:outline-none placeholder:text-text-muted"
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="text-text-muted hover:text-text-primary p-1 rounded-lg hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-3 mt-2">
          {!query && (
            <div>
              <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider px-3 mb-1">
                Quick Commands
              </p>
              <div className="space-y-1">
                {quickActions.map((qa, i) => {
                  const Icon = qa.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(qa.action)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <Icon className="w-4 h-4 text-primary" />
                      <span>{qa.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {results.projects.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider px-3 mb-1">
                Projects
              </p>
              {results.projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelect(() => navigate('/projects'))}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                >
                  <FolderGit2 className="w-4 h-4 text-cyan-400" />
                  <div>
                    <p className="font-medium text-text-primary">{p.title}</p>
                    <p className="text-xs text-text-muted">{p.subtitle}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {results.bugs.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider px-3 mb-1">
                Bugs
              </p>
              {results.bugs.map((b) => (
                <button
                  key={b.id}
                  onClick={() => handleSelect(() => navigate('/bugs'))}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                >
                  <Bug className="w-4 h-4 text-rose-400" />
                  <div>
                    <p className="font-medium text-text-primary">{b.title}</p>
                    <p className="text-xs text-text-muted">{b.subtitle}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
