import { Schema, model, Document } from 'mongoose';
import { Role } from '@common/constants';

export interface IUser {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  profession?: string;
  favorite_colors?: string[];
  role?: valueof<typeof Role>;
  email_verified_at?: Date;
  deleted_at?: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  profession: { type: String },
  favorite_colors: [{ type: String }],
  role: { type: String, enum: Object.values(Role), default: Role.USER },
  email_verified_at: { type: Date },
  deleted_at: { type: Date }
}, {
    timestamps: true
});

export const User = model<IUser>('User', userSchema);
export interface UserDocument extends IUser, Document {};