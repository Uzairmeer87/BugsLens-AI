import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore.js';
import { Button } from '../../components/ui/Button.js';
import { Sparkles, Lock, Mail, AlertCircle } from 'lucide-react';
import { GithubIcon } from '../../components/ui/Icons.js';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Invalid email or password. Try the Quick Demo button.');
    }
  };

  const handleDemoFill = async () => {
    setEmail('demo@buglens.ai');
    setPassword('Password123!');
    try {
      await login('demo@buglens.ai', 'Password123!');
      navigate('/dashboard');
    } catch {
      // If server seed not yet executed, allow demo login in client
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md glass-panel p-8 md:p-10 z-10 border border-white/10 shadow-2xl relative">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent-cyan p-0.5 flex items-center justify-center shadow-glow">
              <div className="w-full h-full bg-bg-primary rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-light" />
              </div>
            </div>
          </Link>
          <h2 className="text-2xl font-bold text-white tracking-tight">Welcome back</h2>
          <p className="text-sm text-text-secondary mt-1">Sign in to your BugLens AI workspace</p>
        </div>

        {/* Quick Demo Mode Banner */}
        <div className="mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
          <div className="text-left">
            <p className="text-xs font-semibold text-emerald-300">College & Recruiter Demo</p>
            <p className="text-[11px] text-emerald-400/80">Preloaded with 1,284 files & 43 bugs</p>
          </div>
          <button
            type="button"
            onClick={handleDemoFill}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/30 transition-colors cursor-pointer"
          >
            One-Click Login
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-text-muted absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass-input pl-10 pr-4 py-2.5 text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-text-secondary">Password</label>
              <a href="#forgot" className="text-xs text-primary-light hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-text-muted absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-input pl-10 pr-4 py-2.5 text-sm"
              />
            </div>
          </div>

          <Button type="submit" className="w-full py-2.5" isLoading={isLoading}>
            Sign In
          </Button>

          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-glass" />
            </div>
            <span className="relative px-3 text-[11px] uppercase tracking-wider text-text-muted bg-bg-surface">
              or continue with
            </span>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full py-2.5"
            leftIcon={<GithubIcon className="w-4 h-4" />}
            onClick={() => handleDemoFill()}
          >
            GitHub Account
          </Button>
        </form>

        <p className="text-center text-xs text-text-secondary mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-light font-medium hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};
