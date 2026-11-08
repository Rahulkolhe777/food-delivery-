import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { getRestaurantReviews, createReview } from '../services/review.service';

export function useRestaurantReviews(restaurantId, params = {}, options = {}) {
  return useQuery({
    queryKey: queryKeys.reviews.restaurant(restaurantId, params),
    queryFn: () => getRestaurantReviews(restaurantId, params),
    enabled: Boolean(restaurantId) && (options.enabled !== false),
    keepPreviousData: true,
    ...options,
  });
}

export function useReviewMutations(restaurantId) {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      if (restaurantId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.reviews.restaurant(restaurantId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.restaurants.detail(restaurantId) });
      }
    },
  });

  return { create };
}

