import { Request, Response, NextFunction } from 'express';
import { ActivityLog } from '../models/ActivityLog.js';
import { sendSuccess } from '../utils/response.js';
import { Types } from 'mongoose';

export class ActivityController {
  async listUserActivity(req: Request, res: Response, next: NextFunction) {
    try {
      const logs = await ActivityLog.find({ userId: new Types.ObjectId(req.user!.userId) })
        .sort({ createdAt: -1 })
        .limit(30)
        .populate('projectId', 'name repositoryName')
        .lean();
      sendSuccess(res, { activities: logs });
    } catch (error) {
      next(error);
    }
  }

  async listProjectActivity(req: Request, res: Response, next: NextFunction) {
    try {
      const logs = await ActivityLog.find({ projectId: new Types.ObjectId(req.params.projectId) })
        .sort({ createdAt: -1 })
        .limit(30)
        .populate('userId', 'name email avatar')
        .lean();
      sendSuccess(res, { activities: logs });
    } catch (error) {
      next(error);
    }
  }
}

export const activityController = new ActivityController();
