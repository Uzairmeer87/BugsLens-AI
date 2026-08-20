import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IScan extends Document {
  projectId: Types.ObjectId;
  type: 'full' | 'quick' | 'security' | 'quality';
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  filesScanned: number;
  linesAnalyzed: number;
  issuesFound: number;
  securityIssues: number;
  codeSmells: number;
  performanceIssues: number;
  qualityScore: number;
  startedAt: Date;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const scanSchema = new Schema<IScan>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    type: { type: String, enum: ['full', 'quick', 'security', 'quality'], default: 'full' },
    status: { type: String, enum: ['pending', 'running', 'completed', 'failed'], default: 'pending' },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    filesScanned: { type: Number, default: 0 },
    linesAnalyzed: { type: Number, default: 0 },
    issuesFound: { type: Number, default: 0 },
    securityIssues: { type: Number, default: 0 },
    codeSmells: { type: Number, default: 0 },
    performanceIssues: { type: Number, default: 0 },
    qualityScore: { type: Number, default: 0 },
    startedAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

scanSchema.index({ projectId: 1, createdAt: -1 });

export const Scan = mongoose.model<IScan>('Scan', scanSchema);
