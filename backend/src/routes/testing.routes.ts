import { Router } from 'express';
import { testingController } from '../controllers/testing.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/projects/:projectId/suites', (req, res, next) => testingController.listSuites(req, res, next));
router.post('/projects/:projectId/suites', (req, res, next) => testingController.createSuite(req, res, next));

router.get('/projects/:projectId/cases', (req, res, next) => testingController.listTestCases(req, res, next));
router.post('/projects/:projectId/cases', (req, res, next) => testingController.createTestCase(req, res, next));
router.post('/projects/:projectId/cases/bulk', (req, res, next) => testingController.createBulkTestCases(req, res, next));

router.get('/projects/:projectId/runs', (req, res, next) => testingController.listRuns(req, res, next));
router.post('/projects/:projectId/runs', (req, res, next) => testingController.triggerRun(req, res, next));
router.get('/runs/:runId', (req, res, next) => testingController.getRunById(req, res, next));

export default router;
