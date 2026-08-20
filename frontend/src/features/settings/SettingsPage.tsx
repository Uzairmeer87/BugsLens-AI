import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore.js';
import { Button } from '../../components/ui/Button.js';
import { Settings, User, Bell, Shield, Lock, Check } from 'lucide-react';
import { GithubIcon } from '../../components/ui/Icons.js';
import { cn } from '../../lib/utils.js';

export const SettingsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [tab, setTab] = useState<'account' | 'notifications' | 'integrations' | 'security'>('account');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'account', label: 'Account Profile', icon: User },
    { id: 'notifications', label: 'Alert Preferences', icon: Bell },
    { id: 'integrations', label: 'GitHub & CI/CD', icon: GithubIcon },
    { id: 'security', label: 'Security & Auth', icon: Shield },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-primary-light" />
          <span>Platform Settings</span>
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Configure personal preferences, notification thresholds, and security policies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Settings Navigation Tabs */}
        <div className="md:col-span-4 space-y-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id as any)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium transition-all cursor-pointer',
                  tab === t.id
                    ? 'bg-primary/20 text-primary-light border border-primary/30 shadow-glow font-semibold'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Settings Tab Content */}
        <div className="md:col-span-8 glass-panel p-6 md:p-8 rounded-2xl border border-white/10">
          {tab === 'account' && (
            <form onSubmit={handleSave} className="space-y-4">
              <h3 className="text-base font-bold text-white mb-4">Account Profile</h3>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">Full Name</label>
                <input
                  type="text"
                  defaultValue={user?.name || 'Alex Mercer'}
                  className="w-full glass-input px-3.5 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">Email Address</label>
                <input
                  type="email"
                  disabled
                  defaultValue={user?.email || 'demo@buglens.ai'}
                  className="w-full glass-input px-3.5 py-2 text-sm opacity-60 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">Role</label>
                <input
                  type="text"
                  disabled
                  defaultValue={user?.role?.toUpperCase() || 'ADMINISTRATOR'}
                  className="w-full glass-input px-3.5 py-2 text-sm font-mono text-xs opacity-60 cursor-not-allowed"
                />
              </div>

              <div className="pt-4 border-t border-border-glass">
                <Button type="submit" variant="primary" leftIcon={saved ? <Check className="w-4 h-4" /> : undefined}>
                  {saved ? 'Saved Changes' : 'Save Profile'}
                </Button>
              </div>
            </form>
          )}

          {tab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-white">Alert Preferences</h3>
              <div className="space-y-4 text-xs">
                {[
                  { label: 'Critical Vulnerability Alerts', desc: 'Instant notification when an injection or auth bug is detected.' },
                  { label: 'Automated Test Run Completion', desc: 'Receive summary when Playwright/Vitest workers finish.' },
                  { label: 'Executive Report Synthesis', desc: 'Weekly code health and coverage digests.' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-border-glass">
                    <div>
                      <p className="font-semibold text-text-primary">{item.label}</p>
                      <p className="text-text-secondary mt-0.5">{item.desc}</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary cursor-pointer" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'integrations' && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-white">Connected Integrations</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl glass-card border border-border-glass flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/5 text-white">
                      <GithubIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">GitHub Workspace</p>
                      <p className="text-xs text-emerald-400 font-mono">Connected as @buglens-demo</p>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-semibold">
                    Active
                  </span>
                </div>
              </div>
            </div>
          )}

          {tab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-white">Security & Access Policies</h3>
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-border-glass flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-text-primary">Two-Factor Authentication (2FA)</p>
                    <p className="text-text-secondary mt-0.5">TOTP Authenticator app enforcement across organization.</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-border-glass flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-text-primary">Active JWT Session Revocation</p>
                    <p className="text-text-secondary mt-0.5">Invalidate all active refresh tokens across devices.</p>
                  </div>
                  <Button variant="danger" size="sm">
                    Revoke Sessions
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
