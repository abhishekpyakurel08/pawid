import mongoose, { Document, Schema } from 'mongoose';
import { HEALTH_RECORD_TYPE } from '../config/constants';

export interface IHealthRecord extends Document {
  _id: mongoose.Types.ObjectId;
  dogId: mongoose.Types.ObjectId;
  type: string;
  title: string;
  description?: string;
  date: Date;
  veterinarianName?: string;
  clinicName?: string;
  verified: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const healthRecordSchema = new Schema<IHealthRecord>(
  {
    dogId: {
      type: Schema.Types.ObjectId,
      ref: 'Dog',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(HEALTH_RECORD_TYPE),
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    veterinarianName: {
      type: String,
      trim: true,
    },
    clinicName: {
      type: String,
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, any>) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const HealthRecord = mongoose.model<IHealthRecord>(
  'HealthRecord',
  healthRecordSchema
);
