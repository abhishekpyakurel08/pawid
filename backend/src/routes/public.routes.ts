import { Router } from 'express';
import { PublicController } from '../controllers/public.controller';
import { SightingController } from '../controllers/sighting.controller';
import { ReportController } from '../controllers/report.controller';
import { HealthController } from '../controllers/health.controller';
import { validate } from '../middleware/validate.middleware';
import {
  publicSightingLimiter,
  publicReportLimiter,
} from '../middleware/rateLimit.middleware';
import { publicSightingSchema } from '../validators/sighting.validator';
import { createReportSchema } from '../validators/report.validator';
import { nearbyDogsQuerySchema } from '../validators/public.validator';

const router = Router();

// Leaflet Map GeoJSON marker endpoints
router.get('/map/dogs', PublicController.getMapDogMarkers);
router.get('/map/sightings', PublicController.getMapSightingMarkers);

// Nearby dogs query
router.get(
  '/dogs/nearby',
  validate(nearbyDogsQuerySchema),
  PublicController.getNearbyDogs
);

// Public dog profile by QR token
router.get('/dogs/:qrToken', PublicController.getPublicDogProfile);

// Public sightings by QR token
router.post(
  '/dogs/:qrToken/sightings',
  publicSightingLimiter,
  validate(publicSightingSchema),
  SightingController.createPublicSighting
);

router.get('/dogs/:qrToken/sightings', SightingController.getPublicSightingsByQr);

// Public reports by QR token
router.post(
  '/dogs/:qrToken/reports',
  publicReportLimiter,
  validate(createReportSchema),
  ReportController.createPublicReportByQr
);

// General public report submission
router.post(
  '/reports',
  publicReportLimiter,
  validate(createReportSchema),
  ReportController.createPublicReport
);

// Public health records (verified only)
router.get('/dogs/:qrToken/health', HealthController.getPublicHealthRecords);

export default router;
