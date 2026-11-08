import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import {
  getMyOrders,
  getRestaurantOrders,
  createOrder,
  updateOrderStatus,
} from '../services/order.service';

export function useMyOrders(params = {}, options = {}) {
  return useQuery({
    queryKey: queryKeys.orders.my(params),
    queryFn: () => getMyOrders(params),
    keepPreviousData: true,
    ...options,
  });
}

export function useRestaurantOrders(restaurantId, params = {}, options = {}) {
  return useQuery({
    queryKey: queryKeys.orders.restaurant(restaurantId, params),
    queryFn: () => getRestaurantOrders(restaurantId, params),
    enabled: Boolean(restaurantId) && (options.enabled !== false),
    keepPreviousData: true,
    ...options,
  });
}

export function useOrderMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const updateStatus = useMutation({
    mutationFn: ({ orderId, status }) => updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });

  return { create, updateStatus };
}

