import { Router } from 'express';
import { activityController } from '../controllers/activity.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', (req, res, next) => activityController.listUserActivity(req, res, next));
router.get('/projects/:projectId', (req, res, next) => activityController.listProjectActivity(req, res, next));

export default router;
