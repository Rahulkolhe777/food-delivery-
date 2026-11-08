/**
 * Restaurant API service.
 * Backward-compatible facade re-exporting directly from domain feature services.
 */

// Pure restaurant operations
export * from '@/features/restaurants/services/restaurant.service';

// Re-exported domain operations for backward compatibility
export {
  getMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '@/features/menu/services/menu.service';

export {
  getRestaurantOrders,
} from '@/features/orders/services/order.service';

export {
  getRestaurantReviews,
} from '@/features/reviews/services/review.service';

export {
  getRestaurantRevenue,
  getTopCustomers,
} from '@/features/analytics/services/analytics.service';
