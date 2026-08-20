import { Worker, Job } from 'bullmq';
import { redis } from '../config/redis.js';
import { logger } from '../utils/logger.js';
import { scanService } from '../services/scan.service.js';
import { testingService } from '../services/testing.service.js';
import { reportService } from '../services/report.service.js';

export function startWorkers() {
  const scanWorker = new Worker(
    'repository-analysis',
    async (job: Job) => {
      logger.info(`Starting background scan job: ${job.id}`);
      const { userId, projectId, type } = job.data;
      return scanService.triggerScan(userId, projectId, type);
    },
    { connection: redis }
  );

  const testWorker = new Worker(
    'test-execution',
    async (job: Job) => {
      logger.info(`Starting background test run job: ${job.id}`);
      const { userId, projectId, suiteId } = job.data;
      return testingService.triggerTestRun(userId, projectId, suiteId);
    },
    { connection: redis }
  );

  const reportWorker = new Worker(
    'report-generation',
    async (job: Job) => {
      logger.info(`Starting background report generation job: ${job.id}`);
      const { userId, projectId } = job.data;
      return reportService.generateProjectReport(projectId, userId);
    },
    { connection: redis }
  );

  logger.info('🚀 BullMQ workers started');

  return { scanWorker, testWorker, reportWorker };
}
