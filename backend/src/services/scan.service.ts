import { Scan, IScan } from '../models/Scan.js';
import { Project } from '../models/Project.js';
import { Bug } from '../models/Bug.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { AppError } from '../utils/response.js';
import { Types } from 'mongoose';
import { io } from '../sockets/index.js';

export class ScanService {
  async listScans(projectId: string): Promise<IScan[]> {
    return Scan.find({ projectId: new Types.ObjectId(projectId) })
      .sort({ createdAt: -1 })
      .lean();
  }

  async getScanById(scanId: string): Promise<IScan> {
    const scan = await Scan.findById(scanId);
    if (!scan) {
      throw new AppError('NOT_FOUND', 'Scan not found', 404);
    }
    return scan;
  }

  async triggerScan(userId: string, projectId: string, type: 'full' | 'quick' | 'security' | 'quality' = 'full'): Promise<IScan> {
    const scan = await Scan.create({
      projectId: new Types.ObjectId(projectId),
      type,
      status: 'running',
      progress: 5,
      startedAt: new Date(),
      filesScanned: 0,
      linesAnalyzed: 0,
      issuesFound: 0,
      securityIssues: 0,
      codeSmells: 0,
      performanceIssues: 0,
      qualityScore: 90,
    });

    await Project.findByIdAndUpdate(projectId, { status: 'analyzing' });

    io?.emit('scan:started', { scanId: scan._id, projectId, type });

    // Asynchronously run scanning progress simulation with real-time socket events
    this.executeScanSimulation(scan._id.toString(), projectId, userId, type);

    return scan;
  }

  private async executeScanSimulation(scanId: string, projectId: string, userId: string, type: string) {
    const steps = [
      { progress: 15, msg: 'Initializing AI Engine...', files: 120, lines: 14200 },
      { progress: 35, msg: 'Repository indexed & AST parsed', files: 480, lines: 42100 },
      { progress: 60, msg: 'Static security & dependency rules verified', files: 890, lines: 68400 },
      { progress: 85, msg: 'Deep neural analysis & vulnerability heuristics running', files: 1140, lines: 79200 },
      { progress: 100, msg: 'Analysis complete. Synthesizing metrics.', files: 1284, lines: 84293 },
    ];

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, 900));

      io?.emit('scan:progress', {
        scanId,
        projectId,
        progress: step.progress,
        message: step.msg,
        filesScanned: step.files,
        linesAnalyzed: step.lines,
      });
    }

    const issuesFound = type === 'security' ? 8 : (type === 'quick' ? 14 : 43);
    const securityIssues = 9;
    const codeSmells = 24;
    const performanceIssues = 10;
    const qualityScore = 94;

    const completedScan = await Scan.findByIdAndUpdate(
      scanId,
      {
        $set: {
          status: 'completed',
          progress: 100,
          filesScanned: 1284,
          linesAnalyzed: 84293,
          issuesFound,
          securityIssues,
          codeSmells,
          performanceIssues,
          qualityScore,
          completedAt: new Date(),
        },
      },
      { new: true }
    );

    await Project.findByIdAndUpdate(projectId, {
      status: 'active',
      codeQualityScore: qualityScore,
      totalFiles: 1284,
      totalLines: 84293,
      lastScanAt: new Date(),
    });

    await ActivityLog.create({
      userId: new Types.ObjectId(userId),
      projectId: new Types.ObjectId(projectId),
      action: 'SCAN_COMPLETED',
      description: `${type.toUpperCase()} scan completed. ${issuesFound} issues identified (Quality score: ${qualityScore}/100).`,
      metadata: { scanId, qualityScore, issuesFound },
    });

    io?.emit('scan:completed', {
      scanId,
      projectId,
      status: 'completed',
      issuesFound,
      qualityScore,
    });
  }
}

export const scanService = new ScanService();
