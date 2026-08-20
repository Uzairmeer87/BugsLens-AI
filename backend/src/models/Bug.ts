import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBug extends Document {
  projectId: Types.ObjectId;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'confirmed' | 'in_progress' | 'resolved' | 'reopened' | 'closed';
  category: 'bug' | 'security' | 'performance' | 'code_smell' | 'vulnerability';
  file: string;
  line: number;
  codeSnippet: string;
  error: string;
  stackTrace: string;
  stepsToReproduce: string[];
  rootCause: string;
  suggestedFix: string;
  confidence: number;
  detectedBy: 'ai' | 'test' | 'manual' | 'scan';
  testRunId: Types.ObjectId;
  assignedTo: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const bugSchema = new Schema<IBug>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    severity: { type: String, enum: ['critical', 'high', 'medium', 'low'], default: 'medium' },
    priority: { type: String, enum: ['critical', 'high', 'medium', 'low'], default: 'medium' },
    status: { type: String, enum: ['open', 'confirmed', 'in_progress', 'resolved', 'reopened', 'closed'], default: 'open' },
    category: { type: String, enum: ['bug', 'security', 'performance', 'code_smell', 'vulnerability'], default: 'bug' },
    file: { type: String, default: '' },
    line: { type: Number, default: 0 },
    codeSnippet: { type: String, default: '' },
    error: { type: String, default: '' },
    stackTrace: { type: String, default: '' },
    stepsToReproduce: [{ type: String }],
    rootCause: { type: String, default: '' },
    suggestedFix: { type: String, default: '' },
    confidence: { type: Number, default: 0, min: 0, max: 100 },
    detectedBy: { type: String, enum: ['ai', 'test', 'manual', 'scan'], default: 'ai' },
    testRunId: { type: Schema.Types.ObjectId, ref: 'TestRun' },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

bugSchema.index({ projectId: 1, severity: 1 });
bugSchema.index({ status: 1 });
bugSchema.index({ title: 'text', description: 'text' });

export const Bug = mongoose.model<IBug>('Bug', bugSchema);
