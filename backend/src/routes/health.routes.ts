import { Router } from 'express';
import { HealthController } from '../controllers/health.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import { ROLES } from '../config/constants';
import {
  createHealthRecordSchema,
  updateHealthRecordSchema,
} from '../validators/health.validator';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  authorize(ROLES.ADMIN, ROLES.VOLUNTEER),
  validate(createHealthRecordSchema),
  HealthController.createHealthRecord
);

router.patch(
  '/:id',
  authorize(ROLES.ADMIN, ROLES.VOLUNTEER),
  validate(updateHealthRecordSchema),
  HealthController.updateHealthRecord
);

export default router;
