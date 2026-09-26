import { Request, Response, NextFunction } from 'express';
import { DogService } from '../services/dog.service';
import { SightingService } from '../services/sighting.service';
import { Dog } from '../models/Dog';
import { Sighting } from '../models/Sighting';
import { sendSuccess } from '../utils/apiResponse';
import { DOG_STATUS } from '../config/constants';

export class PublicController {
  public static getPublicDogProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { qrToken } = req.params;
      const profile = await DogService.getPublicProfileByQrToken(qrToken);
      return sendSuccess({
        res,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  };

  public static getNearbyDogs = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const lat = parseFloat(req.query.lat as string);
      const lng = parseFloat(req.query.lng as string);
      const radius = req.query.radius ? parseFloat(req.query.radius as string) : 2000;

      const dogs = await DogService.getNearbyDogs(lat, lng, radius);
      return sendSuccess({
        res,
        data: dogs,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Leaflet Map Markers endpoint for public web app.
   * Returns GeoJSON & marker properties (e.g., markerColor: "red" for missing, "green" for active).
   */
  public static getMapDogMarkers = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dogs = await Dog.find({ status: { $ne: DOG_STATUS.INACTIVE } })
        .select('pawId name species sex status registrationLocation publicLocationName photos')
        .limit(200);

      const markers = dogs.map((dog) => {
        let markerColor = 'red'; // Default red dot as requested by user
        if (dog.status === DOG_STATUS.ACTIVE) markerColor = 'red'; // Red dot for community dog pin
        if (dog.status === DOG_STATUS.MISSING) markerColor = 'orange';
        if (dog.status === DOG_STATUS.ADOPTED) markerColor = 'blue';

        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            // Coordinates in Leaflet format or GeoJSON [lng, lat]
            coordinates: dog.registrationLocation.coordinates,
          },
          properties: {
            pawId: dog.pawId,
            name: dog.name || 'Unnamed Dog',
            status: dog.status,
            sex: dog.sex,
            publicLocationName: dog.publicLocationName || 'Community Area',
            photoUrl: dog.photos[0]?.url || null,
            markerColor,
            markerIcon: 'dog-marker-red',
          },
        };
      });

      return sendSuccess({
        res,
        data: {
          type: 'FeatureCollection',
          features: markers,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Leaflet Map Sighting Markers endpoint.
   */
  public static getMapSightingMarkers = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const sightings = await Sighting.find()
        .sort({ createdAt: -1 })
        .limit(100)
        .populate('dogId', 'pawId name status photos');

      const markers = sightings.map((sighting) => ({
        type: 'Feature',
        geometry: sighting.location,
        properties: {
          sightingId: sighting._id,
          dogId: (sighting.dogId as any)?._id,
          pawId: (sighting.dogId as any)?.pawId,
          dogName: (sighting.dogId as any)?.name || 'Unnamed Dog',
          condition: sighting.condition,
          locationName: sighting.locationName,
          photoUrl: sighting.photoUrl,
          reportedAt: sighting.createdAt,
          markerColor: 'yellow',
          markerIcon: 'sighting-marker-yellow',
        },
      }));

      return sendSuccess({
        res,
        data: {
          type: 'FeatureCollection',
          features: markers,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
