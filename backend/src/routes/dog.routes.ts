import { Router } from 'express';
import { DogController } from '../controllers/dog.controller';
import { SightingController } from '../controllers/sighting.controller';
import { HealthController } from '../controllers/health.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import { ROLES } from '../config/constants';
import {
  createDogSchema,
  queryDogSchema,
  updateDogSchema,
} from '../validators/dog.validator';
import { dogSightingSchema } from '../validators/sighting.validator';

const router = Router();

router.use(authenticate);

// Search endpoint
router.get('/search', validate(queryDogSchema), DogController.searchDogs);

// Dog CRUD
router.post(
  '/',
  authorize(ROLES.ADMIN, ROLES.VOLUNTEER),
  validate(createDogSchema),
  DogController.createDog
);

router.get('/', validate(queryDogSchema), DogController.getDogs);
router.get('/:id', DogController.getDogById);

router.patch(
  '/:id',
  authorize(ROLES.ADMIN, ROLES.VOLUNTEER),
  validate(updateDogSchema),
  DogController.updateDog
);

router.delete(
  '/:id',
  authorize(ROLES.ADMIN),
  DogController.deleteDog
);

// QR Regeneration (Admin only)
router.post(
  '/:id/qr/regenerate',
  authorize(ROLES.ADMIN),
  DogController.regenerateQr
);

// Sightings by dog
router.post(
  '/:id/sightings',
  authorize(ROLES.ADMIN, ROLES.VOLUNTEER),
  validate(dogSightingSchema),
  SightingController.createAuthenticatedSighting
);

router.get('/:id/sightings', SightingController.getSightingsByDogId);

// Health records by dog
router.get('/:dogId/health', HealthController.getHealthRecordsByDogId);

export default router;
