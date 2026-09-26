import { Schema, model, Document } from 'mongoose';

export interface IGallery extends Document {
  title: string;
  caption?: string;
  imageUrl: string;
  area: string;
  dogId?: Schema.Types.ObjectId;
  pawId?: string;
  submittedBy?: string;
  isApproved: boolean;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const gallerySchema = new Schema<IGallery>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    caption: {
      type: String,
      trim: true,
      maxlength: [500, 'Caption cannot exceed 500 characters'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    area: {
      type: String,
      required: [true, 'Area/City is required'],
      trim: true,
    },
    dogId: {
      type: Schema.Types.ObjectId,
      ref: 'Dog',
    },
    pawId: {
      type: String,
      trim: true,
    },
    submittedBy: {
      type: String,
      default: 'Community Member',
    },
    isApproved: {
      type: Boolean,
      default: true, // Auto approve public community photos in dev mode
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

gallerySchema.index({ area: 1, isApproved: 1 });
gallerySchema.index({ pawId: 1 });

export const Gallery = model<IGallery>('Gallery', gallerySchema);
