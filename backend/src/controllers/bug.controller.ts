import { Request, Response, NextFunction } from 'express';
import { bugService } from '../services/bug.service.js';
import { sendSuccess, sendCreated, sendPaginated } from '../utils/response.js';

export class BugController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId, severity, priority, status, category, search, page, limit } = req.query;
      const result = await bugService.listBugs(projectId as string, {
        severity: severity as string,
        priority: priority as string,
        status: status as string,
        category: category as string,
        search: search as string,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
      });

      sendPaginated(res, result.bugs, {
        page: result.page,
        limit: result.limit,
        total: result.total,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const bug = await bugService.getBugById(req.params.id);
      sendSuccess(res, { bug });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const bug = await bugService.createBug(req.user!.userId, req.body);
      sendCreated(res, { bug }, 'Bug created successfully');
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const bug = await bugService.updateBug(req.params.id, req.user!.userId, req.body);
      sendSuccess(res, { bug }, 'Bug updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const analytics = await bugService.getBugAnalytics(req.params.projectId);
      sendSuccess(res, analytics);
    } catch (error) {
      next(error);
    }
  }
}

export const bugController = new BugController();
