import { Request, Response, NextFunction } from 'express';
import { scanService } from '../services/scan.service.js';
import { sendSuccess, sendCreated } from '../utils/response.js';

export class ScanController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const scans = await scanService.listScans(req.params.projectId);
      sendSuccess(res, { scans });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const scan = await scanService.getScanById(req.params.id);
      sendSuccess(res, { scan });
    } catch (error) {
      next(error);
    }
  }

  async trigger(req: Request, res: Response, next: NextFunction) {
    try {
      const scan = await scanService.triggerScan(
        req.user!.userId,
        req.params.projectId,
        req.body.type || 'full'
      );
      sendCreated(res, { scan }, 'Analysis scan started');
    } catch (error) {
      next(error);
    }
  }
}

export const scanController = new ScanController();
