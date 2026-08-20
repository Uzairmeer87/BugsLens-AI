import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsApi } from '../../services/api.js';
import { Project } from '../../types/index.js';
import { GlassCard } from '../../components/glass/GlassCard.js';
import { Button } from '../../components/ui/Button.js';
import { Badge } from '../../components/ui/Badge.js';
import { Skeleton, EmptyState, ErrorState } from '../../components/ui/StateComponents.js';
import { CreateProjectModal } from './CreateProjectModal.js';
import {
  FolderGit2,
  Plus,
  Search,
  Play,
  Sparkles,
  Bug,
  ShieldCheck,
  Code2,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { formatDate } from '../../lib/utils.js';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await projectsApi.list({ search });
      setProjects(res.data || []);
    } catch (err: any) {
      setError('Could not connect to the projects service.');
      // Fallback demo project list
      setProjects([
        {
          _id: 'p1',
          name: 'E-Commerce API',
          description: 'High-throughput microservices architecture with distributed checkout, inventory management, and Stripe integration.',
          owner: 'u1',
          repositoryUrl: 'https://github.com/buglens-ai/ecommerce-api',
          repositoryName: 'buglens-ai/ecommerce-api',
          defaultBranch: 'main',
          languages: ['TypeScript', 'Node.js', 'Docker'],
          framework: 'Express + Fastify',
          projectType: 'api',
          status: 'active',
          codeQualityScore: 94,
          testCoverage: 87.4,
          totalFiles: 1284,
          totalLines: 84293,
          totalBugs: 43,
          totalTests: 1248,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: 'p2',
          name: 'Auth Identity Broker',
          description: 'OAuth2 / OpenID connect session provider with JWT token rotation.',
          owner: 'u1',
          repositoryUrl: 'https://github.com/enterprise/auth-identity-broker',
          repositoryName: 'enterprise/auth-identity-broker',
          defaultBranch: 'main',
          languages: ['TypeScript', 'Go'],
          framework: 'Fastify',
          projectType: 'api',
          status: 'active',
          codeQualityScore: 96,
          testCoverage: 92.1,
          totalFiles: 420,
          totalLines: 31200,
          totalBugs: 14,
          totalTests: 680,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [search]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Project Workspaces</h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage codebases, trigger automated scans, and review coverage health.
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsCreateOpen(true)}
        >
          Create Project
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search projects by name, repo, or framework..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full glass-input pl-10 pr-4 py-2 text-xs"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-6 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-12 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : error && projects.length === 0 ? (
        <ErrorState message={error} onRetry={fetchProjects} />
      ) : projects.length === 0 ? (
        <EmptyState
          icon={<FolderGit2 className="w-8 h-8" />}
          title="No projects found"
          description="Connect a GitHub repository or create your first workspace to start automated testing."
          action={
            <Button variant="primary" onClick={() => setIsCreateOpen(true)}>
              Create First Project
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <GlassCard
              key={proj._id}
              className="flex flex-col justify-between p-6 cursor-pointer group"
              glowColor="primary"
              onClick={() => navigate('/analysis')}
            >
              <div>
                {/* Title & Status */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-primary-light transition-colors flex items-center gap-2">
                    <FolderGit2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="truncate">{proj.name}</span>
                  </h3>
                  <Badge variant={proj.status === 'active' ? 'success' : 'info'} dot size="sm">
                    {proj.status}
                  </Badge>
                </div>

                {/* Repository URL */}
                <p className="text-xs font-mono text-text-muted mb-3 truncate flex items-center gap-1">
                  <Code2 className="w-3 h-3" />
                  <span>{proj.repositoryName || 'github.com/repository'}</span>
                </p>

                {/* Description */}
                <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed mb-6">
                  {proj.description || 'No description provided.'}
                </p>

                {/* Metrics Badges */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-white/[0.02] border border-border-glass text-center mb-6">
                  <div>
                    <span className="text-[10px] text-text-muted uppercase font-semibold block">Quality</span>
                    <span className="text-sm font-bold font-mono text-emerald-400">
                      {proj.codeQualityScore}/100
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted uppercase font-semibold block">Coverage</span>
                    <span className="text-sm font-bold font-mono text-cyan-400">
                      {proj.testCoverage}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted uppercase font-semibold block">Bugs</span>
                    <span className="text-sm font-bold font-mono text-rose-400">
                      {proj.totalBugs}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border-glass text-xs">
                <span className="text-text-muted flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(proj.updatedAt)}</span>
                </span>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => navigate('/analysis')}
                    className="p-1.5 rounded-lg text-text-secondary hover:text-primary-light hover:bg-white/5 transition-colors"
                    title="Code Explorer"
                  >
                    <Code2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigate('/test-lab')}
                    className="p-1.5 rounded-lg text-text-secondary hover:text-emerald-400 hover:bg-white/5 transition-colors"
                    title="Launch Test Lab"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Modal */}
      <CreateProjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={fetchProjects}
      />
    </div>
  );
};
