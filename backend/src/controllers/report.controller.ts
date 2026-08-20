import { Request, Response, NextFunction } from 'express';
import { reportService } from '../services/report.service.js';
import { sendSuccess, sendCreated } from '../utils/response.js';

export class ReportController {
  async generate(req: Request, res: Response, next: NextFunction) {
    try {
      const report = await reportService.generateProjectReport(req.params.projectId, req.user!.userId);
      sendCreated(res, { report }, 'Report generated successfully');
    } catch (error) {
      next(error);
    }
  }

  async getLatest(req: Request, res: Response, next: NextFunction) {
    try {
      const report = await reportService.generateProjectReport(req.params.projectId, req.user!.userId);
      sendSuccess(res, { report });
    } catch (error) {
      next(error);
    }
  }
}

export const reportController = new ReportController();
