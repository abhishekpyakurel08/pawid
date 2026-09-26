import { apiRequest } from './api';
import { CreateSightingPayload, Sighting } from '../types/sighting';

export const DEMO_SIGHTINGS: Sighting[] = [
  // Rocky's Location History Timeline
  {
    id: 'sighting-rocky-1',
    dogId: 'demo-rocky-token-1',
    location: {
      type: 'Point',
      coordinates: [85.3123, 27.7006],
      areaName: 'Ratna Park, Kathmandu',
    },
    condition: 'Healthy',
    description: 'Rocky was resting peacefully under the tree canopy near the entrance.',
    reportedAt: '2026-09-25T14:30:00.000Z',
    source: 'COMMUNITY',
    isVerified: true,
  },
  {
    id: 'sighting-rocky-2',
    dogId: 'demo-rocky-token-1',
    location: {
      type: 'Point',
      coordinates: [85.3105, 27.715],
      areaName: 'Thamel, Kathmandu',
    },
    condition: 'Healthy',
    description: 'Spotted drinking fresh water provided by local shopkeepers.',
    reportedAt: '2026-09-24T09:15:00.000Z',
    source: 'COMMUNITY',
    isVerified: true,
  },
  {
    id: 'sighting-rocky-3',
    dogId: 'demo-rocky-token-1',
    location: {
      type: 'Point',
      coordinates: [85.3138, 27.7032],
      areaName: 'New Road, Kathmandu',
    },
    condition: 'Healthy',
    description: 'Community caretaker fed dry kibble.',
    reportedAt: '2026-09-22T16:45:00.000Z',
    source: 'COMMUNITY',
    isVerified: true,
  },

  // Kali's Location History Timeline
  {
    id: 'sighting-kali-1',
    dogId: 'demo-kali-token-2',
    location: {
      type: 'Point',
      coordinates: [85.3125, 27.701],
      areaName: 'Ratna Park Bus Stop',
    },
    condition: 'Healthy',
    description: 'Kali was enjoying shade near the tea stall.',
    reportedAt: '2026-09-25T11:00:00.000Z',
    source: 'COMMUNITY',
    isVerified: true,
  },
  {
    id: 'sighting-kali-2',
    dogId: 'demo-kali-token-2',
    location: {
      type: 'Point',
      coordinates: [85.311, 27.706],
      areaName: 'Asan Bazaar, Kathmandu',
    },
    condition: 'Healthy',
    description: 'Friendly interactions with market visitors.',
    reportedAt: '2026-09-23T15:20:00.000Z',
    source: 'COMMUNITY',
    isVerified: true,
  },

  // Bruno's Location History Timeline
  {
    id: 'sighting-bruno-1',
    dogId: 'demo-bruno-token-3',
    location: {
      type: 'Point',
      coordinates: [85.3188, 27.671],
      areaName: 'Patan Durbar Square, Lalitpur',
    },
    condition: 'Injured',
    description: 'Bruno limped slightly while walking towards Krishna Mandir.',
    reportedAt: '2026-09-24T18:00:00.000Z',
    source: 'VOLUNTEER',
    isVerified: true,
  },
];

export const sightingService = {
  async submitPublicSighting(qrToken: string, payload: CreateSightingPayload): Promise<Sighting> {
    try {
      const res = await apiRequest<{ success: boolean; data: Sighting }>(
        `/public/dogs/${qrToken}/sightings`,
        {
          method: 'POST',
          body: JSON.stringify(payload),
        }
      );
      if (res?.data) return res.data;
    } catch {}

    const newSighting: Sighting = {
      id: `sighting-${Date.now()}`,
      dogId: qrToken,
      location: {
        type: 'Point',
        coordinates: [payload.longitude, payload.latitude],
        areaName: payload.areaName || 'Reported Location',
      },
      condition: payload.condition,
      description: payload.description,
      photoUrl: payload.photoUrl,
      reportedAt: new Date().toISOString(),
      source: 'COMMUNITY',
    };
    DEMO_SIGHTINGS.unshift(newSighting);
    return newSighting;
  },

  async getPublicSightingsByQr(qrToken: string): Promise<Sighting[]> {
    try {
      const res = await apiRequest<{ success: boolean; data: Sighting[] }>(
        `/public/dogs/${qrToken}/sightings`
      );
      if (res?.data && res.data.length > 0) return res.data;
    } catch {}

    // Return sightings matching qrToken or return Rocky's timeline if demo token matches
    const filtered = DEMO_SIGHTINGS.filter(
      (s) => s.dogId === qrToken || (typeof s.dogId === 'object' && (s.dogId as any).id === qrToken)
    );

    if (filtered.length > 0) return filtered;
    return DEMO_SIGHTINGS.slice(0, 3); // Default return Rocky's 3 timeline entries
  },

  async getMapSightings(): Promise<{ type: string; features: any[] }> {
    try {
      const res = await apiRequest<any>('/public/map/sightings');
      if (res?.features) return res;
    } catch {}

    return {
      type: 'FeatureCollection',
      features: DEMO_SIGHTINGS.map((s) => ({
        type: 'Feature',
        id: s.id,
        geometry: s.location,
        properties: {
          sightingId: s.id,
          condition: s.condition,
          areaName: s.location.areaName,
          reportedAt: s.reportedAt,
          source: s.source,
        },
      })),
    };
  },

  async getAllSightings(): Promise<Sighting[]> {
    try {
      const res = await apiRequest<{ success: boolean; data: Sighting[] }>('/sightings');
      if (res?.data && res.data.length > 0) return res.data;
    } catch {}

    return DEMO_SIGHTINGS;
  },

  async verifySighting(id: string): Promise<Sighting> {
    try {
      const res = await apiRequest<{ success: boolean; data: Sighting }>(`/sightings/${id}/verify`, {
        method: 'PATCH',
      });
      if (res?.data) return res.data;
    } catch {}

    const s = DEMO_SIGHTINGS.find((item) => item.id === id) || DEMO_SIGHTINGS[0];
    s.isVerified = true;
    return s;
  },
};
