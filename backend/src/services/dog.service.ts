import mongoose from 'mongoose';
import { Dog, IDog } from '../models/Dog';
import { Sighting } from '../models/Sighting';
import { AppError } from '../middleware/error.middleware';
import { generatePawId } from '../utils/generatePawId';
import { generateQrToken } from '../utils/generateQrToken';
import { QrService } from './qr.service';
import { DOG_STATUS } from '../config/constants';
import { formatPaginatedResponse, getPaginationOptions } from '../utils/pagination';
import { PublicDogProfile } from '../types/dog.types';

export class DogService {
  public static async registerDog(data: Partial<IDog>, createdByUserId: string) {
    const pawId = generatePawId();
    const qrToken = generateQrToken();

    const dog = await Dog.create({
      ...data,
      pawId,
      qrToken,
      createdBy: createdByUserId,
    });

    const publicUrl = QrService.getPublicUrl(qrToken);
    const qrCode = await QrService.generateQrDataUrl(qrToken);

    return {
      dog,
      pawId: dog.pawId,
      qrToken: dog.qrToken,
      publicUrl,
      qrCode,
    };
  }

  public static async regenerateQrToken(dogId: string) {
    const dog = await Dog.findById(dogId);
    if (!dog) {
      throw new AppError('Dog not found', 404, 'DOG_NOT_FOUND');
    }

    const newQrToken = generateQrToken();
    dog.qrToken = newQrToken;
    await dog.save();

    const publicUrl = QrService.getPublicUrl(newQrToken);
    const qrCode = await QrService.generateQrDataUrl(newQrToken);

    return {
      pawId: dog.pawId,
      qrToken: dog.qrToken,
      publicUrl,
      qrCode,
    };
  }

  public static async getPublicProfileByQrToken(qrToken: string): Promise<PublicDogProfile> {
    const dog = await Dog.findOne({ qrToken });
    if (!dog || dog.status === DOG_STATUS.INACTIVE) {
      throw new AppError('Dog profile not found or inactive', 404, 'DOG_NOT_FOUND');
    }

    // Get last reported sighting
    const lastSighting = await Sighting.findOne({ dogId: dog._id })
      .sort({ createdAt: -1 })
      .select('locationName createdAt');

    // Strictly sanitize output to exclude private registration coordinates, createdBy, etc.
    const publicProfile: PublicDogProfile = {
      pawId: dog.pawId,
      name: dog.name,
      species: dog.species,
      sex: dog.sex,
      approximateAge: dog.approximateAge,
      color: dog.color,
      distinctiveFeatures: dog.distinctiveFeatures,
      photos: dog.photos,
      status: dog.status,
      publicLocationName: dog.publicLocationName || dog.registrationLocationName,
      vaccinationStatus: dog.vaccinationStatus,
      sterilizationStatus: dog.sterilizationStatus,
      lastReportedSighting: lastSighting
        ? {
            locationName: lastSighting.locationName,
            reportedAt: lastSighting.createdAt,
          }
        : undefined,
    };

    return publicProfile;
  }

  public static async getDogs(query: any) {
    const { page, limit, skip } = getPaginationOptions(query.page, query.limit);

    const filter: Record<string, any> = {};
    if (query.status) filter.status = query.status;
    if (query.sex) filter.sex = query.sex;
    if (query.vaccinationStatus) filter.vaccinationStatus = query.vaccinationStatus;
    if (query.sterilizationStatus) filter.sterilizationStatus = query.sterilizationStatus;

    if (query.q) {
      const searchRegex = new RegExp(query.q, 'i');
      filter.$or = [
        { pawId: searchRegex },
        { name: searchRegex },
        { color: searchRegex },
        { publicLocationName: searchRegex },
        { registrationLocationName: searchRegex },
      ];
    }

    const [dogs, total] = await Promise.all([
      Dog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('createdBy', 'name email role'),
      Dog.countDocuments(filter),
    ]);

    return formatPaginatedResponse(dogs, total, page, limit);
  }

  public static async getDogById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid Dog ID', 400, 'INVALID_ID');
    }
    const dog = await Dog.findById(id).populate('createdBy', 'name email role');
    if (!dog) {
      throw new AppError('Dog not found', 404, 'DOG_NOT_FOUND');
    }
    return dog;
  }

  public static async updateDog(id: string, updates: Partial<IDog>) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid Dog ID', 400, 'INVALID_ID');
    }
    // Prevent updating pawId or qrToken directly through edit API
    delete updates.pawId;
    delete updates.qrToken;

    const dog = await Dog.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!dog) {
      throw new AppError('Dog not found', 404, 'DOG_NOT_FOUND');
    }
    return dog;
  }

  public static async deleteDog(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid Dog ID', 400, 'INVALID_ID');
    }
    // Soft deletion: mark status as INACTIVE
    const dog = await Dog.findByIdAndUpdate(
      id,
      { status: DOG_STATUS.INACTIVE },
      { new: true }
    );
    if (!dog) {
      throw new AppError('Dog not found', 404, 'DOG_NOT_FOUND');
    }
    return dog;
  }

  public static async getNearbyDogs(lat: number, lng: number, radiusInMeters: number = 2000) {
    const dogs = await Dog.find({
      status: { $ne: DOG_STATUS.INACTIVE },
      registrationLocation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          $maxDistance: radiusInMeters,
        },
      },
    }).limit(50);

    // Return sanitized public info without revealing exact registration coordinates
    return dogs.map((dog) => ({
      pawId: dog.pawId,
      qrToken: dog.qrToken,
      name: dog.name,
      species: dog.species,
      sex: dog.sex,
      approximateAge: dog.approximateAge,
      color: dog.color,
      photos: dog.photos,
      status: dog.status,
      publicLocationName: dog.publicLocationName || dog.registrationLocationName,
      vaccinationStatus: dog.vaccinationStatus,
      sterilizationStatus: dog.sterilizationStatus,
    }));
  }
}
