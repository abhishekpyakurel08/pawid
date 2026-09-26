import { Router } from 'express';
import { ReportController } from '../controllers/report.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import { ROLES } from '../config/constants';
import { updateReportStatusSchema } from '../validators/report.validator';

const router = Router();

router.use(authenticate);

router.get(
  '/admin',
  authorize(ROLES.ADMIN),
  ReportController.getReportsAdmin
);

router.patch(
  '/admin/:id/status',
  authorize(ROLES.ADMIN),
  validate(updateReportStatusSchema),
  ReportController.updateReportStatusAdmin
);

export default router;
