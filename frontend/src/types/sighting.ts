export type SightingCondition = 'Healthy' | 'Injured' | 'Sick' | 'Unknown';

export interface Sighting {
  id: string;
  dogId: string | { id: string; pawId: string; name?: string; photos?: { url: string }[] };
  location: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
    areaName?: string;
  };
  condition: SightingCondition;
  photoUrl?: string;
  description?: string;
  reportedAt: string;
  source: 'COMMUNITY' | 'VOLUNTEER';
  isVerified?: boolean;
}

export interface CreateSightingPayload {
  longitude: number;
  latitude: number;
  areaName?: string;
  condition: SightingCondition;
  description?: string;
  photoUrl?: string;
  consentAgreed: boolean;
}
