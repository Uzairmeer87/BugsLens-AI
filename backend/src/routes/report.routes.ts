import { Router } from 'express';
import { reportController } from '../controllers/report.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/projects/:projectId/generate', (req, res, next) => reportController.generate(req, res, next));
router.get('/projects/:projectId/latest', (req, res, next) => reportController.getLatest(req, res, next));

export default router;
