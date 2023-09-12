import { Schema, model, Document } from 'mongoose';
import { VERIFICATION_CODE_TYPE, VERIFICATION_CODE_CHANNEL } from '@common/constants';

export interface IVerificationCode {
  attempts: number;
  channel: valueof<typeof VERIFICATION_CODE_CHANNEL>;
  code: string;
  medium: string;
  type: valueof<typeof VERIFICATION_CODE_TYPE>;
  reference_id?: string;
  expires_at?: Date;
}

const verificationCodeSchema = new Schema<IVerificationCode>({
  attempts: { type: Number, default: 0 },
  channel: { type: String, required: true, enum: VERIFICATION_CODE_CHANNEL },
  code: { type: String, required: true },
  medium: { type: String, required: true },
  type: { type: String, required: true, enum: VERIFICATION_CODE_TYPE },
  reference_id: { type: String },
  expires_at: { type: Date }
}, {
    timestamps: true
});

export const VerificationCode = model<IVerificationCode>('VerificationCode', verificationCodeSchema);
export interface VerificationCodeDocument extends IVerificationCode, Document {};