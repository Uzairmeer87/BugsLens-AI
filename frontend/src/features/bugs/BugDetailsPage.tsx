import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DiffEditor } from '@monaco-editor/react';
import { bugsApi, aiApi } from '../../services/api.js';
import { Bug } from '../../types/index.js';
import { Button } from '../../components/ui/Button.js';
import { Badge } from '../../components/ui/Badge.js';
import { GlassCard } from '../../components/glass/GlassCard.js';
import {
  Bug as BugIcon,
  Sparkles,
  Check,
  Copy,
  Download,
  Play,
  ArrowLeft,
  ShieldAlert,
  Code2,
  CheckCircle2,
  FileCode,
} from 'lucide-react';
import { GithubIcon } from '../../components/ui/Icons.js';
import { getSeverityColor } from '../../lib/utils.js';

export const BugDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bug, setBug] = useState<Bug | null>(null);
  const [copiedPatch, setCopiedPatch] = useState(false);
  const [isResolved, setIsResolved] = useState(false);
  const [isFixing, setIsFixing] = useState(false);

  // Root cause and Diff state
  const [rootCause, setRootCause] = useState({
    explanation:
      'The authentication middleware fails with a null dereference because req.user is accessed before the token verification middleware completes its asynchronous verification chain.',
    whyItHappened:
      'In routes/api.ts, permissionChecker was registered ahead of authenticate on router.use(), executing role checks on undefined req.user.',
    suggestedFix:
      'Re-order the Express router middleware chain so that authenticate runs before requireRole and guard req.user before dereferencing properties.',
    confidence: 95.8,
  });

  const [diffData, setDiffData] = useState({
    before: `// BEFORE: Route registered in incorrect middleware sequence
router.get(
  '/api/v1/checkout/ledger',
  requireRole('developer'), // ❌ Error: req.user is undefined here!
  authenticate,
  checkoutController.getLedger
);`,
    after: `// AFTER: Guaranteed safe authentication middleware sequence
router.get(
  '/api/v1/checkout/ledger',
  authenticate,             // ✅ Authenticates and attaches req.user
  requireRole('developer'), // ✅ Safe to read req.user.role
  checkoutController.getLedger
);`,
  });

  useEffect(() => {
    const fetchBug = async () => {
      try {
        if (id) {
          const b = await bugsApi.getById(id);
          setBug(b);
        }
      } catch {
        // Fallback default demo bug
        setBug({
          _id: id || 'b1',
          projectId: 'p1',
          title: 'Payment Gateway Idempotency Race Condition in Distributed Settlement',
          description:
            'Concurrent requests with identical idempotency headers execute parallel database transactions if received within the 5ms window before Redis lock acquisition.',
          severity: 'critical',
          priority: 'critical',
          status: 'open',
          category: 'bug',
          file: 'src/services/payment.service.ts',
          line: 84,
          codeSnippet: 'const payment = await stripe.charges.create({ amount, currency, customer });',
          error: 'DuplicateTransactionError: Charge already processed for order #ORD-9821',
          stackTrace:
            'Error: DuplicateTransactionError\n    at PaymentService.charge (src/services/payment.service.ts:84:12)\n    at Context.<anonymous> (test/payment.spec.ts:42:7)',
          stepsToReproduce: [
            '1. Send simultaneous POST /api/checkout calls',
            '2. Inject 3000ms latency into payment gateway stub',
            '3. Observe multiple charges created for identical orderId',
          ],
          rootCause: 'Lack of atomic distributed locking mechanism prior to third-party charge invocation.',
          suggestedFix: 'Acquire Redlock distributed mutex with 10s TTL keyed on idempotencyToken before initiating payment.',
          confidence: 97.4,
          detectedBy: 'test',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    };
    fetchBug();
  }, [id]);

  const handleCopyFix = () => {
    navigator.clipboard.writeText(diffData.after);
    setCopiedPatch(true);
    setTimeout(() => setCopiedPatch(false), 1500);
  };

  const handleMarkResolved = async () => {
    setIsResolved(true);
    if (bug?._id) {
      try {
        await bugsApi.update(bug._id, { status: 'resolved' });
      } catch {
        // ignore
      }
    }
  };

  if (!bug) return null;

  const sev = getSeverityColor(bug.severity);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Back Button */}
      <button
        onClick={() => navigate('/bugs')}
        className="inline-flex items-center gap-2 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Bug Management</span>
      </button>

      {/* Bug Header Card */}
      <div className="glass-panel p-6 md:p-8 rounded-2xl border border-white/10 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className={`text-xs font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${sev.badge}`}>
            {bug.severity}
          </span>
          <Badge variant="neutral">{bug.category}</Badge>
          <Badge variant={isResolved ? 'success' : 'danger'} dot>
            {isResolved ? 'Resolved' : bug.status.toUpperCase()}
          </Badge>
          <span className="text-xs text-text-muted font-mono ml-auto">
            Detected by {bug.detectedBy.toUpperCase()} • Confidence {bug.confidence}%
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          {bug.title}
        </h1>

        <p className="text-sm text-text-secondary leading-relaxed max-w-4xl">
          {bug.description}
        </p>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border-glass">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Sparkles className="w-4 h-4" />}
            onClick={() => {
              setIsFixing(true);
              setTimeout(() => setIsFixing(false), 900);
            }}
            isLoading={isFixing}
          >
            Re-Synthesize AI Fix
          </Button>

          <Button
            variant="secondary"
            size="sm"
            leftIcon={isResolved ? <Check className="w-4 h-4 text-emerald-400" /> : <CheckCircle2 className="w-4 h-4" />}
            onClick={handleMarkResolved}
          >
            {isResolved ? 'Resolved in Staging' : 'Mark as Resolved'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Play className="w-4 h-4 text-emerald-400" />}
            onClick={() => navigate('/test-lab')}
          >
            Re-run Test Suite
          </Button>
        </div>
      </div>

      {/* Root Cause Analysis Banner */}
      <div className="glass-card p-6 border-emerald-500/30 bg-emerald-500/[0.03] space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
          <Sparkles className="w-5 h-5" />
          <span>Autonomous AI Root-Cause Diagnostic ({rootCause.confidence}% Confidence)</span>
        </div>

        <div className="space-y-3 text-xs leading-relaxed">
          <div>
            <span className="font-bold text-text-primary uppercase tracking-wider text-[10px]">Root Cause:</span>
            <p className="text-emerald-200 mt-0.5 text-sm">{rootCause.explanation}</p>
          </div>
          <div>
            <span className="font-bold text-text-primary uppercase tracking-wider text-[10px]">Mechanism:</span>
            <p className="text-text-secondary mt-0.5">{rootCause.whyItHappened}</p>
          </div>
        </div>
      </div>

      {/* Diff Editor: Before vs After */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <FileCode className="w-4 h-4 text-primary" />
              <span>Suggested Code Fix (Monaco Diff Viewer)</span>
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Review before/after patch for {bug.file}:{bug.line}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={copiedPatch ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              onClick={handleCopyFix}
            >
              {copiedPatch ? 'Copied Patch' : 'Copy Fix'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<GithubIcon className="w-3.5 h-3.5" />}
              onClick={() => alert('Demo Mode: GitHub Issue #1024 Drafted.')}
            >
              Create GitHub Issue
            </Button>
          </div>
        </div>

        {/* Monaco Diff */}
        <div className="h-64 rounded-xl overflow-hidden border border-white/5 bg-[#12121c]">
          <DiffEditor
            height="100%"
            language="typescript"
            original={diffData.before}
            modified={diffData.after}
            theme="vs-dark"
            options={{
              readOnly: true,
              renderSideBySide: true,
              fontSize: 12,
              minimap: { enabled: false },
            }}
          />
        </div>
      </div>

      {/* Stack Trace & Steps to Reproduce */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 space-y-3">
          <h4 className="text-sm font-bold text-text-primary flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Stack Trace</span>
          </h4>
          <pre className="p-3.5 rounded-xl bg-black/40 border border-border-glass text-[11px] font-mono text-rose-300 overflow-x-auto leading-relaxed">
            {bug.stackTrace || 'No stack trace captured.'}
          </pre>
        </div>

        <div className="glass-card p-6 space-y-3">
          <h4 className="text-sm font-bold text-text-primary flex items-center gap-2">
            <Code2 className="w-4 h-4 text-primary-light" />
            <span>Steps to Reproduce</span>
          </h4>
          <div className="space-y-2 text-xs text-text-secondary">
            {bug.stepsToReproduce?.map((step, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-white/[0.02] border border-border-glass">
                {step}
              </div>
            )) || <p>No specific steps recorded.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
