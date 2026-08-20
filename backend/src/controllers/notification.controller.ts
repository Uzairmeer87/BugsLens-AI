import { Request, Response, NextFunction } from 'express';
import { Notification } from '../models/Notification.js';
import { sendSuccess } from '../utils/response.js';
import { Types } from 'mongoose';

export class NotificationController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const notifications = await Notification.find({ userId: new Types.ObjectId(req.user!.userId) })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();
      
      const unreadCount = await Notification.countDocuments({
        userId: new Types.ObjectId(req.user!.userId),
        read: false,
      });

      sendSuccess(res, { notifications, unreadCount });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      await Notification.findOneAndUpdate(
        { _id: new Types.ObjectId(req.params.id), userId: new Types.ObjectId(req.user!.userId) },
        { $set: { read: true } }
      );
      sendSuccess(res, null, 'Marked as read');
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      await Notification.updateMany(
        { userId: new Types.ObjectId(req.user!.userId), read: false },
        { $set: { read: true } }
      );
      sendSuccess(res, null, 'All marked as read');
    } catch (error) {
      next(error);
    }
  }
}

export const notificationController = new NotificationController();
