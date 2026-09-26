import { Router } from 'express';
import authRoutes from './auth.routes';
import dogRoutes from './dog.routes';
import sightingRoutes from './sighting.routes';
import healthRoutes from './health.routes';
import reportRoutes from './report.routes';
import publicRoutes from './public.routes';
import uploadRoutes from './upload.routes';
import adminRoutes from './admin.routes';
import galleryRoutes from './gallery.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/dogs', dogRoutes);
router.use('/sightings', sightingRoutes);
router.use('/health', healthRoutes);
router.use('/reports', reportRoutes);
router.use('/public', publicRoutes);
router.use('/uploads', uploadRoutes);
router.use('/admin', adminRoutes);
router.use('/gallery', galleryRoutes);

export default router;
