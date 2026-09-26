import { create } from 'zustand';
import { Sex, DogStatus, VaccinationStatus, SterilizationStatus } from '../types/dog';

interface FilterState {
  search: string;
  area: string;
  sex: Sex | '';
  status: DogStatus | '';
  vaccinationStatus: VaccinationStatus | '';
  sterilizationStatus: SterilizationStatus | '';

  setSearch: (search: string) => void;
  setArea: (area: string) => void;
  setSex: (sex: Sex | '') => void;
  setStatus: (status: DogStatus | '') => void;
  setVaccinationStatus: (status: VaccinationStatus | '') => void;
  setSterilizationStatus: (status: SterilizationStatus | '') => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  search: '',
  area: '',
  sex: '',
  status: '',
  vaccinationStatus: '',
  sterilizationStatus: '',

  setSearch: (search) => set({ search }),
  setArea: (area) => set({ area }),
  setSex: (sex) => set({ sex }),
  setStatus: (status) => set({ status }),
  setVaccinationStatus: (vaccinationStatus) => set({ vaccinationStatus }),
  setSterilizationStatus: (sterilizationStatus) => set({ sterilizationStatus }),
  resetFilters: () =>
    set({
      search: '',
      area: '',
      sex: '',
      status: '',
      vaccinationStatus: '',
      sterilizationStatus: '',
    }),
}));
