import { Router } from 'express';
import { scanController } from '../controllers/scan.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/projects/:projectId/scans', (req, res, next) => scanController.list(req, res, next));
router.post('/projects/:projectId/scans', (req, res, next) => scanController.trigger(req, res, next));
router.get('/scans/:id', (req, res, next) => scanController.getById(req, res, next));

export default router;
