import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal.js';
import { Button } from '../../components/ui/Button.js';
import { projectsApi } from '../../services/api.js';
import { Upload, Sliders, FolderGit2, Check, AlertCircle } from 'lucide-react';
import { GithubIcon } from '../../components/ui/Icons.js';
import { cn } from '../../lib/utils.js';

export const CreateProjectModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ isOpen, onClose, onSuccess }) => {
  const [tab, setTab] = useState<'github' | 'upload' | 'manual'>('github');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [branch, setBranch] = useState('main');
  const [framework, setFramework] = useState('Express + Node.js');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a project name.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await projectsApi.create({
        name,
        description,
        repositoryUrl: repoUrl || 'https://github.com/buglens-ai/ecommerce-api',
        repositoryName: name.toLowerCase().replace(/\s+/g, '-'),
        defaultBranch: branch,
        framework,
        languages: ['TypeScript', 'JavaScript'],
        status: 'active',
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to initialize project.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPreset = (presetName: string, presetFramework: string) => {
    setName(presetName);
    setDescription(`Production ${presetFramework} microservices backend with automated CI/CD.`);
    setRepoUrl(`https://github.com/enterprise/${presetName.toLowerCase().replace(/\s+/g, '-')}`);
    setFramework(presetFramework);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Project"
      description="Connect a repository or upload source code for automated AI testing."
      maxWidth="xl"
    >
      {/* Source Method Tabs */}
      <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-white/[0.03] border border-border-glass mb-6">
        <button
          type="button"
          onClick={() => setTab('github')}
          className={cn(
            'flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer',
            tab === 'github' ? 'bg-primary text-white shadow-glow' : 'text-text-secondary hover:text-white'
          )}
        >
          <GithubIcon className="w-4 h-4" />
          <span>GitHub Repo</span>
        </button>
        <button
          type="button"
          onClick={() => setTab('upload')}
          className={cn(
            'flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer',
            tab === 'upload' ? 'bg-primary text-white shadow-glow' : 'text-text-secondary hover:text-white'
          )}
        >
          <Upload className="w-4 h-4" />
          <span>Upload ZIP</span>
        </button>
        <button
          type="button"
          onClick={() => setTab('manual')}
          className={cn(
            'flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer',
            tab === 'manual' ? 'bg-primary text-white shadow-glow' : 'text-text-secondary hover:text-white'
          )}
        >
          <Sliders className="w-4 h-4" />
          <span>Manual Config</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2.5 text-xs text-rose-300">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Quick Presets */}
      <div className="mb-6 space-y-1.5">
        <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Quick Demo Presets</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleQuickPreset('FinTech Payment Gateway', 'Node.js + Fastify')}
            className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary border border-white/10 transition-colors"
          >
            + FinTech Payment Gateway
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreset('Auth Identity Broker', 'Express + TypeScript')}
            className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary border border-white/10 transition-colors"
          >
            + Auth Identity Broker
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">Project Name</label>
          <input
            type="text"
            required
            placeholder="e.g. Payments Microservice"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full glass-input px-3.5 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">Description (Optional)</label>
          <input
            type="text"
            placeholder="Brief summary of repository scope"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full glass-input px-3.5 py-2 text-sm"
          />
        </div>

        {tab === 'github' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Repository URL</label>
              <input
                type="text"
                placeholder="https://github.com/org/repo"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="w-full glass-input px-3.5 py-2 text-sm font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Default Branch</label>
              <input
                type="text"
                placeholder="main"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full glass-input px-3.5 py-2 text-sm font-mono text-xs"
              />
            </div>
          </div>
        )}

        {tab === 'upload' && (
          <div className="p-8 border-2 border-dashed border-border-glass rounded-2xl text-center bg-white/[0.01] hover:bg-white/[0.03] transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium text-text-primary">Drag & drop project ZIP archive</p>
            <p className="text-xs text-text-muted mt-1">Up to 100MB • Auto-extracted into isolated Docker sandbox</p>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">Framework / Stack</label>
          <select
            value={framework}
            onChange={(e) => setFramework(e.target.value)}
            className="w-full glass-input px-3 py-2 text-sm bg-bg-surface text-text-primary"
          >
            <option value="Express + Node.js">Express + Node.js (TypeScript)</option>
            <option value="FastAPI + Python">FastAPI + Python</option>
            <option value="Next.js App Router">Next.js App Router</option>
            <option value="React + Vite">React + Vite</option>
            <option value="Go Fiber">Go Fiber Microservice</option>
          </select>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-glass">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Initialize Project & Scan
          </Button>
        </div>
      </form>
    </Modal>
  );
};
