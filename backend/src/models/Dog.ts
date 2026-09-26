import mongoose, { Document, Schema } from 'mongoose';
import {
  DOG_SEX,
  DOG_SPECIES,
  DOG_STATUS,
  STERILIZATION_STATUS,
  VACCINATION_STATUS,
} from '../config/constants';

export interface IDogPhoto {
  url: string;
  publicId?: string;
}

export interface IDog extends Document {
  _id: mongoose.Types.ObjectId;
  pawId: string;
  qrToken: string;
  name?: string;
  species: string;
  sex: string;
  approximateAge?: number;
  color?: string;
  distinctiveFeatures?: string;
  photos: IDogPhoto[];
  status: string;
  sterilizationStatus: string;
  vaccinationStatus: string;
  registrationLocation: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  registrationLocationName?: string;
  publicLocationName?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const photoSchema = new Schema<IDogPhoto>(
  {
    url: { type: String, required: true },
    publicId: { type: String },
  },
  { _id: false }
);

const dogSchema = new Schema<IDog>(
  {
    pawId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    qrToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
      index: true,
    },
    species: {
      type: String,
      enum: Object.values(DOG_SPECIES),
      default: DOG_SPECIES.DOG,
    },
    sex: {
      type: String,
      enum: Object.values(DOG_SEX),
      default: DOG_SEX.UNKNOWN,
    },
    approximateAge: {
      type: Number,
      min: 0,
      max: 30,
    },
    color: {
      type: String,
      trim: true,
      index: true,
    },
    distinctiveFeatures: {
      type: String,
      trim: true,
    },
    photos: {
      type: [photoSchema],
      default: [],
    },
    status: {
      type: String,
      enum: Object.values(DOG_STATUS),
      default: DOG_STATUS.ACTIVE,
      index: true,
    },
    sterilizationStatus: {
      type: String,
      enum: Object.values(STERILIZATION_STATUS),
      default: STERILIZATION_STATUS.UNKNOWN,
    },
    vaccinationStatus: {
      type: String,
      enum: Object.values(VACCINATION_STATUS),
      default: VACCINATION_STATUS.UNKNOWN,
    },
    registrationLocation: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: function (coords: number[]) {
            return (
              Array.isArray(coords) &&
              coords.length === 2 &&
              coords[0] >= -180 &&
              coords[0] <= 180 &&
              coords[1] >= -90 &&
              coords[1] <= 90
            );
          },
          message: 'Coordinates must be [longitude (-180 to 180), latitude (-90 to 90)]',
        },
      },
    },
    registrationLocationName: {
      type: String,
      trim: true,
    },
    publicLocationName: {
      type: String,
      trim: true,
      index: true,
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

dogSchema.index({ registrationLocation: '2dsphere' });

export const Dog = mongoose.model<IDog>('Dog', dogSchema);
