import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { aiApi } from '../../services/api.js';
import { useUIStore } from '../../store/useUIStore.js';
import { Button } from '../../components/ui/Button.js';
import { Badge } from '../../components/ui/Badge.js';
import {
  Folder,
  FileCode,
  Sparkles,
  Play,
  Copy,
  Check,
  Search,
  ShieldAlert,
  Terminal,
  Zap,
  Code2,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '../../lib/utils.js';

interface FileNode {
  name: string;
  path: string;
  isFolder: boolean;
  children?: FileNode[];
  content?: string;
  language?: string;
}

export const CodeAnalysisPage: React.FC = () => {
  const { setAIAssistantOpen } = useUIStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchFile, setSearchFile] = useState('');

  // Sample files within the E-Commerce API demo repository
  const fileTree: FileNode[] = [
    {
      name: 'src',
      path: 'src',
      isFolder: true,
      children: [
        {
          name: 'controllers',
          path: 'src/controllers',
          isFolder: true,
          children: [
            {
              name: 'user.controller.ts',
              path: 'src/controllers/user.controller.ts',
              isFolder: false,
              language: 'typescript',
              content: `import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User.js';

export class UserController {
  /**
   * Potential NoSQL Injection Vulnerability detected at Line 14:
   * req.query is directly interpolated into Mongoose query without schema validation
   */
  async searchUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const rawFilter = req.query; // ❌ Unsanitized query input
      const users = await User.find(rawFilter).limit(20).lean();
      res.json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response) {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'NOT_FOUND' });
    res.json({ success: true, data: user });
  }
}`,
            },
            {
              name: 'payment.controller.ts',
              path: 'src/controllers/payment.controller.ts',
              isFolder: false,
              language: 'typescript',
              content: `import { Request, Response } from 'express';
import { stripe } from '../integrations/stripe.js';

export async function processCharge(req: Request, res: Response) {
  const { amount, currency, customer } = req.body;
  // ❌ Missing idempotency key check allows duplicate charges
  const charge = await stripe.charges.create({
    amount,
    currency,
    customer,
  });
  return res.json({ success: true, chargeId: charge.id });
}`,
            },
          ],
        },
        {
          name: 'middleware',
          path: 'src/middleware',
          isFolder: true,
          children: [
            {
              name: 'auth.ts',
              path: 'src/middleware/auth.ts',
              isFolder: false,
              language: 'typescript',
              content: `import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export function verifyAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'UNAUTHORIZED' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'INVALID_TOKEN' });
  }
}`,
            },
          ],
        },
      ],
    },
  ];

  const [activeFile, setActiveFile] = useState<FileNode>(
    fileTree[0].children![0].children![0]
  );

  const [aiAnalysis, setAiAnalysis] = useState<{
    qualityScore: number;
    issueTitle: string;
    severity: string;
    line: number;
    confidence: number;
    description: string;
    suggestedFix: string;
  }>({
    qualityScore: 89,
    issueTitle: 'Potential NoSQL Query Injection (CWE-943)',
    severity: 'CRITICAL',
    line: 14,
    confidence: 97.4,
    description:
      'User input from req.query is directly interpolated into Mongoose find() query without sanitization. Callers can supply malicious MongoDB operators (e.g. $ne, $where).',
    suggestedFix: `// Fixed: enforce strict Zod schema validation
const querySchema = z.object({
  search: z.string().trim().max(50).optional(),
});
const { search } = querySchema.parse(req.query);
const filter = search ? { name: new RegExp(search, 'i') } : {};
const users = await User.find(filter).limit(20).lean();`,
  });

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const data = await aiApi.analyzeCode({
        filePath: activeFile.path,
        content: activeFile.content || '',
        language: activeFile.language,
      });

      const issue = data.issues?.[0];
      if (issue) {
        setAiAnalysis({
          qualityScore: data.quality_score,
          issueTitle: issue.title,
          severity: issue.severity.toUpperCase(),
          line: issue.line,
          confidence: issue.confidence,
          description: issue.description,
          suggestedFix: issue.suggested_fix || '',
        });
      }
    } catch {
      // Keep state
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = () => {
    if (activeFile.content) {
      navigator.clipboard.writeText(activeFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Code2 className="w-6 h-6 text-primary" />
            <span>Code Explorer & AI Analysis</span>
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Monaco IDE editor with live neural bug detection and AST scanning.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Sparkles className="w-3.5 h-3.5 text-primary-light" />}
            onClick={() => setAIAssistantOpen(true)}
          >
            Ask TestAI
          </Button>
          <Button
            variant="primary"
            size="sm"
            isLoading={isAnalyzing}
            leftIcon={<Play className="w-3.5 h-3.5" />}
            onClick={handleRunAnalysis}
          >
            Deep AI File Scan
          </Button>
        </div>
      </div>

      {/* Main IDE Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[650px]">
        {/* Left: File Tree (3 cols) */}
        <div className="lg:col-span-3 glass-panel p-4 flex flex-col justify-between overflow-hidden rounded-2xl">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border-glass mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-primary" />
                Files (1,284)
              </span>
              <span className="text-[10px] font-mono text-emerald-400">Indexed</span>
            </div>

            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Filter files..."
                value={searchFile}
                onChange={(e) => setSearchFile(e.target.value)}
                className="w-full glass-input pl-8 pr-3 py-1.5 text-xs"
              />
            </div>

            {/* Tree Nodes */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-1.5 text-text-secondary py-1 px-2 font-medium">
                <ChevronDown className="w-3.5 h-3.5" />
                <span>src / controllers</span>
              </div>
              <div className="pl-4 space-y-0.5">
                {fileTree[0].children![0].children!.map((f) => (
                  <button
                    key={f.path}
                    onClick={() => setActiveFile(f)}
                    className={cn(
                      'w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer',
                      activeFile.path === f.path
                        ? 'bg-primary/20 text-primary-light font-medium border border-primary/30'
                        : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                    )}
                  >
                    <FileCode className="w-3.5 h-3.5 text-primary-light flex-shrink-0" />
                    <span className="truncate">{f.name}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5 text-text-secondary py-1 px-2 font-medium mt-2">
                <ChevronDown className="w-3.5 h-3.5" />
                <span>src / middleware</span>
              </div>
              <div className="pl-4 space-y-0.5">
                {fileTree[0].children![1].children!.map((f) => (
                  <button
                    key={f.path}
                    onClick={() => setActiveFile(f)}
                    className={cn(
                      'w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer',
                      activeFile.path === f.path
                        ? 'bg-primary/20 text-primary-light font-medium border border-primary/30'
                        : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                    )}
                  >
                    <FileCode className="w-3.5 h-3.5 text-primary-light flex-shrink-0" />
                    <span className="truncate">{f.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-border-glass text-[11px] text-text-muted">
            <p>Repository: <span className="text-text-primary font-mono font-semibold">ecommerce-api</span></p>
            <p>Branch: <span className="text-text-primary font-mono">main (synced)</span></p>
          </div>
        </div>

        {/* Center: Monaco Editor (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-3 flex flex-col justify-between overflow-hidden rounded-2xl">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-border-glass px-2">
            <span className="text-xs font-mono text-primary-light font-semibold flex items-center gap-1.5 truncate">
              <Code2 className="w-3.5 h-3.5" />
              {activeFile.path}
            </span>
            <button
              onClick={handleCopy}
              className="text-xs text-text-muted hover:text-text-primary p-1.5 rounded-lg hover:bg-white/5 flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="flex-1 rounded-xl overflow-hidden border border-white/5 bg-[#12121c]">
            <Editor
              height="100%"
              language={activeFile.language || 'typescript'}
              theme="vs-dark"
              value={activeFile.content}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 12,
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                renderLineHighlight: 'all',
              }}
            />
          </div>
        </div>

        {/* Right: AI Analysis Panel (4 cols) */}
        <div className="lg:col-span-4 glass-panel p-5 flex flex-col justify-between overflow-y-auto rounded-2xl space-y-4">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border-glass">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <h4 className="text-sm font-bold text-text-primary">AI Heuristic Finding</h4>
              </div>
              <Badge variant="danger" dot size="sm">
                {aiAnalysis.severity}
              </Badge>
            </div>

            {/* Finding Card */}
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-xs font-semibold text-text-primary">{aiAnalysis.issueTitle}</p>
                <p className="text-[11px] text-text-muted font-mono mt-0.5">
                  Line {aiAnalysis.line} • Confidence {aiAnalysis.confidence}%
                </p>
              </div>

              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200 leading-relaxed">
                {aiAnalysis.description}
              </div>

              <div>
                <p className="text-xs font-semibold text-text-primary mb-1">Suggested Fix:</p>
                <pre className="p-3 rounded-xl bg-black/40 border border-border-glass text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed whitespace-pre-wrap">
                  {aiAnalysis.suggestedFix}
                </pre>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-border-glass">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              leftIcon={<Sparkles className="w-3.5 h-3.5 text-primary" />}
              onClick={() => setAIAssistantOpen(true)}
            >
              Ask AI to Explain Vulnerability
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
