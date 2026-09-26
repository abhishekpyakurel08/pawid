import { apiRequest } from './api';
import { Dog, DogFilterParams } from '../types/dog';

export const DEMO_DOGS: Dog[] = [
  {
    id: 'demo-1',
    qrToken: 'demo-rocky-token-1',
    pawId: 'PAW-NP-A8F42K',
    name: 'Rocky',
    sex: 'Male',
    approximateAge: '3 years',
    color: 'Brown & White',
    distinctiveFeatures: 'White patch on left ear',
    area: 'Kathmandu',
    status: 'Active',
    vaccinationStatus: 'Vaccinated',
    sterilizationStatus: 'Sterilized',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
        isPrimary: true,
      },
    ],
    registrationLocation: {
      type: 'Point',
      coordinates: [85.324, 27.7172],
    },
    lastSeenArea: 'Durbar Marg, Kathmandu',
    lastSeenDate: new Date().toISOString(),
    createdAt: '2026-01-15T10:00:00.000Z',
  },
  {
    id: 'demo-2',
    qrToken: 'demo-kali-token-2',
    pawId: 'PAW-NP-K2L99M',
    name: 'Kali',
    sex: 'Female',
    approximateAge: '2 years',
    color: 'Black',
    distinctiveFeatures: 'Bushy tail, very friendly',
    area: 'Kathmandu',
    status: 'Active',
    vaccinationStatus: 'Vaccinated',
    sterilizationStatus: 'Sterilized',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
        isPrimary: true,
      },
    ],
    registrationLocation: {
      type: 'Point',
      coordinates: [85.3123, 27.7006],
    },
    lastSeenArea: 'Ratna Park Bus Stop',
    lastSeenDate: new Date().toISOString(),
    createdAt: '2026-02-01T10:00:00.000Z',
  },
  {
    id: 'demo-3',
    qrToken: 'demo-bruno-token-3',
    pawId: 'PAW-NP-B77P01',
    name: 'Bruno',
    sex: 'Male',
    approximateAge: '5 years',
    color: 'Golden Tan',
    distinctiveFeatures: 'Limping slightly on back leg',
    area: 'Lalitpur',
    status: 'Missing',
    vaccinationStatus: 'Vaccinated',
    sterilizationStatus: 'Unsterilized',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
        isPrimary: true,
      },
    ],
    registrationLocation: {
      type: 'Point',
      coordinates: [85.3188, 27.671],
    },
    lastSeenArea: 'Patan Durbar Square',
    lastSeenDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 'demo-4',
    qrToken: 'demo-lucy-token-4',
    pawId: 'PAW-NP-L44X92',
    name: 'Lucy',
    sex: 'Female',
    approximateAge: '1 year',
    color: 'White & Tan',
    distinctiveFeatures: 'Red collar tag',
    area: 'Kathmandu',
    status: 'Active',
    vaccinationStatus: 'Unknown',
    sterilizationStatus: 'Unknown',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=800&q=80',
        isPrimary: true,
      },
    ],
    registrationLocation: {
      type: 'Point',
      coordinates: [85.342, 27.705],
    },
    lastSeenArea: 'New Baneshwor',
    lastSeenDate: new Date(Date.now() - 86400000 * 4).toISOString(),
    createdAt: '2026-03-01T10:00:00.000Z',
  },
  {
    id: 'demo-5',
    qrToken: 'demo-sheru-token-5',
    pawId: 'PAW-NP-S55M33',
    name: 'Sheru',
    sex: 'Male',
    approximateAge: '4 years',
    color: 'Dark Brown',
    distinctiveFeatures: 'Scared of loud noises',
    area: 'Kathmandu',
    status: 'Active',
    vaccinationStatus: 'Vaccinated',
    sterilizationStatus: 'Sterilized',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80',
        isPrimary: true,
      },
    ],
    registrationLocation: {
      type: 'Point',
      coordinates: [85.281, 27.712],
    },
    lastSeenArea: 'Swayambhunath Stupa Area',
    lastSeenDate: new Date().toISOString(),
    createdAt: '2026-02-15T10:00:00.000Z',
  },
];

