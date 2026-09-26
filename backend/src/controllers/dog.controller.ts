import { Request, Response, NextFunction } from 'express';
import { DogService } from '../services/dog.service';
import { sendSuccess } from '../utils/apiResponse';
import { AdminService } from '../services/admin.service';

export class DogController {
  public static createDog = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const result = await DogService.registerDog(req.body, userId);

      await AdminService.createAuditLog(
        userId,
        'DOG_REGISTERED',
        'Dog',
        result.dog.id,
        { pawId: result.pawId },
        req.ip
      );

      return sendSuccess({
        res,
        statusCode: 201,
        message: 'Dog registered successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  public static getDogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await DogService.getDogs(req.query);
      return sendSuccess({
        res,
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  };

  public static searchDogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await DogService.getDogs(req.query);
      return sendSuccess({
        res,
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  };

  public static getDogById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dog = await DogService.getDogById(req.params.id);
      return sendSuccess({
        res,
        data: dog,
      });
    } catch (error) {
      next(error);
    }
  };

  public static updateDog = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const dog = await DogService.updateDog(req.params.id, req.body);

      await AdminService.createAuditLog(
        userId,
        'DOG_UPDATED',
        'Dog',
        dog.id,
        { updates: req.body },
        req.ip
      );

      return sendSuccess({
        res,
        message: 'Dog updated successfully',
        data: dog,
      });
    } catch (error) {
      next(error);
    }
  };

  public static deleteDog = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const dog = await DogService.deleteDog(req.params.id);

      await AdminService.createAuditLog(
        userId,
        'DOG_DEACTIVATED',
        'Dog',
        dog.id,
        {},
        req.ip
      );

      return sendSuccess({
        res,
        message: 'Dog deactivated successfully',
        data: dog,
      });
    } catch (error) {
      next(error);
    }
  };

  public static regenerateQr = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const result = await DogService.regenerateQrToken(req.params.id);

      await AdminService.createAuditLog(
        userId,
        'QR_REGENERATED',
        'Dog',
        req.params.id,
        { newQrToken: result.qrToken },
        req.ip
      );

      return sendSuccess({
        res,
        message: 'QR token regenerated successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
