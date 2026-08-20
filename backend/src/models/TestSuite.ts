import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITestSuite extends Document {
  projectId: Types.ObjectId;
  name: string;
  description: string;
  type: 'functional' | 'api' | 'ui' | 'security' | 'performance';
  tests: Types.ObjectId[];
  createdBy: Types.ObjectId;
  status: 'active' | 'running' | 'completed' | 'failed';
  lastRunAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const testSuiteSchema = new Schema<ITestSuite>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    type: { type: String, enum: ['functional', 'api', 'ui', 'security', 'performance'], default: 'functional' },
    tests: [{ type: Schema.Types.ObjectId, ref: 'TestCase' }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['active', 'running', 'completed', 'failed'], default: 'active' },
    lastRunAt: { type: Date },
  },
  { timestamps: true }
);

testSuiteSchema.index({ projectId: 1 });

export const TestSuite = mongoose.model<ITestSuite>('TestSuite', testSuiteSchema);
