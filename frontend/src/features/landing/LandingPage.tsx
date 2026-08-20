import React from 'react';
import { Link } from 'react-router-dom';
import { GlassNavbar } from '../../components/glass/GlassNavbar.js';
import { AICore3D } from '../../components/three/AICore3D.js';
import { Button } from '../../components/ui/Button.js';
import { GlassCard } from '../../components/glass/GlassCard.js';
import { AnimatedCounter } from '../../components/ui/AnimatedCounter.js';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Bug,
  Code2,
  FlaskConical,
  Zap,
  CheckCircle2,
  Layers,
  Terminal,
  Activity,
  Cpu,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const features = [
    {
      icon: <Cpu className="w-6 h-6 text-primary-light" />,
      title: 'AI Code Analysis',
      description: 'Deep neural AST parsing inspects 1,000+ files in seconds, flagging subtle race conditions, SQL injections, and code smells.',
      glow: 'primary' as const,
    },
    {
      icon: <FlaskConical className="w-6 h-6 text-accent-cyan" />,
      title: 'Automated Test Generation',
      description: 'Generates production-grade functional, boundary, negative, and security test cases tailored directly to your codebase APIs.',
      glow: 'cyan' as const,
    },
    {
      icon: <Bug className="w-6 h-6 text-accent-rose" />,
      title: 'Intelligent Root-Cause Analysis',
      description: 'When tests fail, AI pinpoints the exact line number, explains why it happened, and produces clean before/after code diffs.',
      glow: 'rose' as const,
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-accent-emerald" />,
      title: 'Test Coverage & Quality Score',
      description: 'Real-time calculation of maintainability, reliability, security, and statement coverage down to individual functions.',
      glow: 'emerald' as const,
    },
    {
      icon: <Zap className="w-6 h-6 text-accent-amber" />,
      title: 'Real-Time Test Lab',
      description: 'Isolated test runners execute Playwright, Vitest, and Jest suites with instant live WebSocket step updates.',
      glow: 'amber' as const,
    },
    {
      icon: <Terminal className="w-6 h-6 text-primary-light" />,
      title: 'Developer First & CLI Ready',
      description: 'Connect any GitHub repository or upload ZIP packages with zero configuration. Works seamlessly in CI/CD pipelines.',
      glow: 'primary' as const,
    },
  ];

  const steps = [
    { num: '01', title: 'Connect Repository', desc: 'Link your GitHub repo or drag-and-drop a ZIP archive.' },
    { num: '02', title: 'AI Deep Scan', desc: 'Our engine indexes syntax trees and flags security vulnerabilities.' },
    { num: '03', title: 'Execute Test Lab', desc: 'Autonomous workers execute simulated browser and API test suites.' },
    { num: '04', title: 'Instant AI Fixes', desc: 'Review root cause diagnosis, inspect code diffs, and ship confidence.' },
  ];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary overflow-hidden relative">
      {/* Background Animated Grid & Glow */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-accent-cyan/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <GlassNavbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="flex-1 text-center lg:text-left space-y-6 z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-border-glass text-xs font-medium text-text-secondary shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Next-Generation Intelligent Testing Platform</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-gradient">
            Find Bugs Before <br />
            <span className="text-gradient-primary">Your Users Do.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg text-text-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
            AI-powered software testing, automated bug detection, intelligent test generation, and real-time code analysis in one developer-first platform.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <Link to="/register">
              <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Start Testing Free
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="secondary" leftIcon={<Sparkles className="w-4 h-4 text-primary" />}>
                View Live Demo
              </Button>
            </Link>
          </div>

          {/* Micro Trust Stats */}
          <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-text-muted">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero setup required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>GitHub OAuth native</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Demo Mode ready</span>
            </div>
          </div>
        </div>

        {/* 3D AI Core Visualization */}
        <div className="flex-1 w-full max-w-lg lg:max-w-xl relative">
          <AICore3D className="h-[420px] md:h-[480px]" />
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="border-y border-border-glass bg-white/[0.01] py-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
              <AnimatedCounter value={1284} />
            </p>
            <p className="text-xs text-text-muted mt-1 uppercase tracking-wider font-semibold">Files Scanned per Repo</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-accent-cyan font-mono">
              <AnimatedCounter value={1248} />
            </p>
            <p className="text-xs text-text-muted mt-1 uppercase tracking-wider font-semibold">Test Cases Generated</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-accent-emerald font-mono">
              <AnimatedCounter value={87.4} decimals={1} suffix="%" />
            </p>
            <p className="text-xs text-text-muted mt-1 uppercase tracking-wider font-semibold">Average Test Coverage</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-primary-light font-mono">
              <AnimatedCounter value={94} suffix="/100" />
            </p>
            <p className="text-xs text-text-muted mt-1 uppercase tracking-wider font-semibold">Code Quality Score</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary-light px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            Engine Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Everything you need to ship confident code.
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-sm sm:text-base">
            From automated branch scanning to AI-driven test suites and root-cause fix generation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <GlassCard key={idx} glowColor={feat.glow}>
              <div className="p-3 rounded-xl bg-white/5 w-fit mb-4">{feat.icon}</div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">{feat.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{feat.description}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 max-w-7xl mx-auto border-t border-border-glass">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent-cyan px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/20">
            Autonomous Pipeline
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            How BugLens AI Works
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div key={idx} className="glass-card p-6 relative">
              <span className="text-3xl font-black font-mono text-white/10 mb-3 block">
                {step.num}
              </span>
              <h4 className="text-base font-semibold text-text-primary mb-2">{step.title}</h4>
              <p className="text-xs text-text-secondary leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center">
        <div className="glass-panel p-12 md:p-16 relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-accent-cyan/20 rounded-full blur-[90px] pointer-events-none" />

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to find bugs before your users do?
          </h2>
          <p className="text-text-secondary text-sm sm:text-base max-w-xl mx-auto mb-8">
            Experience the automated testing platform built for modern engineering teams.
          </p>
          <Link to="/register">
            <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Get Started Now — It's Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-glass py-8 px-6 text-center text-xs text-text-muted">
        <p>© 2026 BugLens AI Inc. All rights reserved. Find Bugs. Understand Code. Ship With Confidence.</p>
      </footer>
    </div>
  );
};