export const dogService = {
  async getPublicDogByQr(qrToken: string): Promise<Dog> {
    try {
      const res = await apiRequest<{ success: boolean; data: Dog }>(`/public/dogs/${qrToken}`);
      if (res?.data) return res.data;
    } catch {
      // Fallback to demo dogs if offline or server disconnected
    }
    const foundDemo = DEMO_DOGS.find((d) => d.qrToken === qrToken || d.pawId === qrToken);
    if (foundDemo) return foundDemo;
    return DEMO_DOGS[0]; // Default to Rocky demo profile
  },

  async getPublicDogs(params?: DogFilterParams): Promise<{ dogs: Dog[]; total: number }> {
    try {
      const query = new URLSearchParams();
      if (params?.search) query.append('search', params.search);
      if (params?.area) query.append('area', params.area);
      if (params?.sex) query.append('sex', params.sex);
      if (params?.status) query.append('status', params.status);
      if (params?.vaccinationStatus) query.append('vaccinationStatus', params.vaccinationStatus);
      if (params?.sterilizationStatus) query.append('sterilizationStatus', params.sterilizationStatus);

      const queryString = query.toString() ? `?${query.toString()}` : '';
      const res = await apiRequest<{ success: boolean; data: Dog[]; meta?: { total: number } }>(`/dogs${queryString}`);

      if (res?.data && res.data.length > 0) {
        return {
          dogs: res.data,
          total: res.meta?.total || res.data.length,
        };
      }
    } catch {
      // Fallback to Demo mode if backend is not running or returning empty database
    }

    // Filter DEMO_DOGS locally
    let filtered = [...DEMO_DOGS];
    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.pawId.toLowerCase().includes(q) ||
          (d.name && d.name.toLowerCase().includes(q)) ||
          d.area.toLowerCase().includes(q)
      );
    }
    if (params?.area) {
      filtered = filtered.filter((d) => d.area.toLowerCase().includes(params.area!.toLowerCase()));
    }
    if (params?.sex) {
      filtered = filtered.filter((d) => d.sex === params.sex);
    }
    if (params?.status) {
      filtered = filtered.filter((d) => d.status === params.status);
    }
    if (params?.vaccinationStatus) {
      filtered = filtered.filter((d) => d.vaccinationStatus === params.vaccinationStatus);
    }
    if (params?.sterilizationStatus) {
      filtered = filtered.filter((d) => d.sterilizationStatus === params.sterilizationStatus);
    }

    return {
      dogs: filtered,
      total: filtered.length,
    };
  },

  async getMapDogs(): Promise<{ type: string; features: any[] }> {
    try {
      const res = await apiRequest<any>('/public/map/dogs');
      if (res?.features) return res;
    } catch {}

    return {
      type: 'FeatureCollection',
      features: DEMO_DOGS.map((dog) => ({
        type: 'Feature',
        id: dog.id,
        geometry: {
          type: 'Point',
          coordinates: dog.registrationLocation?.coordinates || [85.324, 27.7172],
        },
        properties: {
          pawId: dog.pawId,
          name: dog.name,
          area: dog.area,
          qrToken: dog.qrToken,
        },
      })),
    };
  },

  async getNearbyDogs(lng: number, lat: number, maxDistance = 5000): Promise<Dog[]> {
    try {
      const res = await apiRequest<{ success: boolean; data: Dog[] }>(
        `/public/dogs/nearby?longitude=${lng}&latitude=${lat}&maxDistance=${maxDistance}`
      );
      if (res?.data) return res.data;
    } catch {}
    return DEMO_DOGS;
  },

  async registerDog(dogData: Partial<Dog>): Promise<Dog> {
    try {
      const res = await apiRequest<{ success: boolean; data: Dog }>('/dogs', {
        method: 'POST',
        body: JSON.stringify(dogData),
      });
      if (res?.data) return res.data;
    } catch {}

    const newDog: Dog = {
      id: `demo-${Date.now()}`,
      qrToken: `demo-qr-${Date.now()}`,
      pawId: `PAW-NP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      name: dogData.name || 'Community Dog',
      sex: dogData.sex || 'Male',
      approximateAge: dogData.approximateAge || '2 years',
      color: dogData.color || 'Brown',
      distinctiveFeatures: dogData.distinctiveFeatures || '',
      area: dogData.area || 'Kathmandu',
      status: dogData.status || 'Active',
      vaccinationStatus: dogData.vaccinationStatus || 'Unknown',
      sterilizationStatus: dogData.sterilizationStatus || 'Unknown',
      photos: dogData.photos || [],
      registrationLocation: dogData.registrationLocation,
      createdAt: new Date().toISOString(),
    };
    DEMO_DOGS.unshift(newDog);
    return newDog;
  },

  async getDogById(id: string): Promise<Dog> {
    try {
      const res = await apiRequest<{ success: boolean; data: Dog }>(`/dogs/${id}`);
      if (res?.data) return res.data;
    } catch {}
    return DEMO_DOGS.find((d) => d.id === id) || DEMO_DOGS[0];
  },

  async updateDog(id: string, dogData: Partial<Dog>): Promise<Dog> {
    try {
      const res = await apiRequest<{ success: boolean; data: Dog }>(`/dogs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(dogData),
      });
      if (res?.data) return res.data;
    } catch {}
    const dog = DEMO_DOGS.find((d) => d.id === id) || DEMO_DOGS[0];
    Object.assign(dog, dogData);
    return dog;
  },

  async getStats(): Promise<{ totalDogs: number; activeDogs: number; vaccinated: number; sterilized: number; totalSightings: number; pendingReports: number }> {
    try {
      const res = await apiRequest<any>('/admin/stats');
      if (res?.data) return res.data;
    } catch {}

    return {
      totalDogs: DEMO_DOGS.length,
      activeDogs: DEMO_DOGS.filter((d) => d.status === 'Active').length,
      vaccinated: DEMO_DOGS.filter((d) => d.vaccinationStatus === 'Vaccinated').length,
      sterilized: DEMO_DOGS.filter((d) => d.sterilizationStatus === 'Sterilized').length,
      totalSightings: 12,
      pendingReports: 1,
    };
  },
};
