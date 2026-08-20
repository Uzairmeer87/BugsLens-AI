import mongoose from 'mongoose';
import argon2 from 'argon2';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { Project } from '../models/Project.js';
import { TestSuite } from '../models/TestSuite.js';
import { TestCase } from '../models/TestCase.js';
import { TestRun } from '../models/TestRun.js';
import { Bug } from '../models/Bug.js';
import { Scan } from '../models/Scan.js';
import { Notification } from '../models/Notification.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { logger } from '../utils/logger.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/buglens';

export async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info('Connected to MongoDB for seeding...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Project.deleteMany({}),
      TestSuite.deleteMany({}),
      TestCase.deleteMany({}),
      TestRun.deleteMany({}),
      Bug.deleteMany({}),
      Scan.deleteMany({}),
      Notification.deleteMany({}),
      ActivityLog.deleteMany({}),
    ]);

    // 1. Create Default Users
    const passwordHash = await argon2.hash('Password123!');
    const demoUser = await User.create({
      name: 'Alex Mercer',
      email: 'demo@buglens.ai',
      passwordHash,
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      isActive: true,
      lastLogin: new Date(),
    });

    const devUser = await User.create({
      name: 'Sarah Jenkins',
      email: 'sarah@buglens.ai',
      passwordHash,
      role: 'developer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      isActive: true,
      lastLogin: new Date(),
    });

    logger.info('✅ Created demo users (demo@buglens.ai / Password123!)');

    // 2. Create Demo Project: E-Commerce API
    const project = await Project.create({
      name: 'E-Commerce API',
      description: 'High-throughput microservices architecture with distributed checkout, inventory management, and Stripe integration.',
      owner: demoUser._id,
      repositoryUrl: 'https://github.com/buglens-ai/ecommerce-api',
      repositoryName: 'buglens-ai/ecommerce-api',
      defaultBranch: 'main',
      languages: ['TypeScript', 'Node.js', 'Python', 'Docker'],
      framework: 'Express + Fastify',
      projectType: 'api',
      status: 'active',
      codeQualityScore: 94,
      testCoverage: 87.4,
      totalFiles: 1284,
      totalLines: 84293,
      totalBugs: 43,
      totalTests: 1248,
      lastScanAt: new Date(),
    });

    logger.info('✅ Created demo project: E-Commerce API');

    // 3. Create Test Suites
    const suiteAuth = await TestSuite.create({
      projectId: project._id,
      name: 'Authentication & Session Security',
      description: 'JWT token rotation, rate limiting, and password hashing security verification.',
      type: 'security',
      createdBy: demoUser._id,
      status: 'completed',
      lastRunAt: new Date(),
    });

    const suitePayment = await TestSuite.create({
      projectId: project._id,
      name: 'Payment & Checkout Transactions',
      description: 'Idempotent card tokenization, Stripe webhook verification, and settlement ledger tests.',
      type: 'api',
      createdBy: demoUser._id,
      status: 'completed',
      lastRunAt: new Date(),
    });

    const suiteInventory = await TestSuite.create({
      projectId: project._id,
      name: 'Inventory Concurrency & Locking',
      description: 'Pessimistic lock testing under high load and stock reservation lifecycles.',
      type: 'functional',
      createdBy: demoUser._id,
      status: 'completed',
      lastRunAt: new Date(),
    });

    // 4. Create Test Cases
    const testCasesData = [
      {
        projectId: project._id,
        suiteId: suiteAuth._id,
        title: 'Verify JWT expiration enforces 401 Unauthorized status on protected endpoints',
        description: 'Test that access tokens past expiration date are immediately rejected without reaching business logic.',
        priority: 'critical',
        type: 'security',
        preconditions: 'Generate token with exp timestamp 1 hour in the past.',
        steps: ['1. Send GET /api/v1/user/profile with expired Bearer token', '2. Inspect HTTP status code', '3. Verify error body format'],
        expectedResult: 'HTTP 401 with { "code": "TOKEN_EXPIRED" } error payload.',
        generatedByAI: true,
        status: 'passed',
      },
      {
        projectId: project._id,
        suiteId: suitePayment._id,
        title: 'Validate idempotency key eliminates duplicate credit card charges on network timeout retry',
        description: 'Simulate packet drop after Stripe charge and verify subsequent identical request returns original transaction ID without double debit.',
        priority: 'critical',
        type: 'api',
        preconditions: 'Stripe mock server configured with 2500ms response delay.',
        steps: ['1. POST /api/v1/checkout with Idempotency-Key header', '2. Interrupt connection', '3. Retry identical POST request within 10s', '4. Inspect payment ledger'],
        expectedResult: 'Single transaction processed; identical transaction ID returned on second request.',
        generatedByAI: true,
        status: 'failed',
      },
      {
        projectId: project._id,
        suiteId: suiteInventory._id,
        title: 'Assert concurrent inventory decrement handles 100 simultaneous checkouts without stock underflow',
        description: 'Run 100 parallel requests against an SKU with only 10 available units.',
        priority: 'high',
        type: 'boundary',
        preconditions: 'SKU #SKU-990 initialized with quantity: 10.',
        steps: ['1. Dispatch 100 concurrent POST /api/v1/cart/reserve requests', '2. Await all promises', '3. Count successful 200 responses', '4. Query remaining SKU stock'],
        expectedResult: 'Exactly 10 requests succeed (200), 90 fail with 409 Conflict (OUT_OF_STOCK). Remaining stock is 0.',
        generatedByAI: false,
        status: 'passed',
      },
      {
        projectId: project._id,
        suiteId: suiteAuth._id,
        title: 'Ensure SQL/NoSQL injection payloads in email field are safely escaped during login lookup',
        description: 'Test malicious MongoDB query operators ($gt, $ne, $regex) in req.body.email.',
        priority: 'critical',
        type: 'security',
        preconditions: 'Express server listening.',
        steps: ['1. POST /api/v1/auth/login with { "email": { "$ne": null }, "password": "x" }', '2. Inspect response'],
        expectedResult: 'Rejected with 400 Bad Request (Invalid email string type).',
        generatedByAI: true,
        status: 'passed',
      },
    ];

    const createdCases = await TestCase.insertMany(testCasesData);
    await TestSuite.findByIdAndUpdate(suiteAuth._id, { $set: { tests: [createdCases[0]._id, createdCases[3]._id] } });
    await TestSuite.findByIdAndUpdate(suitePayment._id, { $set: { tests: [createdCases[1]._id] } });
    await TestSuite.findByIdAndUpdate(suiteInventory._id, { $set: { tests: [createdCases[2]._id] } });

    // 5. Create 43 Bugs (2 Critical, 7 High, 19 Medium, 15 Low)
    const bugsList: Partial<typeof Bug.prototype>[] = [];

    // Critical (2)
    bugsList.push(
      {
        projectId: project._id,
        title: 'Payment Gateway Idempotency Race Condition in Distributed Settlement',
        description: 'Concurrent requests with identical idempotency headers execute parallel database transactions if received within the 5ms window before Redis lock acquisition.',
        severity: 'critical',
        priority: 'critical',
        status: 'open',
        category: 'bug',
        file: 'src/services/payment.service.ts',
        line: 84,
        codeSnippet: 'const payment = await stripe.charges.create({ amount, currency, customer });\nawait Order.create({ orderId, status: "PAID" });',
        error: 'DuplicateTransactionError: Charge already processed for order #ORD-9821',
        stackTrace: 'Error: DuplicateTransactionError\n    at PaymentService.charge (src/services/payment.service.ts:84:12)\n    at Context.<anonymous> (test/payment.spec.ts:42:7)',
        stepsToReproduce: ['1. Send simultaneous POST /api/checkout calls', '2. Inspect Stripe dashboard', '3. Observe multiple charges'],
        rootCause: 'Lack of atomic distributed locking mechanism prior to third-party charge invocation.',
        suggestedFix: 'Acquire Redlock distributed mutex with 10s TTL keyed on idempotencyToken before initiating payment.',
        confidence: 97.4,
        detectedBy: 'test',
        assignedTo: devUser._id,
      },
      {
        projectId: project._id,
        title: 'Unvalidated Query Operator Injection in User Search Filter',
        description: 'Raw query object passed directly into Mongoose find() query allows object-level injection ($regex, $where).',
        severity: 'critical',
        priority: 'critical',
        status: 'open',
        category: 'security',
        file: 'src/controllers/user.controller.ts',
        line: 42,
        codeSnippet: 'const users = await User.find(req.query).limit(20);',
        error: 'Security Vulnerability: NoSQL Query Injection (CWE-943)',
        stackTrace: 'SecurityAuditException at ASTAnalyzer (line 42)',
        stepsToReproduce: ['1. Send GET /api/users?email[$regex]=.*', '2. System executes unindexed full collection regex scan'],
        rootCause: 'Directly passing unvalidated req.query to database query engine.',
        suggestedFix: 'Define explicit Zod query schema filter: const { search } = querySchema.parse(req.query);',
        confidence: 99.1,
        detectedBy: 'ai',
        assignedTo: demoUser._id,
      }
    );

    // High (7)
    const highTitles = [
      ['Uncaught Rejection in Webhook Worker on Disconnected Redis Socket', 'src/workers/webhook.worker.ts', 118],
      ['Missing Timing-Safe String Comparison in Password Reset Token Verifier', 'src/services/auth.service.ts', 204],
      ['Memory Leak in Unbounded WebSocket Event Emitter Listener Buffer', 'src/sockets/stream.ts', 67],
      ['Stripe Webhook Signature Verification Bypass on Malformed Raw Body', 'src/middleware/stripeWebhook.ts', 31],
      ['Deadlock in PostgreSQL Inventory Ledger on Circular Batch Updates', 'src/repositories/inventory.repo.ts', 152],
      ['Missing Rate Limiter on SMS Two-Factor Code Dispatch Endpoint', 'src/routes/auth.routes.ts', 89],
      ['Unchecked Buffer Allocation in Multipart File Upload Stream', 'src/middleware/upload.ts', 55],
    ];

    highTitles.forEach(([title, file, line], idx) => {
      bugsList.push({
        projectId: project._id,
        title: title as string,
        description: `Automated testing and AST analysis detected high-severity reliability and security risk in ${file}.`,
        severity: 'high',
        priority: 'high',
        status: idx % 2 === 0 ? 'open' : 'confirmed',
        category: idx % 3 === 0 ? 'security' : 'bug',
        file: file as string,
        line: line as number,
        codeSnippet: `// Vulnerability identified at line ${line}\nif (token === storedToken) { verifyUser(); }`,
        rootCause: 'Missing defensive bounds check or constant-time comparison.',
        suggestedFix: 'Implement crypto.timingSafeEqual and strict Zod validation schemas.',
        confidence: 92.5 + idx,
        detectedBy: 'ai',
      });
    });

    // Medium (19)
    for (let i = 1; i <= 19; i++) {
      bugsList.push({
        projectId: project._id,
        title: `Medium Issue #${i}: Inefficient N+1 Database Query in Order History Population`,
        description: 'Sub-queries executed iteratively inside Array.map instead of batch $in aggregation.',
        severity: 'medium',
        priority: 'medium',
        status: i % 3 === 0 ? 'resolved' : (i % 2 === 0 ? 'in_progress' : 'open'),
        category: i % 2 === 0 ? 'performance' : 'code_smell',
        file: `src/services/order_service_${i}.ts`,
        line: 20 + i * 4,
        codeSnippet: `const details = await Promise.all(orders.map(o => getDetails(o.id)));`,
        rootCause: 'Iterative database fetching pattern.',
        suggestedFix: 'Use single query: OrderDetails.find({ orderId: { $in: orderIds } });',
        confidence: 88.0 + (i % 8),
        detectedBy: 'scan',
      });
    }

    // Low (15)
    for (let i = 1; i <= 15; i++) {
      bugsList.push({
        projectId: project._id,
        title: `Code Smell #${i}: Cognitive Complexity & Unused Variable Cleanup`,
        description: 'Variable declared but never read; function exceeds recommended linting complexity score.',
        severity: 'low',
        priority: 'low',
        status: i % 4 === 0 ? 'closed' : 'open',
        category: 'code_smell',
        file: `src/utils/helpers_${i}.ts`,
        line: 10 + i * 2,
        codeSnippet: `const unusedContext = getReqContext();`,
        rootCause: 'Dead code left after refactor.',
        suggestedFix: 'Remove unused binding.',
        confidence: 95.0,
        detectedBy: 'scan',
      });
    }

    await Bug.insertMany(bugsList);
    logger.info(`✅ Created ${bugsList.length} demo bugs (2 Critical, 7 High, 19 Medium, 15 Low)`);

    // 6. Create Test Runs
    await TestRun.create({
      projectId: project._id,
      suiteId: suitePayment._id,
      triggeredBy: demoUser._id,
      status: 'failed',
      startedAt: new Date(Date.now() - 3600000),
      completedAt: new Date(Date.now() - 3595000),
      totalTests: 1248,
      passed: 1205,
      failed: 43,
      skipped: 0,
      duration: 4.82,
      coverage: 87.4,
      environment: { browser: 'Chromium 124', os: 'Linux (Ubuntu 24.04)', nodeVersion: '22.11.0' },
      results: [
        {
          testCaseId: createdCases[1]._id,
          status: 'failed',
          duration: 1.24,
          error: 'DuplicateTransactionError: Charge already processed for order #ORD-9821',
          stackTrace: 'Error: DuplicateTransactionError\n    at PaymentService.charge (src/services/payment.service.ts:84:12)',
        },
        {
          testCaseId: createdCases[0]._id,
          status: 'passed',
          duration: 0.18,
          error: '',
          stackTrace: '',
        },
      ],
    });

    // 7. Create Scan History
    await Scan.create({
      projectId: project._id,
      type: 'full',
      status: 'completed',
      progress: 100,
      filesScanned: 1284,
      linesAnalyzed: 84293,
      issuesFound: 43,
      securityIssues: 9,
      codeSmells: 24,
      performanceIssues: 10,
      qualityScore: 94,
      startedAt: new Date(Date.now() - 7200000),
      completedAt: new Date(Date.now() - 7192000),
    });

    // 8. Create Notifications
    await Notification.create([
      {
        userId: demoUser._id,
        title: 'Critical Bug Detected in Payment Gateway',
        message: 'Idempotency race condition identified in payment.service.ts (Line 84).',
        type: 'error',
        icon: 'AlertTriangle',
        read: false,
        link: `/projects/${project._id}/bugs`,
      },
      {
        userId: demoUser._id,
        title: 'Automated Test Lab Run Completed',
        message: '1,248 tests executed across 6 suites with 87.4% test coverage.',
        type: 'success',
        icon: 'CheckCircle2',
        read: false,
        link: `/projects/${project._id}/tests`,
      },
      {
        userId: demoUser._id,
        title: 'Repository Scan Finished',
        message: 'Analyzed 1,284 files (84,293 LOC). Overall Code Quality Score: 94/100.',
        type: 'info',
        icon: 'Sparkles',
        read: true,
        link: `/projects/${project._id}`,
      },
    ]);

    // 9. Create Activity Logs
    await ActivityLog.create([
      {
        userId: demoUser._id,
        projectId: project._id,
        action: 'PROJECT_SCANNED',
        description: 'Full repository AST and AI code analysis completed (1,284 files).',
        metadata: { files: 1284, qualityScore: 94 },
      },
      {
        userId: demoUser._id,
        projectId: project._id,
        action: 'TEST_RUN_COMPLETED',
        description: 'Test Run #TR-849 executed with 1,205 passed tests and 87.4% coverage.',
        metadata: { runId: 'TR-849', passed: 1205, failed: 43 },
      },
      {
        userId: demoUser._id,
        projectId: project._id,
        action: 'BUG_DETECTED',
        description: 'Critical Security bug flagged: Unvalidated Query Operator Injection.',
        metadata: { severity: 'critical', file: 'user.controller.ts' },
      },
      {
        userId: demoUser._id,
        projectId: project._id,
        action: 'REPORT_GENERATED',
        description: 'Executive Quality & Testing PDF report generated for E-Commerce API.',
        metadata: { reportId: 'REP-9021' },
      },
    ]);

    logger.info('🎉 Seed process completed successfully! All demo datasets ready.');
  } catch (error) {
    logger.error('Seeding error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

if (process.argv[1]?.includes('seed')) {
  seedDatabase();
}
