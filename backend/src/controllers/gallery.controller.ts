import { Request, Response, NextFunction } from 'express';
import { Gallery } from '../models/Gallery';

export class GalleryController {
  // Public: Get all approved gallery photos
  static async getPublicGallery(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { area, tag, pawId, page = 1, limit = 20 } = req.query;

      const filter: any = { isApproved: true };
      if (area) filter.area = new RegExp(String(area), 'i');
      if (pawId) filter.pawId = String(pawId).toUpperCase();
      if (tag) filter.tags = String(tag);

      const skip = (Number(page) - 1) * Number(limit);

      const [photos, total] = await Promise.all([
        Gallery.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(Number(limit)),
        Gallery.countDocuments(filter),
      ]);

      res.status(200).json({
        success: true,
        data: photos,
        meta: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Public: Submit a community photo to gallery
  static async submitCommunityPhoto(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title, caption, imageUrl, area, pawId, tags, submittedBy } = req.body;

      const photo = await Gallery.create({
        title,
        caption,
        imageUrl,
        area,
        pawId,
        tags: Array.isArray(tags) ? tags : tags ? [tags] : [],
        submittedBy: submittedBy || 'Community Member',
        isApproved: true,
      });

      res.status(201).json({
        success: true,
        message: 'Community photo submitted successfully',
        data: photo,
      });
    } catch (error) {
      next(error);
    }
  }

  // Admin: Moderate & Approve/Reject gallery photo
  static async updateApproval(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { isApproved } = req.body;

      const photo = await Gallery.findByIdAndUpdate(
        id,
        { isApproved: Boolean(isApproved) },
        { new: true }
      );

      if (!photo) {
        res.status(404).json({ success: false, message: 'Gallery photo not found' });
        return;
      }

      res.status(200).json({
        success: true,
        message: `Photo approval status updated to ${isApproved}`,
        data: photo,
      });
    } catch (error) {
      next(error);
    }
  }

  // Admin: Delete gallery photo
  static async deletePhoto(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const photo = await Gallery.findByIdAndDelete(id);

      if (!photo) {
        res.status(404).json({ success: false, message: 'Gallery photo not found' });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Photo removed from gallery',
      });
    } catch (error) {
      next(error);
    }
  }
}
