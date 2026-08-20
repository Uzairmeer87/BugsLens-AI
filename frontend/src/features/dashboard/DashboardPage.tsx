import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../../components/glass/GlassCard.js';
import { AnimatedCounter } from '../../components/ui/AnimatedCounter.js';
import { Button } from '../../components/ui/Button.js';
import { Badge } from '../../components/ui/Badge.js';
import { projectsApi, testingApi, scansApi } from '../../services/api.js';
import {
  FolderGit2,
  FlaskConical,
  Bug,
  ShieldCheck,
  Play,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);

  // Line chart trend data
  const trendData = [
    { day: 'Mon', passRate: 88, coverage: 82 },
    { day: 'Tue', passRate: 91, coverage: 84 },
    { day: 'Wed', passRate: 89, coverage: 85 },
    { day: 'Thu', passRate: 94, coverage: 86 },
    { day: 'Fri', passRate: 92, coverage: 87.4 },
    { day: 'Sat', passRate: 96, coverage: 87.4 },
    { day: 'Sun', passRate: 95, coverage: 87.4 },
  ];

  // Donut chart bug distribution data
  const bugData = [
    { name: 'Critical', value: 2, color: '#ef4444' },
    { name: 'High', value: 7, color: '#f59e0b' },
    { name: 'Medium', value: 19, color: '#3b82f6' },
    { name: 'Low', value: 15, color: '#64748b' },
  ];

  const recentRuns = [
    { id: 'TR-849', project: 'E-Commerce API', tests: 1248, passed: 1205, failed: 43, duration: '4.82s', status: 'failed' },
    { id: 'TR-848', project: 'E-Commerce API', tests: 1248, passed: 1248, failed: 0, duration: '4.15s', status: 'completed' },
    { id: 'TR-847', project: 'Payment Gateway Worker', tests: 412, passed: 410, failed: 2, duration: '2.10s', status: 'failed' },
    { id: 'TR-846', project: 'Auth Service Micro', tests: 180, passed: 180, failed: 0, duration: '0.94s', status: 'completed' },
  ];

  const handleQuickScan = async () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      navigate('/analysis');
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            Engineering Overview
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/20 text-primary-light border border-primary/30">
              E-Commerce API
            </span>
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Real-time telemetry, test coverage analysis, and neural vulnerability diagnostics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            leftIcon={<Play className="w-4 h-4 text-emerald-400" />}
            onClick={() => navigate('/test-lab')}
          >
            Launch Test Lab
          </Button>
          <Button
            variant="primary"
            isLoading={isScanning}
            leftIcon={<Sparkles className="w-4 h-4" />}
            onClick={handleQuickScan}
          >
            Run AI Code Scan
          </Button>
        </div>
      </div>

      {/* Top 4 Metrics Cards with Animated Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <GlassCard glowColor="primary" onClick={() => navigate('/projects')} className="cursor-pointer">
          <div className="flex items-center justify-between text-text-muted mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Projects</span>
            <div className="p-2 rounded-xl bg-primary/10 text-primary-light">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white font-mono">
            <AnimatedCounter value={12} />
          </p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+2 connected this month</span>
          </div>
        </GlassCard>

        <GlassCard glowColor="cyan" onClick={() => navigate('/test-lab')} className="cursor-pointer">
          <div className="flex items-center justify-between text-text-muted mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Automated Tests</span>
            <div className="p-2 rounded-xl bg-accent-cyan/10 text-cyan-400">
              <FlaskConical className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white font-mono">
            <AnimatedCounter value={1248} />
          </p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>96.5% pass rate (7 suites)</span>
          </div>
        </GlassCard>

        <GlassCard glowColor="rose" onClick={() => navigate('/bugs')} className="cursor-pointer">
          <div className="flex items-center justify-between text-text-muted mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Detected Bugs</span>
            <div className="p-2 rounded-xl bg-accent-rose/10 text-rose-400">
              <Bug className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white font-mono">
            <AnimatedCounter value={43} />
          </p>
          <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-2 font-medium">
            <span className="font-semibold">2 Critical</span>
            <span className="text-text-muted">• 7 High • 19 Med • 15 Low</span>
          </div>
        </GlassCard>

        <GlassCard glowColor="emerald" onClick={() => navigate('/coverage')} className="cursor-pointer">
          <div className="flex items-center justify-between text-text-muted mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Test Coverage</span>
            <div className="p-2 rounded-xl bg-accent-emerald/10 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white font-mono">
            <AnimatedCounter value={87.4} decimals={1} suffix="%" />
          </p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+3.2% from previous commit</span>
          </div>
        </GlassCard>
      </div>

      {/* Visual Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Test Success Rate Line Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-text-primary">Test Success & Coverage Trend</h3>
              <p className="text-xs text-text-secondary">Historical regression stability over the past 7 days</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                <span className="text-text-secondary">Pass Rate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-cyan" />
                <span className="text-text-secondary">Coverage</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} domain={[70, 100]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#151522',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Line type="monotone" dataKey="passRate" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="coverage" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radial Code Quality Score + Bug Severity */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-semibold text-text-primary">Code Quality Score</h3>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">A+ Excellent</span>
            </div>
            <p className="text-xs text-text-secondary mb-4">Neural static + dynamic AST index</p>

            {/* Big Radial Gauge */}
            <div className="my-3 flex items-center justify-center">
              <div className="relative w-36 h-36 rounded-full border-4 border-primary/20 flex flex-col items-center justify-center bg-primary/5 shadow-glow">
                <span className="text-4xl font-extrabold font-mono text-white">94</span>
                <span className="text-[11px] text-text-muted font-medium">/ 100</span>
              </div>
            </div>

            {/* Quality Subscores */}
            <div className="space-y-1.5 mt-4 text-xs">
              <div className="flex justify-between text-text-secondary">
                <span>Maintainability</span>
                <span className="font-mono text-text-primary font-semibold">96%</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Reliability</span>
                <span className="font-mono text-text-primary font-semibold">91%</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Security</span>
                <span className="font-mono text-text-primary font-semibold">89%</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Performance</span>
                <span className="font-mono text-text-primary font-semibold">95%</span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full mt-4"
            rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
            onClick={() => navigate('/analysis')}
          >
            Inspect Code Quality Matrix
          </Button>
        </div>
      </div>

      {/* Recent Test Runs Table */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-text-primary">Recent Automated Test Runs</h3>
            <p className="text-xs text-text-secondary">Simulated and Docker worker execution log</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/test-lab')}>
            View All Test Runs
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-text-muted border-b border-border-glass uppercase text-[10px] tracking-wider">
              <tr>
                <th className="pb-3 font-semibold">Run ID</th>
                <th className="pb-3 font-semibold">Project</th>
                <th className="pb-3 font-semibold">Total Tests</th>
                <th className="pb-3 font-semibold">Passed / Failed</th>
                <th className="pb-3 font-semibold">Duration</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-glass">
              {recentRuns.map((run) => (
                <tr key={run.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 font-mono font-semibold text-primary-light">{run.id}</td>
                  <td className="py-3.5 text-text-primary font-medium">{run.project}</td>
                  <td className="py-3.5 font-mono">{run.tests}</td>
                  <td className="py-3.5">
                    <span className="text-emerald-400 font-medium">{run.passed}</span>
                    <span className="text-text-muted"> / </span>
                    <span className={run.failed > 0 ? 'text-rose-400 font-bold' : 'text-text-muted'}>
                      {run.failed}
                    </span>
                  </td>
                  <td className="py-3.5 text-text-secondary flex items-center gap-1">
                    <Clock className="w-3 h-3 text-text-muted" />
                    <span>{run.duration}</span>
                  </td>
                  <td className="py-3.5">
                    <Badge variant={run.status === 'completed' ? 'success' : 'danger'} dot size="sm">
                      {run.status === 'completed' ? 'Passed' : 'Failed'}
                    </Badge>
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => navigate('/test-lab')}
                      className="text-primary-light hover:underline text-xs font-semibold"
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
