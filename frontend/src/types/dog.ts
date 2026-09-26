export type Sex = 'Male' | 'Female' | 'Unknown';
export type DogStatus = 'Active' | 'Deactivated' | 'Missing' | 'Deceased';
export type VaccinationStatus = 'Vaccinated' | 'Unvaccinated' | 'Unknown';
export type SterilizationStatus = 'Sterilized' | 'Unsterilized' | 'Unknown';

export interface DogPhoto {
  url: string;
  publicId?: string;
  isPrimary?: boolean;
}

export interface Dog {
  id: string;
  qrToken: string;
  pawId: string;
  name?: string;
  sex: Sex;
  approximateAge?: string;
  color?: string;
  distinctiveFeatures?: string;
  area: string;
  status: DogStatus;
  vaccinationStatus: VaccinationStatus;
  sterilizationStatus: SterilizationStatus;
  photos: DogPhoto[];
  registrationLocation?: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  lastSeenArea?: string;
  lastSeenDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DogFilterParams {
  search?: string;
  area?: string;
  sex?: Sex;
  status?: DogStatus;
  vaccinationStatus?: VaccinationStatus;
  sterilizationStatus?: SterilizationStatus;
  page?: number;
  limit?: number;
}
