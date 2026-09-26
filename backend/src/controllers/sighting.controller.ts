import { Request, Response, NextFunction } from 'express';
import { SightingService } from '../services/sighting.service';
import { sendSuccess } from '../utils/apiResponse';

export class SightingController {
  public static createPublicSighting = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { qrToken } = req.params;
      const sighting = await SightingService.createPublicSighting(qrToken, req.body);
      return sendSuccess({
        res,
        statusCode: 201,
        message: 'Sighting reported successfully',
        data: sighting,
      });
    } catch (error) {
      next(error);
    }
  };

  public static createAuthenticatedSighting = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const sighting = await SightingService.createAuthenticatedSighting(
        id,
        req.body,
        userId
      );
      return sendSuccess({
        res,
        statusCode: 201,
        message: 'Sighting recorded successfully',
        data: sighting,
      });
    } catch (error) {
      next(error);
    }
  };

  public static getPublicSightingsByQr = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { qrToken } = req.params;
      const result = await SightingService.getSightingsByQrToken(
        qrToken,
        req.query.page,
        req.query.limit
      );
      return sendSuccess({
        res,
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  };

  public static getSightingsByDogId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const result = await SightingService.getSightingsByDogId(
        id,
        req.query.page,
        req.query.limit
      );
      return sendSuccess({
        res,
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  };

  public static getAllSightingsAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await SightingService.getAllSightingsAdmin(req.query);
      return sendSuccess({
        res,
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  };

  public static deleteSightingAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const sighting = await SightingService.deleteSightingAdmin(id);
      return sendSuccess({
        res,
        message: 'Sighting deleted successfully',
        data: sighting,
      });
    } catch (error) {
      next(error);
    }
  };
}
