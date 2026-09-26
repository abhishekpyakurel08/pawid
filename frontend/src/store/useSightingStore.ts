import { create } from 'zustand';
import { SightingCondition } from '../types/sighting';

interface SightingDraftState {
  longitude: number | null;
  latitude: number | null;
  areaName: string;
  condition: SightingCondition;
  description: string;
  photoUrl: string;
  consentAgreed: boolean;

  setLocation: (lng: number, lat: number, areaName?: string) => void;
  setCondition: (condition: SightingCondition) => void;
  setDescription: (desc: string) => void;
  setPhotoUrl: (url: string) => void;
  setConsentAgreed: (agreed: boolean) => void;
  resetDraft: () => void;
}

export const useSightingStore = create<SightingDraftState>((set) => ({
  longitude: null,
  latitude: null,
  areaName: '',
  condition: 'Healthy',
  description: '',
  photoUrl: '',
  consentAgreed: false,

  setLocation: (longitude, latitude, areaName = '') =>
    set((state) => ({ ...state, longitude, latitude, areaName: areaName || state.areaName })),
  setCondition: (condition) => set({ condition }),
  setDescription: (description) => set({ description }),
  setPhotoUrl: (photoUrl) => set({ photoUrl }),
  setConsentAgreed: (consentAgreed) => set({ consentAgreed }),
  resetDraft: () =>
    set({
      longitude: null,
      latitude: null,
      areaName: '',
      condition: 'Healthy',
      description: '',
      photoUrl: '',
      consentAgreed: false,
    }),
}));
