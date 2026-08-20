import { Bug, IBug } from '../models/Bug.js';
import { Project } from '../models/Project.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { AppError } from '../utils/response.js';
import { Types } from 'mongoose';

export class BugService {
  async listBugs(projectId: string, query: {
    severity?: string;
    priority?: string;
    status?: string;
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const filter: Record<string, unknown> = { projectId: new Types.ObjectId(projectId) };

    if (query.severity && query.severity !== 'all') filter.severity = query.severity;
    if (query.priority && query.priority !== 'all') filter.priority = query.priority;
    if (query.status && query.status !== 'all') filter.status = query.status;
    if (query.category && query.category !== 'all') filter.category = query.category;

    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
        { file: { $regex: query.search, $options: 'i' } },
      ];
    }

    const [bugs, total] = await Promise.all([
      Bug.find(filter)
        .sort({ severity: 1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('assignedTo', 'name email avatar')
        .lean(),
      Bug.countDocuments(filter),
    ]);

    return { bugs, total, page, limit };
  }

  async getBugById(bugId: string): Promise<IBug> {
    const bug = await Bug.findById(bugId)
      .populate('projectId', 'name repositoryName')
      .populate('assignedTo', 'name email avatar');

    if (!bug) {
      throw new AppError('NOT_FOUND', 'Bug not found', 404);
    }
    return bug;
  }

  async createBug(userId: string, data: Partial<IBug>): Promise<IBug> {
    const bug = await Bug.create(data);

    await Project.findByIdAndUpdate(data.projectId, { $inc: { totalBugs: 1 } });

    await ActivityLog.create({
      userId: new Types.ObjectId(userId),
      projectId: data.projectId,
      action: 'BUG_CREATED',
      description: `Bug "${bug.title}" was logged (${bug.severity} severity).`,
      metadata: { bugId: bug._id, severity: bug.severity },
    });

    return bug;
  }

  async updateBug(bugId: string, userId: string, data: Partial<IBug>): Promise<IBug> {
    const oldBug = await Bug.findById(bugId);
    if (!oldBug) {
      throw new AppError('NOT_FOUND', 'Bug not found', 404);
    }

    const bug = await Bug.findByIdAndUpdate(bugId, { $set: data }, { new: true });

    if (data.status && data.status !== oldBug.status) {
      await ActivityLog.create({
        userId: new Types.ObjectId(userId),
        projectId: oldBug.projectId,
        action: 'BUG_STATUS_CHANGED',
        description: `Bug "${oldBug.title}" status changed to ${data.status}.`,
        metadata: { bugId, from: oldBug.status, to: data.status },
      });
    }

    return bug!;
  }

  async getBugAnalytics(projectId: string) {
    const bugs = await Bug.find({ projectId: new Types.ObjectId(projectId) }).lean();

    const bySeverity = { critical: 0, high: 0, medium: 0, low: 0 };
    const byStatus = { open: 0, confirmed: 0, in_progress: 0, resolved: 0, reopened: 0, closed: 0 };
    const byCategory = { bug: 0, security: 0, performance: 0, code_smell: 0, vulnerability: 0 };

    bugs.forEach((b) => {
      if (b.severity in bySeverity) bySeverity[b.severity as keyof typeof bySeverity]++;
      if (b.status in byStatus) byStatus[b.status as keyof typeof byStatus]++;
      if (b.category in byCategory) byCategory[b.category as keyof typeof byCategory]++;
    });

    return {
      total: bugs.length,
      bySeverity,
      byStatus,
      byCategory,
    };
  }
}

export const bugService = new BugService();
