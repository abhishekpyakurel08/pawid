export interface GeoJSONPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface DogPhoto {
  url: string;
  publicId?: string;
}

export interface PublicDogProfile {
  pawId: string;
  name?: string;
  species: string;
  sex: string;
  approximateAge?: number;
  color?: string;
  distinctiveFeatures?: string;
  photos: DogPhoto[];
  status: string;
  publicLocationName?: string;
  vaccinationStatus: string;
  sterilizationStatus: string;
  lastReportedSighting?: {
    locationName?: string;
    reportedAt: Date;
  };
}
