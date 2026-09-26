import { apiRequest } from './api';
import { GalleryPhoto, SubmitPhotoPayload } from '../types/gallery';

export const DEMO_GALLERY: GalleryPhoto[] = [
  {
    id: 'gal-1',
    title: 'Rocky Resting in Durbar Marg',
    caption: 'Rocky enjoying the afternoon sun near the heritage monument in Kathmandu.',
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
    area: 'Kathmandu',
    pawId: 'PAW-NP-A8F42K',
    submittedBy: 'Anish S.',
    tags: ['Kathmandu', 'Community Dog', 'Vaccinated'],
    createdAt: '2026-09-24T12:00:00.000Z',
  },
  {
    id: 'gal-2',
    title: 'Kali at Ratna Park',
    caption: 'Local shopkeepers provided fresh water and shade for Kali.',
    imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
    area: 'Kathmandu',
    pawId: 'PAW-NP-K2L99M',
    submittedBy: 'Suman T.',
    tags: ['Ratna Park', 'Healthy', 'Sterilized'],
    createdAt: '2026-09-23T15:30:00.000Z',
  },
  {
    id: 'gal-3',
    title: 'Bruno in Patan Square',
    caption: 'Bruno resting under temple steps in Lalitpur.',
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
    area: 'Lalitpur',
    pawId: 'PAW-NP-B77P01',
    submittedBy: 'Maya R.',
    tags: ['Patan', 'Community Care'],
    createdAt: '2026-09-21T09:45:00.000Z',
  },
  {
    id: 'gal-4',
    title: 'Lucy at Baneshwor',
    caption: 'Lucy wearing her red PawID collar tag.',
    imageUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=800&q=80',
    area: 'Kathmandu',
    pawId: 'PAW-NP-L44X92',
    submittedBy: 'Kiran K.',
    tags: ['Baneshwor', 'Collared'],
    createdAt: '2026-09-19T14:10:00.000Z',
  },
  {
    id: 'gal-5',
    title: 'Sheru at Swayambhu Stupa',
    caption: 'Sheru happily greeting morning pilgrims.',
    imageUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80',
    area: 'Kathmandu',
    pawId: 'PAW-NP-S55M33',
    submittedBy: 'Pooja B.',
    tags: ['Swayambhu', 'Vaccinated', 'Heritage'],
    createdAt: '2026-09-18T08:20:00.000Z',
  },
  {
    id: 'gal-6',
    title: 'Morning Care Drive in Thamel',
    caption: 'Volunteers conducting vaccination checks and collar tagging.',
    imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
    area: 'Kathmandu',
    submittedBy: 'PawID Volunteer Team',
    tags: ['Outreach', 'Vaccination Campaign'],
    createdAt: '2026-09-15T11:00:00.000Z',
  },
];

export const galleryService = {
  async getGallery(params?: { area?: string; tag?: string; pawId?: string }): Promise<GalleryPhoto[]> {
    try {
      const query = new URLSearchParams();
      if (params?.area) query.append('area', params.area);
      if (params?.tag) query.append('tag', params.tag);
      if (params?.pawId) query.append('pawId', params.pawId);

      const queryString = query.toString() ? `?${query.toString()}` : '';
      const res = await apiRequest<{ success: boolean; data: GalleryPhoto[] }>(`/public/gallery${queryString}`);
      if (res?.data && res.data.length > 0) return res.data;
    } catch {}

    // Local filter fallback
    let filtered = [...DEMO_GALLERY];
    if (params?.area) {
      filtered = filtered.filter((p) => p.area.toLowerCase().includes(params.area!.toLowerCase()));
    }
    if (params?.pawId) {
      filtered = filtered.filter((p) => p.pawId?.toLowerCase().includes(params.pawId!.toLowerCase()));
    }
    if (params?.tag) {
      filtered = filtered.filter((p) => p.tags?.some((t) => t.toLowerCase() === params.tag!.toLowerCase()));
    }
    return filtered;
  },

  async submitPhoto(payload: SubmitPhotoPayload): Promise<GalleryPhoto> {
    try {
      const res = await apiRequest<{ success: boolean; data: GalleryPhoto }>('/public/gallery/submit', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (res?.data) return res.data;
    } catch {}

    const newPhoto: GalleryPhoto = {
      id: `gal-${Date.now()}`,
      title: payload.title,
      caption: payload.caption,
      imageUrl: payload.imageUrl,
      area: payload.area || 'Kathmandu',
      pawId: payload.pawId,
      submittedBy: payload.submittedBy || 'Community Member',
      tags: payload.tags || ['Community Photo'],
      createdAt: new Date().toISOString(),
    };
    DEMO_GALLERY.unshift(newPhoto);
    return newPhoto;
  },
};
