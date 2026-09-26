import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dogService } from '../services/dog.service';
import { DogFilterParams, Dog } from '../types/dog';

export function usePublicDog(qrToken: string) {
  return useQuery({
    queryKey: ['publicDog', qrToken],
    queryFn: () => dogService.getPublicDogByQr(qrToken),
    enabled: !!qrToken,
    retry: 1,
  });
}

export function useDogs(params?: DogFilterParams) {
  return useQuery({
    queryKey: ['dogs', params],
    queryFn: () => dogService.getPublicDogs(params),
  });
}

export function useDogDetails(id: string) {
  return useQuery({
    queryKey: ['dogDetails', id],
    queryFn: () => dogService.getDogById(id),
    enabled: !!id,
  });
}

export function useRegisterDog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newDog: Partial<Dog>) => dogService.registerDog(newDog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dogs'] });
    },
  });
}

export function useUpdateDog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Dog> }) => dogService.updateDog(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['dogs'] });
      queryClient.invalidateQueries({ queryKey: ['dogDetails', id] });
    },
  });
}

export function useDogStats() {
  return useQuery({
    queryKey: ['dogStats'],
    queryFn: () => dogService.getStats(),
  });
}
