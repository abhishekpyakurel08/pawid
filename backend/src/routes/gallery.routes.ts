import { Router } from 'express';
import { GalleryController } from '../controllers/gallery.controller';

const router = Router();

// Public Gallery Endpoints
router.get('/', GalleryController.getPublicGallery);
router.post('/submit', GalleryController.submitCommunityPhoto);

// Admin Moderation Endpoints
router.patch('/:id/approve', GalleryController.updateApproval);
router.delete('/:id', GalleryController.deletePhoto);

export default router;
