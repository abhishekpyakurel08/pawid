import mongoose from 'mongoose';
import { HealthRecord } from '../models/HealthRecord';
import { Dog } from '../models/Dog';
import { AppError } from '../middleware/error.middleware';
import { ROLES } from '../config/constants';

export class HealthService {
  public static async createHealthRecord(
    data: any,
    userId: string,
    userRole: string
  ) {
    if (!mongoose.Types.ObjectId.isValid(data.dogId)) {
      throw new AppError('Invalid Dog ID', 400, 'INVALID_ID');
    }

    const dog = await Dog.findById(data.dogId);
    if (!dog) {
      throw new AppError('Dog not found', 404, 'DOG_NOT_FOUND');
    }

    // Only Admin can create verified records directly; Volunteers create unverified ones
    const isVerified = userRole === ROLES.ADMIN ? data.verified ?? false : false;

    const healthRecord = await HealthRecord.create({
      ...data,
      verified: isVerified,
      createdBy: userId,
    });

    return healthRecord;
  }

  public static async updateHealthRecord(
    recordId: string,
    updates: any,
    userRole: string
  ) {
    if (!mongoose.Types.ObjectId.isValid(recordId)) {
      throw new AppError('Invalid Health Record ID', 400, 'INVALID_ID');
    }

    // Only ADMIN can change verified status
    if (updates.verified !== undefined && userRole !== ROLES.ADMIN) {
      throw new AppError(
        'Only administrators can verify health records',
        403,
        'FORBIDDEN'
      );
    }

    const healthRecord = await HealthRecord.findByIdAndUpdate(recordId, updates, {
      new: true,
      runValidators: true,
    });

    if (!healthRecord) {
      throw new AppError('Health record not found', 404, 'HEALTH_RECORD_NOT_FOUND');
    }

    return healthRecord;
  }

  public static async getHealthRecordsByDogId(dogId: string) {
    if (!mongoose.Types.ObjectId.isValid(dogId)) {
      throw new AppError('Invalid Dog ID', 400, 'INVALID_ID');
    }

    return HealthRecord.find({ dogId })
      .sort({ date: -1 })
      .populate('createdBy', 'name role');
  }

  public static async getPublicHealthRecordsByQrToken(qrToken: string) {
    const dog = await Dog.findOne({ qrToken });
    if (!dog) {
      throw new AppError('Dog not found', 404, 'DOG_NOT_FOUND');
    }

    // Public users see verified records
    return HealthRecord.find({ dogId: dog._id, verified: true })
      .sort({ date: -1 })
      .select('type title description date clinicName verified');
  }
}
