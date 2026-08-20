import random
from typing import List
from app.schemas.models import (
    CodeAnalysisRequest, CodeAnalysisResponse, DetectedIssue,
    TestGenerationRequest, TestGenerationResponse, GeneratedTestCase,
    RootCauseRequest, RootCauseResponse,
    FixGenerationRequest, FixGenerationResponse,
    ChatRequest, ChatResponse
)

class MockAIService:
    """Provides high-fidelity deterministic responses for Demo AI Mode."""

    @staticmethod
    def analyze_code(req: CodeAnalysisRequest) -> CodeAnalysisResponse:
        lines = req.content.count("\n") + 1
        file_lower = req.file_path.lower()

        issues: List[DetectedIssue] = []

        if "auth" in file_lower or "jwt" in file_lower or "token" in file_lower:
            issues.append(
                DetectedIssue(
                    id="ISSUE-101",
                    title="Missing Token Expiration Validation in Refresh Handler",
                    description="The JWT verification logic does not explicitly catch TokenExpiredError separately from invalid signatures, leading to generic 500 status codes instead of 401 Unauthorized.",
                    severity="critical",
                    priority="critical",
                    category="security",
                    line=42,
                    code_snippet="const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);",
                    confidence=96.5,
                    suggested_fix="try {\n  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);\n} catch (err) {\n  if (err instanceof jwt.TokenExpiredError) return res.status(401).json({ error: 'TOKEN_EXPIRED' });\n  throw err;\n}",
                    root_cause="Missing explicit TokenExpiredError catch block causes unhandled rejection."
                )
            )
            issues.append(
                DetectedIssue(
                    id="ISSUE-102",
                    title="Timing Attack Risk in Password Compare",
                    description="String comparison of password tokens using standard equality (===) instead of constant-time comparison buffer allows timing attack profiling.",
                    severity="high",
                    priority="high",
                    category="vulnerability",
                    line=88,
                    code_snippet="if (userToken === providedToken) { grantAccess(); }",
                    confidence=91.0,
                    suggested_fix="import crypto from 'crypto';\nif (crypto.timingSafeEqual(Buffer.from(userToken), Buffer.from(providedToken))) { grantAccess(); }",
                    root_cause="Non-constant time string equality operator exposed to remote callers."
                )
            )
        elif "user" in file_lower or "payment" in file_lower or "order" in file_lower:
            issues.append(
                DetectedIssue(
                    id="ISSUE-201",
                    title="Unsanitized Database Query Parameter (Potential SQL/NoSQL Injection)",
                    description="User input from req.query is directly interpolated or passed into database query filter without schema sanitization.",
                    severity="critical",
                    priority="critical",
                    category="security",
                    line=34,
                    code_snippet="const results = await db.collection('users').find({ email: req.query.email }).toArray();",
                    confidence=98.2,
                    suggested_fix="const sanitizedEmail = String(req.query.email).trim().toLowerCase();\nconst results = await User.findOne({ email: sanitizedEmail });",
                    root_cause="Direct parameter passing without type narrowing allows object injection queries."
                )
            )
            issues.append(
                DetectedIssue(
                    id="ISSUE-202",
                    title="Missing Idempotency Key on Transaction Processing",
                    description="Payment execution endpoint accepts repeated POST requests without checking for an idempotency-key header, causing duplicate charges on network retries.",
                    severity="high",
                    priority="high",
                    category="bug",
                    line=112,
                    code_snippet="const charge = await stripe.charges.create({ amount, currency, customer });",
                    confidence=94.0,
                    suggested_fix="const idempotencyKey = req.headers['idempotency-key'];\nconst charge = await stripe.charges.create({ amount, currency, customer }, { idempotencyKey });",
                    root_cause="Payment gateway calls lack idempotency token enforcement."
                )
            )
        else:
            issues.append(
                DetectedIssue(
                    id="ISSUE-301",
                    title="Unhandled Promise Rejection in Async Stream Processing",
                    description="An asynchronous promise created inside an event listener callback is not wrapped in a try/catch block, leading to silent crash under unhandled socket disconnects.",
                    severity="medium",
                    priority="medium",
                    category="bug",
                    line=25,
                    code_snippet="stream.on('data', async (chunk) => { await processChunk(chunk); });",
                    confidence=89.5,
                    suggested_fix="stream.on('data', async (chunk) => {\n  try { await processChunk(chunk); } catch (err) { logger.error(err); }\n});",
                    root_cause="Async callback within EventEmitter missing localized error boundary."
                )
            )
            issues.append(
                DetectedIssue(
                    id="ISSUE-302",
                    title="Cognitive Complexity & Deep Nesting Code Smell",
                    description="Function exceeds cyclomatic complexity threshold (score: 18, recommended max: 10) with 5 levels of nested conditionals.",
                    severity="low",
                    priority="low",
                    category="code_smell",
                    line=67,
                    code_snippet="if (a) { if (b) { while (c) { if (d) { ... } } } }",
                    confidence=95.0,
                    suggested_fix="Refactor into early return guard clauses and separate helper validation predicates.",
                    root_cause="Deep conditional branching."
                )
            )

        return CodeAnalysisResponse(
            status="completed",
            file_path=req.file_path,
            quality_score=94 if not issues else (88 if any(i.severity == "critical" for i in issues) else 92),
            maintainability_score=95,
            reliability_score=91,
            security_score=89 if any(i.severity == "critical" for i in issues) else 96,
            performance_score=94,
            testability_score=97,
            issues=issues,
            total_lines=max(lines, 140),
            metrics={"cyclomatic_complexity": 7, "maintainability_index": 82.4, "test_coverage_estimate": 87.4},
            is_demo=True
        )

    @staticmethod
    def generate_tests(req: TestGenerationRequest) -> TestGenerationResponse:
        func = req.function_name or "processTransaction"
        tests = [
            GeneratedTestCase(
                id="TC-101",
                title=f"Verify {func} executes successfully with valid payload",
                description=f"Ensure that {func} returns a 200/success response and correctly persists records when provided conforming input.",
                priority="high",
                type="functional",
                preconditions="Database is in a seeded state with an active authenticated session.",
                steps=[
                    "1. Construct valid request payload matching schema",
                    f"2. Invoke {func} with payload",
                    "3. Validate that execution finishes without throwing exceptions",
                    "4. Query storage to assert entity state updated"
                ],
                expected_result="Status code 200, execution completed under 50ms, response contains valid ID.",
                generated_by_ai=True,
                code_sample=f"it('should execute {func} with valid payload', async () => {{\n  const res = await {func}(validPayload);\n  expect(res.status).toBe('success');\n}});"
            ),
            GeneratedTestCase(
                id="TC-102",
                title=f"Validate {func} handles boundary values (max integers, empty strings, 0 amount)",
                description="Test extreme edge cases including 0 values, Unicode strings, and max integer limits.",
                priority="medium",
                type="boundary",
                preconditions="Mock database adapter initialized.",
                steps=[
                    "1. Pass payload with boundary value (e.g. amount: 0, title: ' ' * 255)",
                    f"2. Execute {func}",
                    "3. Assert input is safely sanitized or rejected with validation error"
                ],
                expected_result="Handles edge values gracefully without integer overflow or unhandled null dereferences.",
                generated_by_ai=True,
                code_sample=f"it('should handle boundary values safely', async () => {{\n  await expect({func}({{ amount: 0 }})).rejects.toThrow('VALIDATION_ERROR');\n}});"
            ),
            GeneratedTestCase(
                id="TC-103",
                title=f"Assert {func} rejects unauthorized / missing authentication tokens",
                description="Security verification to ensure unauthenticated callers receive 401 Unauthorized.",
                priority="critical",
                type="security",
                preconditions="Clear Authorization headers and cookies.",
                steps=[
                    "1. Remove Bearer token from header context",
                    f"2. Call endpoint / {func}",
                    "3. Inspect HTTP response code and error payload"
                ],
                expected_result="HTTP 401 Unauthorized with error code UNAUTHORIZED.",
                generated_by_ai=True,
                code_sample=f"it('should block unauthenticated execution', async () => {{\n  const res = await request(app).post('/api/{func}');\n  expect(res.status).toBe(401);\n}});"
            ),
            GeneratedTestCase(
                id="TC-104",
                title=f"Ensure {func} throws descriptive error on malformed JSON payload",
                description="Negative test case for bad input formats and corrupted JSON structures.",
                priority="high",
                type="negative",
                preconditions="Active server listening.",
                steps=[
                    "1. Send invalid JSON payload with missing required fields",
                    "2. Verify server does not crash",
                    "3. Check for clear error response with path details"
                ],
                expected_result="HTTP 400 Bad Request with field-level validation errors.",
                generated_by_ai=True,
                code_sample=f"it('should reject malformed payload', async () => {{\n  const res = await request(app).post('/api/tests').send('invalid json');\n  expect(res.status).toBe(400);\n}});"
            )
        ]
        return TestGenerationResponse(tests=tests, total_generated=len(tests), is_demo=True)

    @staticmethod
    def root_cause_analysis(req: RootCauseRequest) -> RootCauseResponse:
        return RootCauseResponse(
            root_cause="The authentication middleware throws an unhandled 'TypeError: Cannot read properties of undefined (reading 'userId')' because req.user is accessed before the token validation middleware completes its asynchronous verification chain.",
            why_it_happened="In routes/api.ts, the rateLimiter and permissionChecker middleware were registered in reverse order on router.use(), executing permission checks before req.user was populated by verifyJwtToken().",
            impact_analysis="All authenticated API calls under /api/v1/projects failed with a 500 Internal Server Error when called with expired or refreshed session headers.",
            suggested_fix="Re-order the Express router middleware chain so that `authenticate` runs before `requireRole` and verify that `req.user` is guarded before dereferencing properties.",
            diff_before="""// BEFORE
router.get(
  '/projects',
  requireRole('developer'), // ❌ Error: req.user is not yet attached!
  authenticate,
  projectController.list
);""",
            diff_after="""// AFTER
router.get(
  '/projects',
  authenticate,             // ✅ req.user is safely verified and attached
  requireRole('developer'), // ✅ Safe to inspect req.user.role
  projectController.list
);""",
            confidence=95.8,
            is_demo=True
        )

    @staticmethod
    def generate_fix(req: FixGenerationRequest) -> FixGenerationResponse:
        before = req.code_snippet or "// Existing implementation with vulnerability\nconst user = await db.find({ id: req.params.id });\nreturn res.json(user);"
        after = """// Fixed implementation with input validation and security checks
const id = String(req.params.id).trim();
if (!mongoose.Types.ObjectId.isValid(id)) {
  return res.status(400).json({ error: 'INVALID_ID_FORMAT' });
}
const user = await User.findById(id).select('-passwordHash -tokens').lean();
if (!user) {
  return res.status(404).json({ error: 'USER_NOT_FOUND' });
}
return res.json({ success: true, data: user });"""
        
        patch = """--- a/controllers/user.controller.ts
+++ b/controllers/user.controller.ts
@@ -14,3 +14,8 @@
- const user = await db.find({ id: req.params.id });
- return res.json(user);
+ const id = String(req.params.id).trim();
+ if (!mongoose.Types.ObjectId.isValid(id)) {
+   return res.status(400).json({ error: 'INVALID_ID_FORMAT' });
+ }
+ const user = await User.findById(id).select('-passwordHash -tokens').lean();
+ if (!user) return res.status(404).json({ error: 'USER_NOT_FOUND' });
+ return res.json({ success: true, data: user });"""

        return FixGenerationResponse(
            explanation="The fix sanitizes input by validating ObjectId format, queries with explicit Mongoose methods to prevent injection, projects out sensitive password hash fields, and properly handles 404 conditions.",
            before_code=before,
            after_code=after,
            patch=patch,
            confidence=97.2,
            is_demo=True
        )

    @staticmethod
    def chat(req: ChatRequest) -> ChatResponse:
        q = req.question.lower()
        if "login" in q or "fail" in q or "test" in q:
            ans = "Based on the latest test run (#TR-849), the login test failed because the mock Redis server timed out during session token serialization. Re-running the suite with `REDIS_TIMEOUT=5000` or verifying the JWT secret in `.env` resolved 100% of the failures in staging."
            suggestions = ["Re-run test suite with debug logs", "Inspect auth middleware stack trace", "Generate integration tests for session refresh"]
            files = ["backend/src/middleware/auth.ts", "backend/src/services/auth.service.ts"]
        elif "coverage" in q:
            ans = "Your project currently maintains **87.4% test coverage**. The lowest covered areas are `src/integrations/github/client.ts` (42% branch coverage) and `src/workers/report.worker.ts` (51% coverage). Generating 4 additional unit tests will boost overall coverage above 90%."
            suggestions = ["Generate tests for GitHub integration", "Generate tests for report worker", "View full coverage treemap"]
            files = ["backend/src/integrations/github/client.ts", "backend/src/workers/report.worker.ts"]
        elif "security" in q or "vulnerability" in q:
            ans = "AI Code Analysis identified **2 High Severity Security Issues**: 1) Direct query parameter interpolation without type validation in `user.controller.ts:42`, and 2) Missing timingSafeEqual comparison in password reset token matching."
            suggestions = ["Generate AI Fix for user.controller.ts", "Review all 43 detected bugs", "Export security compliance report"]
            files = ["backend/src/controllers/user.controller.ts", "backend/src/services/auth.service.ts"]
        else:
            ans = f"BugLens AI analyzed your request: '{req.question}'. All 1,284 files in the repository have been indexed with AST parsing and LLM static checking. What would you like to inspect next?"
            suggestions = ["Analyze active repository", "Generate test suite for API routes", "Run test lab simulation", "Download testing PDF report"]
            files = ["backend/src/routes/api.routes.ts", "frontend/src/features/testing/TestLab.tsx"]

        return ChatResponse(
            answer=ans,
            suggestions=suggestions,
            relevant_files=files,
            is_demo=True
        )
