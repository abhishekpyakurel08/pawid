import { Request, Response, NextFunction } from 'express';
import { HealthService } from '../services/health.service';
import { sendSuccess } from '../utils/apiResponse';
import { AdminService } from '../services/admin.service';

export class HealthController {
  public static createHealthRecord = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user!.id;
      const userRole = req.user!.role;
      const record = await HealthService.createHealthRecord(
        req.body,
        userId,
        userRole
      );

      await AdminService.createAuditLog(
        userId,
        'HEALTH_RECORD_CREATED',
        'HealthRecord',
        record.id,
        { dogId: record.dogId, type: record.type },
        req.ip
      );

      return sendSuccess({
        res,
        statusCode: 201,
        message: 'Health record created successfully',
        data: record,
      });
    } catch (error) {
      next(error);
    }
  };

  public static updateHealthRecord = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const userRole = req.user!.role;

      const record = await HealthService.updateHealthRecord(
        id,
        req.body,
        userRole
      );

      await AdminService.createAuditLog(
        userId,
        'HEALTH_RECORD_UPDATED',
        'HealthRecord',
        record.id,
        { updates: req.body },
        req.ip
      );

      return sendSuccess({
        res,
        message: 'Health record updated successfully',
        data: record,
      });
    } catch (error) {
      next(error);
    }
  };

  public static getHealthRecordsByDogId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { dogId } = req.params;
      const records = await HealthService.getHealthRecordsByDogId(dogId);
      return sendSuccess({
        res,
        data: records,
      });
    } catch (error) {
      next(error);
    }
  };

  public static getPublicHealthRecords = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { qrToken } = req.params;
      const records = await HealthService.getPublicHealthRecordsByQrToken(qrToken);
      return sendSuccess({
        res,
        data: records,
      });
    } catch (error) {
      next(error);
    }
  };
}
