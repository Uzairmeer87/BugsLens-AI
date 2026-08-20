import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITestCase extends Document {
  projectId: Types.ObjectId;
  suiteId: Types.ObjectId;
  title: string;
  description: string;
  preconditions: string;
  steps: string[];
  expectedResult: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  type: 'functional' | 'boundary' | 'negative' | 'security' | 'performance' | 'api' | 'ui';
  generatedByAI: boolean;
  status: 'active' | 'passed' | 'failed' | 'skipped' | 'blocked';
  lastRunAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const testCaseSchema = new Schema<ITestCase>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    suiteId: { type: Schema.Types.ObjectId, ref: 'TestSuite' },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    preconditions: { type: String, default: '' },
    steps: [{ type: String }],
    expectedResult: { type: String, default: '' },
    priority: { type: String, enum: ['critical', 'high', 'medium', 'low'], default: 'medium' },
    type: { type: String, enum: ['functional', 'boundary', 'negative', 'security', 'performance', 'api', 'ui'], default: 'functional' },
    generatedByAI: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'passed', 'failed', 'skipped', 'blocked'], default: 'active' },
    lastRunAt: { type: Date },
  },
  { timestamps: true }
);

testCaseSchema.index({ projectId: 1 });
testCaseSchema.index({ suiteId: 1 });
testCaseSchema.index({ status: 1 });

export const TestCase = mongoose.model<ITestCase>('TestCase', testCaseSchema);
