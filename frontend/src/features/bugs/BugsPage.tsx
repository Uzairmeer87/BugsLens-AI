import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bugsApi } from '../../services/api.js';
import { Bug } from '../../types/index.js';
import { GlassCard } from '../../components/glass/GlassCard.js';
import { Button } from '../../components/ui/Button.js';
import { Badge } from '../../components/ui/Badge.js';
import { Skeleton, EmptyState, ErrorState } from '../../components/ui/StateComponents.js';
import {
  Bug as BugIcon,
  Search,
  Filter,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Code2,
  CheckCircle2,
  Clock,
  User,
} from 'lucide-react';
import { getSeverityColor } from '../../lib/utils.js';

export const BugsPage: React.FC = () => {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchBugs = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await bugsApi.list({
        severity: severityFilter !== 'all' ? severityFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: search.trim() || undefined,
      });
      setBugs(res.data || []);
    } catch {
      // Fallback demo bugs
      setBugs([
        {
          _id: 'b1',
          projectId: 'p1',
          title: 'Payment Gateway Idempotency Race Condition in Distributed Settlement',
          description: 'Concurrent requests with identical idempotency headers execute parallel database transactions if received within the 5ms window before Redis lock acquisition.',
          severity: 'critical',
          priority: 'critical',
          status: 'open',
          category: 'bug',
          file: 'src/services/payment.service.ts',
          line: 84,
          codeSnippet: 'const payment = await stripe.charges.create({ amount, currency, customer });',
          error: 'DuplicateTransactionError: Charge already processed for order #ORD-9821',
          confidence: 97.4,
          detectedBy: 'test',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: 'b2',
          projectId: 'p1',
          title: 'Unvalidated Query Operator Injection in User Search Filter',
          description: 'Raw query object passed directly into Mongoose find() query allows object-level injection ($regex, $where).',
          severity: 'critical',
          priority: 'critical',
          status: 'open',
          category: 'security',
          file: 'src/controllers/user.controller.ts',
          line: 42,
          codeSnippet: 'const users = await User.find(req.query).limit(20);',
          confidence: 99.1,
          detectedBy: 'ai',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: 'b3',
          projectId: 'p1',
          title: 'Missing Timing-Safe String Comparison in Password Reset Token Verifier',
          description: 'String comparison of password tokens using standard equality instead of constant-time comparison buffer.',
          severity: 'high',
          priority: 'high',
          status: 'confirmed',
          category: 'security',
          file: 'src/services/auth.service.ts',
          line: 204,
          codeSnippet: 'if (userToken === providedToken) { grantAccess(); }',
          confidence: 94.0,
          detectedBy: 'ai',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: 'b4',
          projectId: 'p1',
          title: 'Inefficient N+1 Database Query in Order History Population',
          description: 'Sub-queries executed iteratively inside Array.map instead of batch $in aggregation.',
          severity: 'medium',
          priority: 'medium',
          status: 'in_progress',
          category: 'performance',
          file: 'src/services/order.service.ts',
          line: 58,
          codeSnippet: 'const details = await Promise.all(orders.map(o => getDetails(o.id)));',
          confidence: 91.2,
          detectedBy: 'scan',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBugs();
  }, [severityFilter, statusFilter, search]);

  const filteredBugs = bugs.filter((b) => {
    if (severityFilter !== 'all' && b.severity !== severityFilter) return false;
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <BugIcon className="w-7 h-7 text-accent-rose" />
            <span>Bug & Vulnerability Management</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
              43 Active Issues
            </span>
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Track AI-detected vulnerabilities, test suite regression failures, and suggested patches.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-4 rounded-2xl">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search bugs by title, file, or stack trace..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full glass-input pl-10 pr-4 py-2 text-xs"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Severity filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="glass-input px-3 py-1.5 text-xs bg-bg-surface text-text-primary"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical (2)</option>
            <option value="high">High (7)</option>
            <option value="medium">Medium (19)</option>
            <option value="low">Low (15)</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="glass-input px-3 py-1.5 text-xs bg-bg-surface text-text-primary"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="confirmed">Confirmed</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Bugs List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card p-6 space-y-3">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          ))}
        </div>
      ) : filteredBugs.length === 0 ? (
        <EmptyState
          icon={<CheckCircle2 className="w-8 h-8 text-emerald-400" />}
          title="No matching bugs found"
          description="All clear! No issues meet the current severity and filter conditions."
        />
      ) : (
        <div className="space-y-4">
          {filteredBugs.map((bug) => {
            const sev = getSeverityColor(bug.severity);
            return (
              <GlassCard
                key={bug._id}
                className="p-5 cursor-pointer hover:border-border-glass-hover transition-all"
                onClick={() => navigate(`/bugs/${bug._id}`)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${sev.badge}`}
                      >
                        {bug.severity}
                      </span>
                      <Badge variant="neutral" size="sm">
                        {bug.category}
                      </Badge>
                      <span className="text-xs text-text-muted font-mono flex items-center gap-1">
                        <Code2 className="w-3.5 h-3.5" />
                        <span>{bug.file}:{bug.line}</span>
                      </span>
                      <span className="text-xs text-emerald-400 font-mono font-medium">
                        {bug.confidence}% AI confidence
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-text-primary hover:text-primary-light transition-colors">
                      {bug.title}
                    </h3>
                    <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                      {bug.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      rightIcon={<ArrowRight className="w-4 h-4 text-primary" />}
                    >
                      Diagnose & Fix
                    </Button>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
};
