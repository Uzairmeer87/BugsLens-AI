import { Router } from 'express';
import { projectController } from '../controllers/project.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', (req, res, next) => projectController.list(req, res, next));
router.post('/', (req, res, next) => projectController.create(req, res, next));
router.get('/:id', (req, res, next) => projectController.getById(req, res, next));
router.put('/:id', (req, res, next) => projectController.update(req, res, next));
router.delete('/:id', (req, res, next) => projectController.delete(req, res, next));
router.get('/:id/stats', (req, res, next) => projectController.getStats(req, res, next));

export default router;
