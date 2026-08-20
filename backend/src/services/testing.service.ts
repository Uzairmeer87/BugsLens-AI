import { TestSuite, ITestSuite } from '../models/TestSuite.js';
import { TestCase, ITestCase } from '../models/TestCase.js';
import { TestRun, ITestRun } from '../models/TestRun.js';
import { Project } from '../models/Project.js';
import { Bug } from '../models/Bug.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { AppError } from '../utils/response.js';
import { Types } from 'mongoose';
import { io } from '../sockets/index.js';

export class TestingService {
  async listSuites(projectId: string): Promise<ITestSuite[]> {
    return TestSuite.find({ projectId: new Types.ObjectId(projectId) })
      .populate('tests')
      .sort({ createdAt: -1 })
      .lean();
  }

  async createSuite(userId: string, data: Partial<ITestSuite>): Promise<ITestSuite> {
    return TestSuite.create({
      ...data,
      createdBy: new Types.ObjectId(userId),
    });
  }

  async listTestCases(projectId: string, query: { suiteId?: string; type?: string; priority?: string }) {
    const filter: Record<string, unknown> = { projectId: new Types.ObjectId(projectId) };
    if (query.suiteId) filter.suiteId = new Types.ObjectId(query.suiteId);
    if (query.type && query.type !== 'all') filter.type = query.type;
    if (query.priority && query.priority !== 'all') filter.priority = query.priority;

    return TestCase.find(filter).sort({ createdAt: -1 }).lean();
  }

  async createTestCase(data: Partial<ITestCase>): Promise<ITestCase> {
    const test = await TestCase.create(data);
    if (data.suiteId) {
      await TestSuite.findByIdAndUpdate(data.suiteId, { $addToSet: { tests: test._id } });
    }
    await Project.findByIdAndUpdate(data.projectId, { $inc: { totalTests: 1 } });
    return test;
  }

  async createBulkTestCases(projectId: string, suiteId: string, tests: Partial<ITestCase>[]): Promise<ITestCase[]> {
    const docs = tests.map((t) => ({
      ...t,
      projectId: new Types.ObjectId(projectId),
      suiteId: suiteId ? new Types.ObjectId(suiteId) : undefined,
      generatedByAI: true,
      status: 'active',
    }));

    const created = await TestCase.insertMany(docs);
    if (suiteId) {
      const ids = created.map((c) => c._id);
      await TestSuite.findByIdAndUpdate(suiteId, { $addToSet: { tests: { $each: ids } } });
    }
    await Project.findByIdAndUpdate(projectId, { $inc: { totalTests: created.length } });
    return created as unknown as ITestCase[];
  }

  async listTestRuns(projectId: string, limit = 10): Promise<ITestRun[]> {
    return TestRun.find({ projectId: new Types.ObjectId(projectId) })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('suiteId', 'name type')
      .populate('triggeredBy', 'name email avatar')
      .lean();
  }

  async getTestRunById(runId: string): Promise<ITestRun> {
    const run = await TestRun.findById(runId)
      .populate('suiteId', 'name type')
      .populate('triggeredBy', 'name email avatar')
      .populate('results.testCaseId', 'title priority type');

    if (!run) {
      throw new AppError('NOT_FOUND', 'Test run not found', 404);
    }
    return run;
  }

  async triggerTestRun(userId: string, projectId: string, suiteId?: string): Promise<ITestRun> {
    const testCases = await TestCase.find({
      projectId: new Types.ObjectId(projectId),
      ...(suiteId ? { suiteId: new Types.ObjectId(suiteId) } : {}),
    });

    const run = await TestRun.create({
      projectId: new Types.ObjectId(projectId),
      suiteId: suiteId ? new Types.ObjectId(suiteId) : undefined,
      triggeredBy: new Types.ObjectId(userId),
      status: 'running',
      startedAt: new Date(),
      totalTests: Math.max(testCases.length, 12),
      passed: 0,
      failed: 0,
      skipped: 0,
      duration: 0,
      coverage: 87.4,
      environment: { browser: 'Chromium 124', os: 'Linux x86_64', nodeVersion: '22.11.0' },
      results: [],
    });

    io?.emit('test:started', { runId: run._id, projectId, totalTests: run.totalTests });

    // Asynchronously simulate execution steps with live WebSocket emissions
    this.executeTestRunSimulation(run._id.toString(), projectId, userId);

    return run;
  }

  private async executeTestRunSimulation(runId: string, projectId: string, userId: string) {
    const suites = ['Authentication Flow', 'REST API Contracts', 'Payment Gateways', 'Session Persistence', 'SQL Injection Guard'];
    const totalSteps = 6;
    let passed = 0;
    let failed = 0;

    for (let step = 1; step <= totalSteps; step++) {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const isFailure = step === 3;
      if (isFailure) {
        failed += 1;
      } else {
        passed += 2;
      }

      const progress = Math.round((step / totalSteps) * 100);
      io?.emit('test:progress', {
        runId,
        projectId,
        progress,
        step: suites[step - 1] || 'Finalizing',
        passed,
        failed,
      });
    }

    const completedRun = await TestRun.findByIdAndUpdate(
      runId,
      {
        $set: {
          status: failed > 0 ? 'failed' : 'completed',
          completedAt: new Date(),
          passed,
          failed,
          skipped: 1,
          totalTests: passed + failed + 1,
          duration: 4.82,
          coverage: 88.2,
        },
      },
      { new: true }
    );

    // If there is a failed test, auto-create or update Bug
    if (failed > 0) {
      await Bug.create({
        projectId: new Types.ObjectId(projectId),
        title: 'Payment Gateway Idempotency Failure on Network Timeout',
        description: 'Automated test lab detected duplicate payment charge execution when client re-sent payload after 3000ms delay.',
        severity: 'critical',
        priority: 'critical',
        status: 'open',
        category: 'bug',
        file: 'src/services/payment.service.ts',
        line: 84,
        codeSnippet: 'const payment = await stripe.charges.create({ amount, currency });',
        error: 'DuplicateTransactionError: Charge already processed for order #ORD-9821',
        stackTrace: 'Error: DuplicateTransactionError\n    at PaymentService.charge (src/services/payment.service.ts:84:12)\n    at Context.<anonymous> (test/payment.spec.ts:42:7)',
        stepsToReproduce: ['1. Send POST /api/v1/checkout with payload', '2. Inject artificial 3.5s latency', '3. Retry identical request', '4. Observe duplicate order charge'],
        rootCause: 'Missing atomic Redis idempotency lock in payment processing pipeline.',
        suggestedFix: 'Wrap payment processing in a Redis distributed lock (Redlock) keyed by req.headers["idempotency-key"].',
        confidence: 96.0,
        detectedBy: 'test',
        testRunId: completedRun?._id,
      });

      io?.emit('bug:detected', {
        projectId,
        title: 'Payment Gateway Idempotency Failure on Network Timeout',
        severity: 'critical',
      });
    }

    await ActivityLog.create({
      userId: new Types.ObjectId(userId),
      projectId: new Types.ObjectId(projectId),
      action: 'TEST_RUN_COMPLETED',
      description: `Test Run #${runId.slice(-6)} completed with ${passed} passed, ${failed} failed.`,
      metadata: { runId, passed, failed },
    });

    io?.emit('test:completed', {
      runId,
      projectId,
      status: failed > 0 ? 'failed' : 'completed',
      passed,
      failed,
      duration: 4.82,
    });
  }
}

export const testingService = new TestingService();
