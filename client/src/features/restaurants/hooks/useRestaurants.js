import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from '../services/restaurant.service';

export function useRestaurants(params = {}) {
  return useQuery({
    queryKey: queryKeys.restaurants.all(params),
    queryFn: () => getRestaurants(params),
    keepPreviousData: true,
  });
}

export function useRestaurant(id, options = {}) {
  return useQuery({
    queryKey: queryKeys.restaurants.detail(id),
    queryFn: () => getRestaurantById(id),
    enabled: Boolean(id) && (options.enabled !== false),
    ...options,
  });
}

export function useRestaurantMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: createRestaurant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, payload }) => updateRestaurant(id, payload),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.restaurants.detail(id) });
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    },
  });

  const remove = useMutation({
    mutationFn: deleteRestaurant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    },
  });

  return { create, update, remove };
}

