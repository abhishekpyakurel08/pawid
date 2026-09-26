import { Request, Response, NextFunction } from 'express';
import { UploadService } from '../services/upload.service';
import { sendSuccess } from '../utils/apiResponse';

export class UploadController {
  public static uploadImage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await UploadService.processUploadedFile(req.file);
      return sendSuccess({
        res,
        statusCode: 201,
        message: 'Image uploaded successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
