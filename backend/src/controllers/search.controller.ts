import { Request, Response, NextFunction } from 'express';
import { Project } from '../models/Project.js';
import { Bug } from '../models/Bug.js';
import { TestCase } from '../models/TestCase.js';
import { TestRun } from '../models/TestRun.js';
import { sendSuccess } from '../utils/response.js';
import { Types } from 'mongoose';

export class SearchController {
  async globalSearch(req: Request, res: Response, next: NextFunction) {
    try {
      const q = (req.query.q as string || '').trim();
      if (!q) {
        sendSuccess(res, { projects: [], bugs: [], testCases: [], testRuns: [] });
        return;
      }

      const regex = new RegExp(q, 'i');
      const userId = new Types.ObjectId(req.user!.userId);

      const [projects, bugs, testCases, testRuns] = await Promise.all([
        Project.find({
          owner: userId,
          $or: [{ name: regex }, { description: regex }, { repositoryName: regex }],
        }).limit(5).lean(),

        Bug.find({
          $or: [{ title: regex }, { description: regex }, { file: regex }],
        }).limit(5).lean(),

        TestCase.find({
          $or: [{ title: regex }, { description: regex }],
        }).limit(5).lean(),

        TestRun.find().sort({ createdAt: -1 }).limit(5).lean(),
      ]);

      sendSuccess(res, {
        projects: projects.map((p) => ({ id: p._id, title: p.name, subtitle: p.repositoryName, type: 'project' })),
        bugs: bugs.map((b) => ({ id: b._id, title: b.title, subtitle: `${b.severity.toUpperCase()} • ${b.file}`, type: 'bug' })),
        testCases: testCases.map((t) => ({ id: t._id, title: t.title, subtitle: `${t.type} test`, type: 'test' })),
        testRuns: testRuns.map((r) => ({ id: r._id, title: `Test Run #${r._id.toString().slice(-6)}`, subtitle: r.status, type: 'run' })),
      });
    } catch (error) {
      next(error);
    }
  }
}

export const searchController = new SearchController();
