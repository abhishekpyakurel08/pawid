import mongoose, { Document, Schema } from 'mongoose';
import { LOCATION_SOURCE, SIGHTING_CONDITION } from '../config/constants';

export interface ISighting extends Document {
  _id: mongoose.Types.ObjectId;
  dogId: mongoose.Types.ObjectId;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  locationName?: string;
  condition: string;
  photoUrl?: string;
  description?: string;
  locationSource: string;
  voluntarilySharedLocation: boolean;
  submittedByUserId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const sightingSchema = new Schema<ISighting>(
  {
    dogId: {
      type: Schema.Types.ObjectId,
      ref: 'Dog',
      required: true,
      index: true,
    },
    location: {
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
    locationName: {
      type: String,
      trim: true,
    },
    condition: {
      type: String,
      enum: Object.values(SIGHTING_CONDITION),
      default: SIGHTING_CONDITION.UNKNOWN,
    },
    photoUrl: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    locationSource: {
      type: String,
      enum: Object.values(LOCATION_SOURCE),
      required: true,
    },
    voluntarilySharedLocation: {
      type: Boolean,
      required: true,
      validate: {
        validator: function (val: boolean) {
          return val === true;
        },
        message: 'voluntarilySharedLocation must be true to process location data',
      },
    },
    submittedByUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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

sightingSchema.index({ location: '2dsphere' });
sightingSchema.index({ createdAt: -1 });

export const Sighting = mongoose.model<ISighting>('Sighting', sightingSchema);
