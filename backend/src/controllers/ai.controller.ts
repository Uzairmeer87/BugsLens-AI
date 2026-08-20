import { Request, Response, NextFunction } from 'express';
import { aiService } from '../services/ai.service.js';
import { sendSuccess } from '../utils/response.js';

export class AIController {
  async analyzeCode(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await aiService.analyzeCode(req.body);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async generateTests(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await aiService.generateTests(req.body);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async rootCause(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await aiService.analyzeRootCause(req.body);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async generateFix(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await aiService.generateFix(req.body);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async chat(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await aiService.chat(req.body);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }
}

export const aiController = new AIController();
