import { Request, Response } from 'express';
import { sendError } from '../utils/apiResponse';

export const notFoundHandler = (req: Request, res: Response) => {
  return sendError(
    res,
    404,
    `Route ${req.originalUrl} not found on this server`,
    'ROUTE_NOT_FOUND'
  );
};
