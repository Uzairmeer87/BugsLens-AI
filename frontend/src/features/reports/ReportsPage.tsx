import React, { useState } from 'react';
import { reportsApi } from '../../services/api.js';
import { GlassCard } from '../../components/glass/GlassCard.js';
import { Button } from '../../components/ui/Button.js';
import { Badge } from '../../components/ui/Badge.js';
import {
  FileText,
  Download,
  Share2,
  Sparkles,
  Printer,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Server,
  Layers,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const report = {
    id: 'REP-9021-ECOMMERCE',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    project: 'E-Commerce API',
    repository: 'buglens-ai/ecommerce-api',
    qualityScore: 94,
    coverage: 87.4,
    totalTests: 1248,
    passed: 1205,
    failed: 43,
    bugsTotal: 43,
    criticalBugs: 2,
    highBugs: 7,
  };

  const handleDownloadPDF = () => {
    window.print();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-primary-light" />
            <span>Executive Testing & Quality Reports</span>
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Automated PDF synthesis covering code health, AST vulnerabilities, and test execution results.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Share2 className="w-4 h-4" />}
            onClick={() => alert('Report link copied to clipboard!')}
          >
            Share
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={handleDownloadPDF}
          >
            {downloadSuccess ? 'Downloaded!' : 'Export PDF Report'}
          </Button>
        </div>
      </div>

      {/* Printable Report Document Sheet */}
      <div className="glass-panel p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl space-y-8 print:bg-white print:text-black">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border-glass gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-primary-light uppercase tracking-wider">
                ◈ BugLens AI Audit Report
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono">
                #{report.id}
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">{report.project}</h2>
            <p className="text-xs text-text-muted font-mono">{report.repository} • Generated {report.date}</p>
          </div>

          <div className="text-right">
            <span className="text-3xl font-extrabold font-mono text-emerald-400">
              {report.qualityScore} <span className="text-sm text-text-muted">/100</span>
            </span>
            <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Grade: A+ (Excellent)
            </p>
          </div>
        </div>

        {/* 1. Executive Summary */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary-light">
            1. Executive Summary
          </h3>
          <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
            BugLens AI completed comprehensive static, automated, and intelligent heuristic evaluations of "{report.project}".
            The codebase demonstrates strong architectural maturity with an overall quality score of {report.qualityScore}/100 and {report.coverage}% test coverage.
            A total of {report.bugsTotal} issues were identified across 1,284 files, including {report.criticalBugs} critical vulnerabilities requiring immediate mitigation prior to production release.
          </p>
        </div>

        {/* 2. Key Metrics Snapshot */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary-light">
            2. Testing & Quality Telemetry
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-border-glass">
              <span className="text-[11px] text-text-muted block font-semibold">Total Test Cases</span>
              <span className="text-xl font-bold font-mono text-white mt-1 block">{report.totalTests}</span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-border-glass">
              <span className="text-[11px] text-text-muted block font-semibold">Pass Rate</span>
              <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">96.5%</span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-border-glass">
              <span className="text-[11px] text-text-muted block font-semibold">Test Coverage</span>
              <span className="text-xl font-bold font-mono text-cyan-400 mt-1 block">{report.coverage}%</span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-border-glass">
              <span className="text-[11px] text-text-muted block font-semibold">Critical Bugs</span>
              <span className="text-xl font-bold font-mono text-rose-400 mt-1 block">{report.criticalBugs}</span>
            </div>
          </div>
        </div>

        {/* 3. Security Findings & Recommendations */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary-light">
            3. AI Security Analysis & Action Items
          </h3>
          <div className="space-y-2 text-xs">
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200">
              <p className="font-bold flex items-center gap-1.5 text-rose-300 mb-1">
                <ShieldAlert className="w-4 h-4" />
                <span>Critical: Payment Gateway Idempotency Race Condition (Line 84, payment.service.ts)</span>
              </p>
              <p className="text-text-secondary leading-relaxed">
                Recommendation: Implement distributed mutex locking with Redis (Redlock) keyed on idempotencyToken to ensure transaction idempotency under network retries.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200">
              <p className="font-bold flex items-center gap-1.5 text-rose-300 mb-1">
                <ShieldAlert className="w-4 h-4" />
                <span>Critical: Unvalidated Query Parameter Injection (Line 42, user.controller.ts)</span>
              </p>
              <p className="text-text-secondary leading-relaxed">
                Recommendation: Wrap all incoming req.query fields with strict Zod schema validation to eliminate object-level NoSQL injection.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Conclusion */}
        <div className="pt-4 border-t border-border-glass flex items-center justify-between text-xs text-text-muted">
          <p>Audited & Verified by BugLens Neural Engine v2.4</p>
          <p className="font-mono">Status: ACTION REQUIRED (2 Critical Items)</p>
        </div>
      </div>
    </div>
  );
};
