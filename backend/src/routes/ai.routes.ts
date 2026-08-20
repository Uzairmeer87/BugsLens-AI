import { Router } from 'express';
import { aiController } from '../controllers/ai.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/analyze', (req, res, next) => aiController.analyzeCode(req, res, next));
router.post('/generate-tests', (req, res, next) => aiController.generateTests(req, res, next));
router.post('/root-cause', (req, res, next) => aiController.rootCause(req, res, next));
router.post('/generate-fix', (req, res, next) => aiController.generateFix(req, res, next));
router.post('/chat', (req, res, next) => aiController.chat(req, res, next));

export default router;
