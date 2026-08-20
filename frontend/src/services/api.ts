import { api } from '../lib/axios.js';
import { Project, Bug, TestCase, TestSuite, TestRun, Scan, NotificationItem, ActivityItem } from '../types/index.js';

export const projectsApi = {
  list: (params?: { search?: string; status?: string; page?: number; limit?: number }) =>
    api.get('/projects', { params }).then((res) => res.data),

  getById: (id: string) =>
    api.get<{ success: boolean; data: { project: Project } }>(`/projects/${id}`).then((res) => res.data.data.project),

  getStats: (id: string) =>
    api.get(`/projects/${id}/stats`).then((res) => res.data.data),

  create: (data: Partial<Project>) =>
    api.post<{ success: boolean; data: { project: Project } }>('/projects', data).then((res) => res.data.data.project),

  update: (id: string, data: Partial<Project>) =>
    api.put<{ success: boolean; data: { project: Project } }>(`/projects/${id}`, data).then((res) => res.data.data.project),

  delete: (id: string) =>
    api.delete(`/projects/${id}`).then((res) => res.data),
};

export const bugsApi = {
  list: (params?: { projectId?: string; severity?: string; priority?: string; status?: string; category?: string; search?: string; page?: number; limit?: number }) =>
    api.get('/bugs', { params }).then((res) => res.data),

  getById: (id: string) =>
    api.get<{ success: boolean; data: { bug: Bug } }>(`/bugs/${id}`).then((res) => res.data.data.bug),

  create: (data: Partial<Bug>) =>
    api.post<{ success: boolean; data: { bug: Bug } }>('/bugs', data).then((res) => res.data.data.bug),

  update: (id: string, data: Partial<Bug>) =>
    api.patch<{ success: boolean; data: { bug: Bug } }>(`/bugs/${id}`, data).then((res) => res.data.data.bug),

  getAnalytics: (projectId: string) =>
    api.get(`/bugs/analytics/${projectId}`).then((res) => res.data.data),
};

export const testingApi = {
  listSuites: (projectId: string) =>
    api.get<{ success: boolean; data: { suites: TestSuite[] } }>(`/testing/projects/${projectId}/suites`).then((res) => res.data.data.suites),

  createSuite: (projectId: string, data: Partial<TestSuite>) =>
    api.post<{ success: boolean; data: { suite: TestSuite } }>(`/testing/projects/${projectId}/suites`, data).then((res) => res.data.data.suite),

  listCases: (projectId: string, params?: { suiteId?: string; type?: string; priority?: string }) =>
    api.get<{ success: boolean; data: { tests: TestCase[] } }>(`/testing/projects/${projectId}/cases`, { params }).then((res) => res.data.data.tests),

  createCase: (projectId: string, data: Partial<TestCase>) =>
    api.post<{ success: boolean; data: { test: TestCase } }>(`/testing/projects/${projectId}/cases`, data).then((res) => res.data.data.test),

  createBulkCases: (projectId: string, suiteId: string, tests: Partial<TestCase>[]) =>
    api.post(`/testing/projects/${projectId}/cases/bulk`, { suiteId, tests }).then((res) => res.data.data),

  listRuns: (projectId: string) =>
    api.get<{ success: boolean; data: { runs: TestRun[] } }>(`/testing/projects/${projectId}/runs`).then((res) => res.data.data.runs),

  getRunById: (runId: string) =>
    api.get<{ success: boolean; data: { run: TestRun } }>(`/testing/runs/${runId}`).then((res) => res.data.data.run),

  triggerRun: (projectId: string, suiteId?: string) =>
    api.post<{ success: boolean; data: { run: TestRun } }>(`/testing/projects/${projectId}/runs`, { suiteId }).then((res) => res.data.data.run),
};

export const scansApi = {
  list: (projectId: string) =>
    api.get<{ success: boolean; data: { scans: Scan[] } }>(`/scans/projects/${projectId}/scans`).then((res) => res.data.data.scans),

  trigger: (projectId: string, type: string = 'full') =>
    api.post<{ success: boolean; data: { scan: Scan } }>(`/scans/projects/${projectId}/scans`, { type }).then((res) => res.data.data.scan),

  getById: (id: string) =>
    api.get<{ success: boolean; data: { scan: Scan } }>(`/scans/scans/${id}`).then((res) => res.data.data.scan),
};

export const aiApi = {
  analyzeCode: (data: { projectId?: string; filePath: string; content: string; language?: string }) =>
    api.post('/ai/analyze', data).then((res) => res.data.data),

  generateTests: (data: { projectId?: string; functionName?: string; filePath?: string; codeSnippet?: string; featureDescription?: string; testTypes?: string[] }) =>
    api.post('/ai/generate-tests', data).then((res) => res.data.data),

  rootCause: (data: { bugId?: string; title: string; error: string; stackTrace?: string; file?: string; line?: number; codeSnippet?: string }) =>
    api.post('/ai/root-cause', data).then((res) => res.data.data),

  generateFix: (data: { filePath: string; codeSnippet: string; issueDescription: string; severity?: string }) =>
    api.post('/ai/generate-fix', data).then((res) => res.data.data),

  chat: (data: { projectId?: string; question: string; context?: Record<string, unknown> }) =>
    api.post('/ai/chat', data).then((res) => res.data.data),
};

export const reportsApi = {
  generate: (projectId: string) =>
    api.post(`/reports/projects/${projectId}/generate`).then((res) => res.data.data.report),

  getLatest: (projectId: string) =>
    api.get(`/reports/projects/${projectId}/latest`).then((res) => res.data.data.report),
};

export const activityApi = {
  listUser: () =>
    api.get<{ success: boolean; data: { activities: ActivityItem[] } }>('/activity').then((res) => res.data.data.activities),

  listProject: (projectId: string) =>
    api.get<{ success: boolean; data: { activities: ActivityItem[] } }>(`/activity/projects/${projectId}`).then((res) => res.data.data.activities),
};

export const notificationsApi = {
  list: () =>
    api.get<{ success: boolean; data: { notifications: NotificationItem[]; unreadCount: number } }>('/notifications').then((res) => res.data.data),

  markAsRead: (id: string) =>
    api.patch(`/notifications/${id}/read`).then((res) => res.data),

  markAllAsRead: () =>
    api.patch('/notifications/mark-all-read').then((res) => res.data),
};

export const searchApi = {
  globalSearch: (q: string) =>
    api.get('/search', { params: { q } }).then((res) => res.data.data),
};
