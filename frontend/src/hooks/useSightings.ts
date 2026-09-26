import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sightingService } from '../services/sighting.service';
import { CreateSightingPayload } from '../types/sighting';

export function usePublicSightings(qrToken: string) {
  return useQuery({
    queryKey: ['publicSightings', qrToken],
    queryFn: () => sightingService.getPublicSightingsByQr(qrToken),
    enabled: !!qrToken,
  });
}

export function useSubmitSighting(qrToken: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSightingPayload) =>
      sightingService.submitPublicSighting(qrToken, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicSightings', qrToken] });
      queryClient.invalidateQueries({ queryKey: ['publicDog', qrToken] });
      queryClient.invalidateQueries({ queryKey: ['mapSightings'] });
    },
  });
}

export function useMapSightings() {
  return useQuery({
    queryKey: ['mapSightings'],
    queryFn: () => sightingService.getMapSightings(),
  });
}

export function useAllSightings() {
  return useQuery({
    queryKey: ['allSightings'],
    queryFn: () => sightingService.getAllSightings(),
  });
}
