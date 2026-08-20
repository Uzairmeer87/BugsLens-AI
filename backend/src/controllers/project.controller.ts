import { Request, Response, NextFunction } from 'express';
import { projectService } from '../services/project.service.js';
import { sendSuccess, sendCreated, sendPaginated } from '../utils/response.js';

export class ProjectController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, status, page, limit } = req.query;
      const result = await projectService.listProjects(req.user!.userId, {
        search: search as string,
        status: status as string,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 12,
      });

      sendPaginated(res, result.projects, {
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
      const project = await projectService.getProjectById(req.params.id, req.user!.userId);
      sendSuccess(res, { project });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await projectService.createProject(req.user!.userId, req.body);
      sendCreated(res, { project }, 'Project created successfully');
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await projectService.updateProject(req.params.id, req.user!.userId, req.body);
      sendSuccess(res, { project }, 'Project updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await projectService.deleteProject(req.params.id, req.user!.userId);
      sendSuccess(res, null, 'Project deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await projectService.getProjectStats(req.params.id, req.user!.userId);
      sendSuccess(res, stats);
    } catch (error) {
      next(error);
    }
  }
}

export const projectController = new ProjectController();
