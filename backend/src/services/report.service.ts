import mongoose from 'mongoose';
import { Report } from '../models/Report';
import { Dog } from '../models/Dog';
import { AppError } from '../middleware/error.middleware';
import { formatPaginatedResponse, getPaginationOptions } from '../utils/pagination';

export class ReportService {
  public static async createReportByQrToken(qrToken: string, reportData: any) {
    const dog = await Dog.findOne({ qrToken });
    if (!dog) {
      throw new AppError('Dog profile not found', 404, 'DOG_NOT_FOUND');
    }

    const report = await Report.create({
      ...reportData,
      dogId: dog._id,
    });

    return report;
  }

  public static async createReport(reportData: any) {
    if (reportData.dogId && !mongoose.Types.ObjectId.isValid(reportData.dogId)) {
      throw new AppError('Invalid Dog ID', 400, 'INVALID_ID');
    }

    const report = await Report.create(reportData);
    return report;
  }

  public static async getReportsAdmin(query: any) {
    const pagination = getPaginationOptions(query.page, query.limit);

    const filter: Record<string, any> = {};
    if (query.status) filter.status = query.status;
    if (query.type) filter.type = query.type;

    const [reports, total] = await Promise.all([
      Report.find(filter)
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .populate('dogId', 'pawId name photos status'),
      Report.countDocuments(filter),
    ]);

    return formatPaginatedResponse(reports, total, pagination.page, pagination.limit);
  }

  public static async updateReportStatusAdmin(reportId: string, status: string) {
    if (!mongoose.Types.ObjectId.isValid(reportId)) {
      throw new AppError('Invalid Report ID', 400, 'INVALID_ID');
    }

    const report = await Report.findByIdAndUpdate(
      reportId,
      { status },
      { new: true, runValidators: true }
    ).populate('dogId', 'pawId name');

    if (!report) {
      throw new AppError('Report not found', 404, 'REPORT_NOT_FOUND');
    }

    return report;
  }
}
