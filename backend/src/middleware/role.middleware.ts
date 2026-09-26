import { NextFunction, Request, Response } from 'express';
import { UserRole } from '../config/constants';
import { sendError } from '../utils/apiResponse';

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 401, 'Authentication required', 'UNAUTHORIZED');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(
        res,
        403,
        'You do not have permission to perform this action',
        'FORBIDDEN'
      );
    }

    return next();
  };
};
