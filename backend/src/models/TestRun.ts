import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITestRun extends Document {
  projectId: Types.ObjectId;
  suiteId: Types.ObjectId;
  triggeredBy: Types.ObjectId;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt: Date;
  completedAt: Date;
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  coverage: number;
  environment: {
    browser: string;
    os: string;
    nodeVersion: string;
  };
  results: Array<{
    testCaseId: Types.ObjectId;
    status: 'passed' | 'failed' | 'skipped';
    duration: number;
    error: string;
    stackTrace: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const testRunSchema = new Schema<ITestRun>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    suiteId: { type: Schema.Types.ObjectId, ref: 'TestSuite' },
    triggeredBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'running', 'completed', 'failed', 'cancelled'], default: 'pending' },
    startedAt: { type: Date },
    completedAt: { type: Date },
    totalTests: { type: Number, default: 0 },
    passed: { type: Number, default: 0 },
    failed: { type: Number, default: 0 },
    skipped: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    coverage: { type: Number, default: 0 },
    environment: {
      browser: { type: String, default: 'Chromium' },
      os: { type: String, default: 'Linux' },
      nodeVersion: { type: String, default: '22.x' },
    },
    results: [
      {
        testCaseId: { type: Schema.Types.ObjectId, ref: 'TestCase' },
        status: { type: String, enum: ['passed', 'failed', 'skipped'] },
        duration: { type: Number, default: 0 },
        error: { type: String, default: '' },
        stackTrace: { type: String, default: '' },
      },
    ],
  },
  { timestamps: true }
);

testRunSchema.index({ projectId: 1, createdAt: -1 });
testRunSchema.index({ status: 1 });

export const TestRun = mongoose.model<ITestRun>('TestRun', testRunSchema);
