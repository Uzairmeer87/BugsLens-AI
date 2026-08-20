import { Project, IProject } from '../models/Project.js';
import { Bug } from '../models/Bug.js';
import { TestCase } from '../models/TestCase.js';
import { TestRun } from '../models/TestRun.js';
import { Scan } from '../models/Scan.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { AppError } from '../utils/response.js';
import { Types } from 'mongoose';

export class ProjectService {
  async listProjects(userId: string, query: { search?: string; status?: string; page?: number; limit?: number }) {
    const page = query.page || 1;
    const limit = query.limit || 12;
    const filter: Record<string, unknown> = { owner: new Types.ObjectId(userId) };

    if (query.status && query.status !== 'all') {
      filter.status = query.status;
    }

    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
        { repositoryName: { $regex: query.search, $options: 'i' } },
      ];
    }

    const [projects, total] = await Promise.all([
      Project.find(filter)
        .sort({ updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Project.countDocuments(filter),
    ]);

    return { projects, total, page, limit };
  }

  async getProjectById(projectId: string, userId: string): Promise<IProject> {
    const project = await Project.findOne({
      _id: new Types.ObjectId(projectId),
      owner: new Types.ObjectId(userId),
    });

    if (!project) {
      throw new AppError('NOT_FOUND', 'Project not found', 404);
    }
    return project;
  }

  async createProject(userId: string, data: Partial<IProject>): Promise<IProject> {
    const project = await Project.create({
      ...data,
      owner: new Types.ObjectId(userId),
      codeQualityScore: data.codeQualityScore || 92,
      testCoverage: data.testCoverage || 84.5,
      totalFiles: data.totalFiles || 48,
      totalLines: data.totalLines || 6240,
    });

    await ActivityLog.create({
      userId: new Types.ObjectId(userId),
      projectId: project._id,
      action: 'PROJECT_CREATED',
      description: `Project "${project.name}" was created.`,
      metadata: { repository: project.repositoryName },
    });

    return project;
  }

  async updateProject(projectId: string, userId: string, data: Partial<IProject>): Promise<IProject> {
    const project = await Project.findOneAndUpdate(
      { _id: new Types.ObjectId(projectId), owner: new Types.ObjectId(userId) },
      { $set: data },
      { new: true }
    );

    if (!project) {
      throw new AppError('NOT_FOUND', 'Project not found', 404);
    }

    await ActivityLog.create({
      userId: new Types.ObjectId(userId),
      projectId: project._id,
      action: 'PROJECT_UPDATED',
      description: `Project "${project.name}" configuration was updated.`,
    });

    return project;
  }

  async deleteProject(projectId: string, userId: string): Promise<void> {
    const project = await Project.findOneAndDelete({
      _id: new Types.ObjectId(projectId),
      owner: new Types.ObjectId(userId),
    });

    if (!project) {
      throw new AppError('NOT_FOUND', 'Project not found', 404);
    }

    await Promise.all([
      Bug.deleteMany({ projectId: project._id }),
      TestCase.deleteMany({ projectId: project._id }),
      TestRun.deleteMany({ projectId: project._id }),
      Scan.deleteMany({ projectId: project._id }),
      ActivityLog.deleteMany({ projectId: project._id }),
    ]);
  }

  async getProjectStats(projectId: string, userId: string) {
    const project = await this.getProjectById(projectId, userId);

    const [bugsCount, criticalBugs, highBugs, totalTests, recentRuns] = await Promise.all([
      Bug.countDocuments({ projectId: project._id }),
      Bug.countDocuments({ projectId: project._id, severity: 'critical' }),
      Bug.countDocuments({ projectId: project._id, severity: 'high' }),
      TestCase.countDocuments({ projectId: project._id }),
      TestRun.find({ projectId: project._id }).sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    return {
      project,
      metrics: {
        codeQualityScore: project.codeQualityScore,
        testCoverage: project.testCoverage,
        totalFiles: project.totalFiles,
        totalLines: project.totalLines,
        totalBugs: bugsCount,
        criticalBugs,
        highBugs,
        totalTests,
      },
      recentRuns,
    };
  }
}

export const projectService = new ProjectService();
