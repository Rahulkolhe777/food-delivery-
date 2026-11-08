import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import {
  getRestaurantRevenue,
  getTopCustomers,
  getTopDishes,
} from '../services/analytics.service';

export function useRestaurantRevenue(restaurantId, params = {}, options = {}) {
  return useQuery({
    queryKey: queryKeys.analytics.revenue(restaurantId, params),
    queryFn: () => getRestaurantRevenue(restaurantId, params),
    enabled: Boolean(restaurantId) && (options.enabled !== false),
    ...options,
  });
}

export function useTopCustomers(restaurantId, options = {}) {
  return useQuery({
    queryKey: queryKeys.analytics.topCustomers(restaurantId),
    queryFn: () => getTopCustomers(restaurantId),
    enabled: Boolean(restaurantId) && (options.enabled !== false),
    ...options,
  });
}

export function useTopDishes(restaurantId, options = {}) {
  return useQuery({
    queryKey: ['analytics', 'top-dishes', restaurantId],
    queryFn: () => getTopDishes(restaurantId),
    enabled: Boolean(restaurantId) && (options.enabled !== false),
    retry: false, // 501 stub
    ...options,
  });
}

