import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import {
  getMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../services/menu.service';

export function useMenu(restaurantId, filters = {}, options = {}) {
  return useQuery({
    queryKey: queryKeys.menu.all(restaurantId, filters),
    queryFn: () => getMenu(restaurantId, filters),
    enabled: Boolean(restaurantId) && (options.enabled !== false),
    ...options,
  });
}

export function useMenuMutations(restaurantId) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['menu', restaurantId] });
  };

  const create = useMutation({
    mutationFn: (payload) => createMenuItem(restaurantId, payload),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ itemId, payload }) => updateMenuItem(restaurantId, itemId, payload),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (itemId) => deleteMenuItem(restaurantId, itemId),
    onSuccess: invalidate,
  });

  return { create, update, remove };
}

