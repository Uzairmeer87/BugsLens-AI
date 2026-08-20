import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button.js';
import { Sparkles, Shield, Cpu, Terminal, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils.js';

export const GlassNavbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
        scrolled
          ? 'bg-bg-primary/80 backdrop-blur-glass border-b border-border-glass py-3.5 shadow-glass'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-accent-cyan p-0.5 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-bg-primary rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-light" />
            </div>
          </div>
          <span className="text-lg font-bold tracking-tight text-white font-mono flex items-center gap-1.5">
            ◈ BugLens <span className="text-primary-light text-xs font-semibold px-1.5 py-0.5 rounded bg-primary/20 border border-primary/40">AI</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
          <a href="#features" className="hover:text-text-primary transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-text-primary transition-colors">How It Works</a>
          <a href="#demo" className="hover:text-text-primary transition-colors">Live Lab</a>
          <a href="#security" className="hover:text-text-primary transition-colors">Security</a>
        </nav>

        {/* Auth CTAs */}
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Start Testing
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
