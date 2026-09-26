import mongoose from 'mongoose';
import { Sighting } from '../models/Sighting';
import { Dog } from '../models/Dog';
import { AppError } from '../middleware/error.middleware';
import { formatPaginatedResponse, getPaginationOptions } from '../utils/pagination';

export class SightingService {
  public static async createPublicSighting(qrToken: string, sightingData: any) {
    const dog = await Dog.findOne({ qrToken });
    if (!dog) {
      throw new AppError('Dog profile not found', 404, 'DOG_NOT_FOUND');
    }

    if (!sightingData.voluntarilySharedLocation) {
      throw new AppError(
        'voluntarilySharedLocation must be true to record location',
        400,
        'LOCATION_CONSENT_REQUIRED'
      );
    }

    const sighting = await Sighting.create({
      ...sightingData,
      dogId: dog._id,
    });

    return sighting;
  }

  public static async createAuthenticatedSighting(
    dogId: string,
    sightingData: any,
    userId: string
  ) {
    if (!mongoose.Types.ObjectId.isValid(dogId)) {
      throw new AppError('Invalid Dog ID', 400, 'INVALID_ID');
    }

    const dog = await Dog.findById(dogId);
    if (!dog) {
      throw new AppError('Dog not found', 404, 'DOG_NOT_FOUND');
    }

    if (!sightingData.voluntarilySharedLocation) {
      throw new AppError(
        'voluntarilySharedLocation must be true to record location',
        400,
        'LOCATION_CONSENT_REQUIRED'
      );
    }

    const sighting = await Sighting.create({
      ...sightingData,
      dogId: dog._id,
      submittedByUserId: userId,
    });

    return sighting;
  }

  public static async getSightingsByQrToken(qrToken: string, page?: any, limit?: any) {
    const dog = await Dog.findOne({ qrToken });
    if (!dog) {
      throw new AppError('Dog profile not found', 404, 'DOG_NOT_FOUND');
    }

    const pagination = getPaginationOptions(page, limit);

    const [sightings, total] = await Promise.all([
      Sighting.find({ dogId: dog._id })
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .select('locationName condition photoUrl description locationSource createdAt'),
      Sighting.countDocuments({ dogId: dog._id }),
    ]);

    return formatPaginatedResponse(sightings, total, pagination.page, pagination.limit);
  }

  public static async getSightingsByDogId(dogId: string, page?: any, limit?: any) {
    if (!mongoose.Types.ObjectId.isValid(dogId)) {
      throw new AppError('Invalid Dog ID', 400, 'INVALID_ID');
    }

    const pagination = getPaginationOptions(page, limit);

    const [sightings, total] = await Promise.all([
      Sighting.find({ dogId })
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .populate('submittedByUserId', 'name role'),
      Sighting.countDocuments({ dogId }),
    ]);

    return formatPaginatedResponse(sightings, total, pagination.page, pagination.limit);
  }

  public static async getAllSightingsAdmin(query: any) {
    const pagination = getPaginationOptions(query.page, query.limit);

    const [sightings, total] = await Promise.all([
      Sighting.find()
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .populate('dogId', 'pawId name photos')
        .populate('submittedByUserId', 'name email role'),
      Sighting.countDocuments(),
    ]);

    return formatPaginatedResponse(sightings, total, pagination.page, pagination.limit);
  }

  public static async deleteSightingAdmin(sightingId: string) {
    if (!mongoose.Types.ObjectId.isValid(sightingId)) {
      throw new AppError('Invalid Sighting ID', 400, 'INVALID_ID');
    }

    const sighting = await Sighting.findByIdAndDelete(sightingId);
    if (!sighting) {
      throw new AppError('Sighting not found', 404, 'SIGHTING_NOT_FOUND');
    }

    return sighting;
  }
}
