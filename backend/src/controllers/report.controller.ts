import { Request, Response, NextFunction } from 'express';
import { ReportService } from '../services/report.service';
import { sendSuccess } from '../utils/apiResponse';
import { AdminService } from '../services/admin.service';

export class ReportController {
  public static createPublicReportByQr = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { qrToken } = req.params;
      const report = await ReportService.createReportByQrToken(qrToken, req.body);
      return sendSuccess({
        res,
        statusCode: 201,
        message: 'Report submitted successfully',
        data: report,
      });
    } catch (error) {
      next(error);
    }
  };

  public static createPublicReport = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const report = await ReportService.createReport(req.body);
      return sendSuccess({
        res,
        statusCode: 201,
        message: 'Report submitted successfully',
        data: report,
      });
    } catch (error) {
      next(error);
    }
  };

  public static getReportsAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await ReportService.getReportsAdmin(req.query);
      return sendSuccess({
        res,
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  };

  public static updateReportStatusAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user!.id;

      const report = await ReportService.updateReportStatusAdmin(id, status);

      await AdminService.createAuditLog(
        userId,
        'REPORT_STATUS_CHANGED',
        'Report',
        report.id,
        { status },
        req.ip
      );

      return sendSuccess({
        res,
        message: 'Report status updated successfully',
        data: report,
      });
    } catch (error) {
      next(error);
    }
  };
}
