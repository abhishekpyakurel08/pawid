import mongoose, { Document, Schema } from 'mongoose';
import { REPORT_STATUS, REPORT_TYPE } from '../config/constants';

export interface IReport extends Document {
  _id: mongoose.Types.ObjectId;
  dogId?: mongoose.Types.ObjectId;
  type: string;
  description: string;
  photoUrl?: string;
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new Schema<IReport>(
  {
    dogId: {
      type: Schema.Types.ObjectId,
      ref: 'Dog',
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(REPORT_TYPE),
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    photoUrl: {
      type: String,
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
      },
    },
    status: {
      type: String,
      enum: Object.values(REPORT_STATUS),
      default: REPORT_STATUS.PENDING,
      index: true,
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

reportSchema.index({ createdAt: -1 });

export const Report = mongoose.model<IReport>('Report', reportSchema);
