/**
 * CustomerOrdersPage — Customer order history and review workflow.
 * Uses decomposed features/orders: CustomerOrderCard, OrderDetailModal,
 * and features/reviews: ReviewSubmissionModal.
 */

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ShoppingBag,
  Search,
  X,
  RefreshCcw,
} from 'lucide-react';

import { getMyOrders } from '@/features/orders';
import { createReview } from '@/features/reviews';
import { queryKeys } from '@/lib/queryKeys';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/lib/utils';

// UI & Decomposed Feature Components
import { Button, EmptyState, ErrorState, Pagination, Skeleton } from '@/components/ui';
import CustomerOrderCard from '@/features/orders/components/CustomerOrderCard';
import OrderDetailModal from '@/features/orders/components/OrderDetailModal';
import ReviewSubmissionModal from '@/features/reviews/components/ReviewSubmissionModal';

export default function CustomerOrdersPage() {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [reviewOrder, setReviewOrder] = useState(null);

  // Local record of reviewed orders (persists in session)
  const [reviewedOrders, setReviewedOrders] = useState(() => {
    try {
      const stored = sessionStorage.getItem('foodhub_reviewed_orders');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const saveReviewedOrder = (orderId, reviewData) => {
    setReviewedOrders((prev) => {
      const updated = { ...prev, [orderId]: reviewData };
      try {
        sessionStorage.setItem('foodhub_reviewed_orders', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // 1. Fetch My Orders
  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: queryKeys.orders.my({ page, limit: 10 }),
    queryFn: () => getMyOrders({ page, limit: 10 }),
    keepPreviousData: true,
  });

  const totalPages = data?.totalPages ?? 1;
  const totalCount = data?.total ?? 0;

  // 2. Client-side Filtering & Search
  const filteredOrders = useMemo(() => {
    let list = data?.orders ?? [];

    if (statusFilter === 'active') {
      list = list.filter((o) => o.status === 'placed' || o.status === 'preparing');
    } else if (statusFilter === 'delivered') {
      list = list.filter((o) => o.status === 'delivered');
    } else if (statusFilter === 'cancelled') {
      list = list.filter((o) => o.status === 'cancelled');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((o) => {
        const matchesRest = o.restaurant?.name?.toLowerCase().includes(q);
        const matchesDish = o.items?.some((i) => i.name.toLowerCase().includes(q));
        const matchesId = o._id.toLowerCase().includes(q);
        return matchesRest || matchesDish || matchesId;
      });
    }

    return list;
  }, [data?.orders, statusFilter, searchQuery]);

  // Tab counts
  const tabCounts = useMemo(() => {
    const list = data?.orders ?? [];
    return {
      all: list.length,
      active: list.filter((o) => o.status === 'placed' || o.status === 'preparing').length,
      delivered: list.filter((o) => o.status === 'delivered').length,
      cancelled: list.filter((o) => o.status === 'cancelled').length,
    };
  }, [data?.orders]);

  // 3. Review Mutation
  const reviewMutation = useMutation({
    mutationFn: createReview,
    onSuccess: (_data, variables) => {
      success('Review submitted! Thank you for sharing your experience.');
      saveReviewedOrder(variables.orderId, {
        rating: variables.rating,
        comment: variables.comment,
      });
      setReviewOrder(null);
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Could not submit review. You may have already reviewed this meal.';
      toastError(msg);
    },
  });

  const handleReviewSubmit = (payload) => {
    reviewMutation.mutate(payload);
  };

  return (
    <div className="min-h-screen bg-canvas py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutralBorder pb-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
              Order History & Deliveries
            </h1>
            <p className="text-xs text-charcoal-secondary mt-1">
              Track live food prep, view itemized receipts, and review your delivered culinary meals.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              leftIcon={<RefreshCcw size={14} className={isFetching ? 'animate-spin' : ''} />}
            >
              Refresh Status
            </Button>
            <Link to="/restaurants">
              <Button variant="primary" size="sm">
                Explore Menus
              </Button>
            </Link>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-1.5 p-1 bg-surface-subtle border border-neutralBorder rounded-2xl overflow-x-auto scrollbar-none text-xs">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'active', label: 'Active Kitchen Prep' },
            { id: 'delivered', label: 'Delivered' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => {
            const isSelected = statusFilter === tab.id;
            const count = tabCounts[tab.id];

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={cn(
                  'px-3.5 py-2 rounded-xl font-medium transition-all shrink-0 flex items-center gap-2',
                  isSelected
                    ? 'bg-surface text-charcoal font-bold shadow-warm-xs'
                    : 'text-charcoal-secondary hover:text-charcoal'
                )}
              >
                <span>{tab.label}</span>
                {count > 0 && (
                  <span
                    className={cn(
                      'text-[10px] px-1.5 py-0.2 rounded-full font-bold',
                      isSelected
                        ? 'bg-charcoal text-white'
                        : 'bg-neutralBorder text-charcoal-secondary'
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-muted pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by restaurant name, dish, or order ID..."
            className="w-full h-10 pl-10 pr-9 bg-surface border border-neutralBorder rounded-xl text-xs text-charcoal placeholder:text-charcoal-muted focus:outline-none focus:border-terracotta-400 shadow-warm-xs transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-charcoal"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Orders Feed */}
        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-surface rounded-2xl border border-neutralBorder p-5 space-y-4">
                <Skeleton className="h-6 w-48 rounded-md" />
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-8 w-full rounded-md" />
              </div>
            ))}
          </div>
        )}

        {isError && !isLoading && (
          <ErrorState
            title="Could not load your orders"
            message="We had trouble retrieving your order history. Please check your connection and retry."
            onRetry={refetch}
          />
        )}

        {!isLoading && !isError && filteredOrders.length === 0 && (
          <EmptyState
            icon={ShoppingBag}
            title={rawOrders.length === 0 ? 'No orders placed yet' : 'No matching orders found'}
            description={
              rawOrders.length === 0
                ? 'Your culinary journey begins with your first meal. Explore top dining destinations near you.'
                : 'Try modifying your search query or switching the status filter tab.'
            }
            action={
              rawOrders.length === 0 ? (
                <Link to="/restaurants">
                  <Button variant="primary">Order Now</Button>
                </Link>
              ) : undefined
            }
          />
        )}

        {!isLoading && !isError && filteredOrders.length > 0 && (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <CustomerOrderCard
                key={order._id}
                order={order}
                existingReview={reviewedOrders[order._id]}
                onViewDetails={setSelectedOrderDetails}
                onOpenReview={setReviewOrder}
              />
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pt-6 border-t border-neutralBorder flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-charcoal-muted">
                <span>
                  Showing page <strong className="text-charcoal">{page}</strong> of{' '}
                  <strong className="text-charcoal">{totalPages}</strong> ({totalCount} total orders)
                </span>
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={(p) => {
                    setPage(p);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Order Details Receipt Modal ── */}
      <OrderDetailModal
        isOpen={Boolean(selectedOrderDetails)}
        onClose={() => setSelectedOrderDetails(null)}
        order={selectedOrderDetails}
      />

      {/* ── Review Dialog Modal ── */}
      <ReviewSubmissionModal
        isOpen={Boolean(reviewOrder)}
        onClose={() => setReviewOrder(null)}
        order={reviewOrder}
        onSubmit={handleReviewSubmit}
        isSubmitting={reviewMutation.isPending}
      />
    </div>
  );
}
