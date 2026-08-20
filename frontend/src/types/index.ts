export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'developer' | 'admin';
  githubId?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  owner: string;
  repositoryUrl: string;
  repositoryName: string;
  defaultBranch: string;
  languages: string[];
  framework: string;
  projectType: string;
  status: 'active' | 'analyzing' | 'archived' | 'error';
  codeQualityScore: number;
  testCoverage: number;
  totalFiles: number;
  totalLines: number;
  totalBugs: number;
  totalTests: number;
  lastScanAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Bug {
  _id: string;
  projectId: string | { _id: string; name: string; repositoryName: string };
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'confirmed' | 'in_progress' | 'resolved' | 'reopened' | 'closed';
  category: 'bug' | 'security' | 'performance' | 'code_smell' | 'vulnerability';
  file: string;
  line: number;
  codeSnippet: string;
  error?: string;
  stackTrace?: string;
  stepsToReproduce?: string[];
  rootCause?: string;
  suggestedFix?: string;
  confidence: number;
  detectedBy: 'ai' | 'test' | 'manual' | 'scan';
  testRunId?: string;
  assignedTo?: User;
  createdAt: string;
  updatedAt: string;
}

export interface TestSuite {
  _id: string;
  projectId: string;
  name: string;
  description: string;
  type: 'functional' | 'api' | 'ui' | 'security' | 'performance';
  tests: TestCase[] | string[];
  createdBy: User | string;
  status: 'active' | 'running' | 'completed' | 'failed';
  lastRunAt?: string;
  createdAt: string;
}

export interface TestCase {
  _id: string;
  projectId: string;
  suiteId?: string;
  title: string;
  description: string;
  preconditions: string;
  steps: string[];
  expectedResult: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  type: 'functional' | 'boundary' | 'negative' | 'security' | 'performance' | 'api' | 'ui';
  generatedByAI: boolean;
  status: 'active' | 'passed' | 'failed' | 'skipped' | 'blocked';
  createdAt: string;
}

export interface TestRun {
  _id: string;
  projectId: string;
  suiteId?: { _id: string; name: string; type: string };
  triggeredBy: User;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt: string;
  completedAt?: string;
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  coverage: number;
  environment: {
    browser: string;
    os: string;
    nodeVersion: string;
  };
  results: Array<{
    testCaseId: TestCase | string;
    status: 'passed' | 'failed' | 'skipped';
    duration: number;
    error: string;
    stackTrace: string;
  }>;
  createdAt: string;
}

export interface Scan {
  _id: string;
  projectId: string;
  type: 'full' | 'quick' | 'security' | 'quality';
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  filesScanned: number;
  linesAnalyzed: number;
  issuesFound: number;
  securityIssues: number;
  codeSmells: number;
  performanceIssues: number;
  qualityScore: number;
  startedAt: string;
  completedAt?: string;
}

export interface NotificationItem {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  icon: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface ActivityItem {
  _id: string;
  userId: User;
  projectId?: { _id: string; name: string; repositoryName: string };
  action: string;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}
