import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description: string;
  owner: Types.ObjectId;
  repositoryUrl: string;
  repositoryName: string;
  defaultBranch: string;
  languages: string[];
  framework: string;
  projectType: string;
  status: 'active' | 'analyzing' | 'archived' | 'error';
  codeQualityScore: number;
  testCoverage: number;
  totalFiles: number;
  totalLines: number;
  totalBugs: number;
  totalTests: number;
  lastScanAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, default: '', maxlength: 500 },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    repositoryUrl: { type: String, default: '' },
    repositoryName: { type: String, default: '' },
    defaultBranch: { type: String, default: 'main' },
    languages: [{ type: String }],
    framework: { type: String, default: '' },
    projectType: { type: String, default: 'web' },
    status: { type: String, enum: ['active', 'analyzing', 'archived', 'error'], default: 'active' },
    codeQualityScore: { type: Number, default: 0, min: 0, max: 100 },
    testCoverage: { type: Number, default: 0, min: 0, max: 100 },
    totalFiles: { type: Number, default: 0 },
    totalLines: { type: Number, default: 0 },
    totalBugs: { type: Number, default: 0 },
    totalTests: { type: Number, default: 0 },
    lastScanAt: { type: Date },
  },
  { timestamps: true }
);

projectSchema.index({ owner: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ name: 'text', description: 'text' });

export const Project = mongoose.model<IProject>('Project', projectSchema);
