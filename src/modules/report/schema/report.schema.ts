import { Schema, model, Document } from 'mongoose';

export interface IReport {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  profession?: string;
  favorite_colors?: string[];
}

const reportSchema = new Schema<IReport>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  profession: { type: String },
  favorite_colors: [{ type: String }],
}, {
    timestamps: true
});

export const Report = model<IReport>('Report', reportSchema);
export interface ReportDocument extends IReport, Document {};