import React from 'react';
import { GlassCard } from '../../components/glass/GlassCard.js';
import { Activity, Clock, Sparkles, FlaskConical, Bug, FileText, CheckCircle2 } from 'lucide-react';
import { formatTimeAgo } from '../../lib/utils.js';

export const ActivityPage: React.FC = () => {
  const activities = [
    {
      id: 'a1',
      title: 'Full Repository Scan Completed',
      desc: 'Indexed 1,284 files (84,293 LOC). Overall quality score assessed at 94/100.',
      icon: <Sparkles className="w-4 h-4 text-primary-light" />,
      time: new Date(Date.now() - 600000).toISOString(),
    },
    {
      id: 'a2',
      title: 'Automated Test Lab Run #TR-849 Executed',
      desc: '1,205 test cases passed, 43 failed across 6 test suites.',
      icon: <FlaskConical className="w-4 h-4 text-cyan-400" />,
      time: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'a3',
      title: 'Critical Bug #1024 Logged by AI',
      desc: 'Payment Gateway Idempotency Race Condition detected in payment.service.ts.',
      icon: <Bug className="w-4 h-4 text-rose-400" />,
      time: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 'a4',
      title: 'Executive Testing Report Generated',
      desc: 'Report #REP-9021 synthesized with complete security and coverage recommendations.',
      icon: <FileText className="w-4 h-4 text-emerald-400" />,
      time: new Date(Date.now() - 14400000).toISOString(),
    },
    {
      id: 'a5',
      title: 'Test Coverage Increased to 87.4%',
      desc: 'Generated 4 boundary test cases for auth identity controller.',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      time: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <Activity className="w-7 h-7 text-primary-light" />
          <span>Audit & Activity Trail</span>
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Chronological timeline of automated scans, test suite executions, and AI findings.
        </p>
      </div>

      <div className="glass-card p-6 md:p-8 space-y-6">
        <div className="relative border-l border-border-glass pl-6 space-y-8 ml-2">
          {activities.map((act) => (
            <div key={act.id} className="relative group">
              {/* Timeline marker */}
              <div className="absolute -left-[35px] top-1 w-6 h-6 rounded-full bg-bg-surface border border-border-glass flex items-center justify-center shadow-glow">
                {act.icon}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-text-primary group-hover:text-primary-light transition-colors">
                    {act.title}
                  </h4>
                  <span className="text-[11px] text-text-muted flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimeAgo(act.time)}</span>
                  </span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed max-w-2xl">{act.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
