import { Router } from 'express';
import { SightingController } from '../controllers/sighting.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { ROLES } from '../config/constants';

const router = Router();

router.use(authenticate);

// Admin sightings endpoints
router.get(
  '/admin',
  authorize(ROLES.ADMIN),
  SightingController.getAllSightingsAdmin
);

router.delete(
  '/admin/:id',
  authorize(ROLES.ADMIN),
  SightingController.deleteSightingAdmin
);

export default router;
