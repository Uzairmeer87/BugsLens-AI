import { Request, Response, NextFunction } from 'express';
import { testingService } from '../services/testing.service.js';
import { sendSuccess, sendCreated } from '../utils/response.js';

export class TestingController {
  async listSuites(req: Request, res: Response, next: NextFunction) {
    try {
      const suites = await testingService.listSuites(req.params.projectId);
      sendSuccess(res, { suites });
    } catch (error) {
      next(error);
    }
  }

  async createSuite(req: Request, res: Response, next: NextFunction) {
    try {
      const suite = await testingService.createSuite(req.user!.userId, {
        ...req.body,
        projectId: req.params.projectId,
      });
      sendCreated(res, { suite });
    } catch (error) {
      next(error);
    }
  }

  async listTestCases(req: Request, res: Response, next: NextFunction) {
    try {
      const { suiteId, type, priority } = req.query;
      const tests = await testingService.listTestCases(req.params.projectId, {
        suiteId: suiteId as string,
        type: type as string,
        priority: priority as string,
      });
      sendSuccess(res, { tests });
    } catch (error) {
      next(error);
    }
  }

  async createTestCase(req: Request, res: Response, next: NextFunction) {
    try {
      const test = await testingService.createTestCase({
        ...req.body,
        projectId: req.params.projectId,
      });
      sendCreated(res, { test });
    } catch (error) {
      next(error);
    }
  }

  async createBulkTestCases(req: Request, res: Response, next: NextFunction) {
    try {
      const { suiteId, tests } = req.body;
      const created = await testingService.createBulkTestCases(req.params.projectId, suiteId, tests);
      sendCreated(res, { tests: created }, `Created ${created.length} test cases`);
    } catch (error) {
      next(error);
    }
  }

  async listRuns(req: Request, res: Response, next: NextFunction) {
    try {
      const runs = await testingService.listTestRuns(req.params.projectId);
      sendSuccess(res, { runs });
    } catch (error) {
      next(error);
    }
  }

  async getRunById(req: Request, res: Response, next: NextFunction) {
    try {
      const run = await testingService.getTestRunById(req.params.runId);
      sendSuccess(res, { run });
    } catch (error) {
      next(error);
    }
  }

  async triggerRun(req: Request, res: Response, next: NextFunction) {
    try {
      const run = await testingService.triggerTestRun(
        req.user!.userId,
        req.params.projectId,
        req.body.suiteId
      );
      sendCreated(res, { run }, 'Test run initialized');
    } catch (error) {
      next(error);
    }
  }
}

export const testingController = new TestingController();
