import { Queue } from 'bullmq';
import { redis } from '../config/redis.js';

export const scanQueue = new Queue('repository-analysis', { connection: redis });
export const testExecutionQueue = new Queue('test-execution', { connection: redis });
export const testGenQueue = new Queue('test-generation', { connection: redis });
export const aiAnalysisQueue = new Queue('ai-analysis', { connection: redis });
export const reportQueue = new Queue('report-generation', { connection: redis });
