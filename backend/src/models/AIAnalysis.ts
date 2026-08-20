import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAIAnalysis extends Document {
  projectId: Types.ObjectId;
  bugId: Types.ObjectId;
  type: 'analysis' | 'root_cause' | 'fix' | 'explanation' | 'test_generation';
  prompt: string;
  response: string;
  model: string;
  confidence: number;
  createdAt: Date;
}

const aiAnalysisSchema = new Schema<IAIAnalysis>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    bugId: { type: Schema.Types.ObjectId, ref: 'Bug' },
    type: { type: String, enum: ['analysis', 'root_cause', 'fix', 'explanation', 'test_generation'], required: true },
    prompt: { type: String, required: true },
    response: { type: String, required: true },
    model: { type: String, default: 'demo' },
    confidence: { type: Number, default: 0 },
  },
  { timestamps: true }
);

aiAnalysisSchema.index({ projectId: 1 });
aiAnalysisSchema.index({ bugId: 1 });

export const AIAnalysis = mongoose.model<IAIAnalysis>('AIAnalysis', aiAnalysisSchema);
