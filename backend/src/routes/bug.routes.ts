import { Router } from 'express';
import { bugController } from '../controllers/bug.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', (req, res, next) => bugController.list(req, res, next));
router.post('/', (req, res, next) => bugController.create(req, res, next));
router.get('/analytics/:projectId', (req, res, next) => bugController.getAnalytics(req, res, next));
router.get('/:id', (req, res, next) => bugController.getById(req, res, next));
router.patch('/:id', (req, res, next) => bugController.update(req, res, next));

export default router;
