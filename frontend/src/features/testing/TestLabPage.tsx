import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSocket } from '../../lib/socket.js';
import { GlassCard } from '../../components/glass/GlassCard.js';
import { Button } from '../../components/ui/Button.js';
import { Badge } from '../../components/ui/Badge.js';
import { TestGeneratorModal } from './TestGeneratorModal.js';
import {
  FlaskConical,
  Play,
  Sparkles,
  Server,
  Terminal,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { cn } from '../../lib/utils.js';

interface SuiteItem {
  id: string;
  name: string;
  category: string;
  testsCount: number;
  status: 'passed' | 'failed' | 'running' | 'idle';
  duration: string;
}

export const TestLabPage: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [progress, setProgress] = useState(0);
  const [passedCount, setPassedCount] = useState(1205);
  const [failedCount, setFailedCount] = useState(43);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const navigate = useNavigate();

  const [suites, setSuites] = useState<SuiteItem[]>([
    { id: 's1', name: 'Authentication & Session Security', category: 'Security', testsCount: 180, status: 'passed', duration: '0.84s' },
    { id: 's2', name: 'User Management & CRUD Contracts', category: 'Functional', testsCount: 340, status: 'passed', duration: '1.20s' },
    { id: 's3', name: 'Payment & Distributed Transactions', category: 'API', testsCount: 220, status: 'failed', duration: '1.45s' },
    { id: 's4', name: 'Inventory Concurrency & Race Conditions', category: 'Functional', testsCount: 260, status: 'passed', duration: '0.92s' },
    { id: 's5', name: 'UI / E2E Checkout Flow (Playwright)', category: 'UI', testsCount: 120, status: 'passed', duration: '2.80s' },
    { id: 's6', name: 'SQL/NoSQL Guard & XSS Sanitization', category: 'Security', testsCount: 128, status: 'passed', duration: '0.61s' },
  ]);

  // Connect live Socket.IO events for live execution feedback
  useEffect(() => {
    const socket = getSocket();

    socket.on('test:started', () => {
      setIsRunning(true);
      setProgress(5);
      setCurrentStep('Initializing test container sandbox...');
    });

    socket.on('test:progress', (data: any) => {
      setProgress(data.progress);
      setCurrentStep(`Executing ${data.step}...`);
      if (data.passed) setPassedCount(data.passed);
      if (data.failed) setFailedCount(data.failed);
    });

    socket.on('test:completed', (data: any) => {
      setIsRunning(false);
      setProgress(100);
      setCurrentStep('Test execution complete.');
    });

    return () => {
      socket.off('test:started');
      socket.off('test:progress');
      socket.off('test:completed');
    };
  }, []);

  const handleTriggerRun = async () => {
    setIsRunning(true);
    setProgress(10);
    setCurrentStep('Provisioning isolated Docker runtime container...');

    // Simulate step by step progress for instant responsive feedback
    const steps = [
      { p: 25, msg: '✓ Chromium 124 headless runner initialized' },
      { p: 45, msg: '✓ Executing Authentication & Session Security suites' },
      { p: 70, msg: '◉ Testing Payment & Distributed Transactions (Idempotency)' },
      { p: 90, msg: '✓ Validating Inventory pessimistic lock constraints' },
      { p: 100, msg: '✓ Run completed. 1 Failure detected.' },
    ];

    for (const st of steps) {
      await new Promise((res) => setTimeout(res, 800));
      setProgress(st.p);
      setCurrentStep(st.msg);
    }

    setIsRunning(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <FlaskConical className="w-7 h-7 text-accent-cyan" />
            <span>Autonomous Test Lab</span>
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Execute distributed unit, API, and Playwright UI tests in isolated container sandboxes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            leftIcon={<Sparkles className="w-4 h-4 text-primary-light" />}
            onClick={() => setIsGeneratorOpen(true)}
          >
            AI Test Generator
          </Button>
          <Button
            variant="primary"
            isLoading={isRunning}
            leftIcon={<Play className="w-4 h-4" />}
            onClick={handleTriggerRun}
          >
            Execute All Suites
          </Button>
        </div>
      </div>

      {/* Test Environment Card */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-text-primary">Container Runtime Environment</h4>
            <p className="text-xs text-text-muted">Docker Node 22.x LTS • Chromium 124 Headless • Linux x86_64</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-border-glass">
            <span className="text-text-muted">Total Tests: </span>
            <span className="font-mono font-bold text-white">1,248</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
            <span>Passed: </span>
            <span className="font-mono font-bold">{passedCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
            <span>Failed: </span>
            <span className="font-mono font-bold">{failedCount}</span>
          </div>
        </div>
      </div>

      {/* Live Execution Progress Bar */}
      {isRunning && (
        <div className="glass-card p-6 border-primary/30 shadow-glow space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-primary-light flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              {currentStep}
            </span>
            <span className="font-mono text-white">{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent-cyan transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Test Suites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suites.map((suite) => (
          <GlassCard key={suite.id} className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <Badge variant="neutral" size="sm">
                  {suite.category}
                </Badge>
                <Badge
                  variant={suite.status === 'passed' ? 'success' : suite.status === 'failed' ? 'danger' : 'info'}
                  dot
                  size="sm"
                >
                  {suite.status === 'passed' ? 'Passed' : suite.status === 'failed' ? 'Failed' : 'Running'}
                </Badge>
              </div>

              <h3 className="text-base font-bold text-text-primary mb-1.5">{suite.name}</h3>
              <p className="text-xs text-text-secondary">
                {suite.testsCount} automated unit and integration assertions.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border-glass flex items-center justify-between text-xs">
              <span className="text-text-muted flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3" />
                <span>{suite.duration}</span>
              </span>

              {suite.status === 'failed' ? (
                <button
                  onClick={() => navigate('/bugs')}
                  className="text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>AI Root Cause</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>100% Passed</span>
                </span>
              )}
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Failure Spotlight Card */}
      <div className="glass-panel p-6 border-rose-500/30 bg-rose-500/5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-300">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-rose-200">
              Payment Gateway Idempotency Failure on Network Timeout
            </h4>
            <p className="text-xs text-text-secondary mt-1 max-w-2xl">
              Duplicate transaction detected when client retries payload after 3000ms delay. AI Root Cause analysis has identified the exact line in payment.service.ts.
            </p>
          </div>
        </div>

        <Button
          variant="danger"
          size="sm"
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          onClick={() => navigate('/bugs')}
        >
          Review Bug & AI Fix
        </Button>
      </div>

      <TestGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
      />
    </div>
  );
};
