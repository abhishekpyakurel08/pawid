import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service';
import { sendSuccess } from '../utils/apiResponse';

export class AdminController {
  public static getDashboard = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await AdminService.getDashboardMetrics();
      return sendSuccess({
        res,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public static getUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await AdminService.getUsers(req.query);
      return sendSuccess({
        res,
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  };

  public static updateUserRole = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req.params;
      const { role } = req.body;
      const adminUserId = req.user!.id;

      const updatedUser = await AdminService.updateUserRole(userId, role);

      await AdminService.createAuditLog(
        adminUserId,
        'USER_ROLE_CHANGED',
        'User',
        userId,
        { newRole: role },
        req.ip
      );

      return sendSuccess({
        res,
        message: 'User role updated successfully',
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  };
}
