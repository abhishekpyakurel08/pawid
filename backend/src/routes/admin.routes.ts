import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { SightingController } from '../controllers/sighting.controller';
import { ReportController } from '../controllers/report.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { ROLES } from '../config/constants';
import { validate } from '../middleware/validate.middleware';
import { updateReportStatusSchema } from '../validators/report.validator';

const router = Router();

router.use(authenticate, authorize(ROLES.ADMIN));

// Admin dashboard analytics
router.get('/dashboard', AdminController.getDashboard);

// User management
router.get('/users', AdminController.getUsers);
router.patch('/users/:userId/role', AdminController.updateUserRole);

// Sightings management
router.get('/sightings', SightingController.getAllSightingsAdmin);
router.delete('/sightings/:id', SightingController.deleteSightingAdmin);

// Reports management
router.get('/reports', ReportController.getReportsAdmin);
router.patch(
  '/reports/:id/status',
  validate(updateReportStatusSchema),
  ReportController.updateReportStatusAdmin
);

export default router;
