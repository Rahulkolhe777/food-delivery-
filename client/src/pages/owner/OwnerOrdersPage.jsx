/**
 * OwnerOrdersPage — Restaurant owner order lifecycle management dashboard.
 * Decomposed using:
 *  - features/orders: OrderKpiBar, OwnerOrdersFilterBar, OwnerOrdersTable, OwnerOrderCards, OrderDetailModal
 */

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RefreshCcw } from 'lucide-react';

import { useOwnerRestaurant } from '@/context/OwnerRestaurantContext';
import { useToast } from '@/context/ToastContext';
import { getRestaurantOrders, updateOrderStatus } from '@/features/orders';
import { queryKeys } from '@/lib/queryKeys';

// UI & Decomposed Components
import {
  Button,
  Pagination,
  EmptyState,
  ErrorState,
  ConfirmDialog,
  Skeleton,
} from '@/components/ui';
import OrderKpiBar from '@/features/orders/components/OrderKpiBar';
import OwnerOrdersFilterBar from '@/features/orders/components/OwnerOrdersFilterBar';
import OwnerOrdersTable from '@/features/orders/components/OwnerOrdersTable';
import OwnerOrderCards from '@/features/orders/components/OwnerOrderCards';
import OrderDetailModal from '@/features/orders/components/OrderDetailModal';

export default function OwnerOrdersPage() {
  const queryClient = useQueryClient();
  const { activeRestaurant, selectedId } = useOwnerRestaurant();
  const { success, error: toastError } = useToast();

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table');

  // Modals state
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [deliverTargetOrder, setDeliverTargetOrder] = useState(null);
  const [cancelTargetOrder, setCancelTargetOrder] = useState(null);

  // Query: Owner Orders
  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: queryKeys.orders.restaurant(selectedId, {
      page,
      limit: pageSize,
      status: selectedStatus === 'all' ? undefined : selectedStatus,
    }),
    queryFn: () =>
      getRestaurantOrders(selectedId, {
        page,
        limit: pageSize,
        status: selectedStatus === 'all' ? undefined : selectedStatus,
      }),
    enabled: Boolean(selectedId),
    keepPreviousData: true,
  });

  const totalOrders = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  // Status Mutation
  const statusMutation = useMutation({
    mutationFn: ({ orderId, status }) => updateOrderStatus(orderId, status),
    onSuccess: (res, variables) => {
      success('Order Updated', `Order #${variables.orderId.slice(-6).toUpperCase()} transitioned to ${variables.status}.`);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      setDeliverTargetOrder(null);
      setCancelTargetOrder(null);
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Could not update order status.';
      toastError('Update Failed', msg);
    },
  });

  // Client-side search and payment filter
  const filteredOrders = useMemo(() => {
    let list = data?.orders ?? [];

    if (paymentFilter !== 'all') {
      list = list.filter((o) => o.paymentMethod === paymentFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (o) =>
          o._id.toLowerCase().includes(q) ||
          (o.customer?.name && o.customer.name.toLowerCase().includes(q)) ||
          o.items?.some((i) => i.name.toLowerCase().includes(q))
      );
    }

    return list;
  }, [data?.orders, paymentFilter, searchQuery]);

  // Tab counts
  const tabCounts = useMemo(() => {
    const list = data?.orders ?? [];
    return {
      all: totalOrders,
      placed: list.filter((o) => o.status === 'placed').length,
      preparing: list.filter((o) => o.status === 'preparing').length,
      delivered: list.filter((o) => o.status === 'delivered').length,
      cancelled: list.filter((o) => o.status === 'cancelled').length,
    };
  }, [data?.orders, totalOrders]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutralBorder pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
              Kitchen Orders Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-terracotta-50 text-terracotta-700 border border-terracotta-200">
              Live Fulfillment
            </span>
          </div>
          <p className="text-xs text-charcoal-secondary mt-1">
            Fulfill orders, coordinate kitchen prep, and update delivery statuses for{' '}
            <strong className="text-charcoal font-semibold">{activeRestaurant?.name}</strong>.
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
            Refresh Orders
          </Button>
        </div>
      </div>

      {/* KPI Metrics */}
      <OrderKpiBar
        totalOrders={totalOrders}
        tabCounts={tabCounts}
        selectedStatus={selectedStatus}
        onSelectStatus={(st) => {
          setSelectedStatus(st);
          setPage(1);
        }}
      />

      {/* Search & View Controls */}
      <OwnerOrdersFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        paymentFilter={paymentFilter}
        setPaymentFilter={setPaymentFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      )}

      {/* Error State */}
      {isError && !isLoading && (
        <ErrorState
          title="Could not load orders"
          message="Failed to retrieve orders for this restaurant from the server."
          onRetry={refetch}
        />
      )}

      {/* Empty State */}
      {!isLoading && !isError && filteredOrders.length === 0 && (
        <EmptyState
          title={searchQuery || selectedStatus !== 'all' ? 'No matching orders' : 'No orders in queue'}
          description={
            searchQuery || selectedStatus !== 'all'
              ? 'Try adjusting your search criteria or switching to a different status tab.'
              : 'Incoming customer orders will appear here in real-time as they are placed.'
          }
        />
      )}

      {/* Table View */}
      {!isLoading && !isError && filteredOrders.length > 0 && viewMode === 'table' && (
        <OwnerOrdersTable
          orders={filteredOrders}
          onViewDetails={setSelectedOrderDetails}
          onAccept={(id) => statusMutation.mutate({ orderId: id, status: 'preparing' })}
          onDeliver={setDeliverTargetOrder}
          onCancel={setCancelTargetOrder}
          isUpdating={statusMutation.isLoading}
        />
      )}

      {/* Cards View */}
      {!isLoading && !isError && filteredOrders.length > 0 && viewMode === 'cards' && (
        <OwnerOrderCards
          orders={filteredOrders}
          onViewDetails={setSelectedOrderDetails}
          onAccept={(id) => statusMutation.mutate({ orderId: id, status: 'preparing' })}
          onDeliver={setDeliverTargetOrder}
          onCancel={setCancelTargetOrder}
          isUpdating={statusMutation.isLoading}
        />
      )}

      {/* Pagination */}
      {!isLoading && !isError && totalPages > 1 && (
        <div className="p-3.5 border border-neutralBorder rounded-xl bg-surface flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-charcoal-secondary">
          <span>
            Page <strong className="text-charcoal font-semibold">{page}</strong> of{' '}
            <strong className="text-charcoal font-semibold">{totalPages}</strong> ({totalOrders} total orders)
          </span>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrderDetails}
        isOpen={Boolean(selectedOrderDetails)}
        onClose={() => setSelectedOrderDetails(null)}
      />

      {/* Deliver Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deliverTargetOrder)}
        onClose={() => setDeliverTargetOrder(null)}
        onConfirm={() =>
          deliverTargetOrder &&
          statusMutation.mutate({
            orderId: deliverTargetOrder._id,
            status: 'delivered',
          })
        }
        title="Mark Order as Delivered?"
        description={`Confirm delivery completion for order #${deliverTargetOrder?._id.slice(-6).toUpperCase()} (${deliverTargetOrder?.customer?.name})? This finalizes the order ledger.`}
        confirmText="Confirm Delivered"
      />

      {/* Cancel Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(cancelTargetOrder)}
        onClose={() => setCancelTargetOrder(null)}
        onConfirm={() =>
          cancelTargetOrder &&
          statusMutation.mutate({
            orderId: cancelTargetOrder._id,
            status: 'cancelled',
          })
        }
        title="Cancel Order?"
        description={`Are you sure you want to cancel order #${cancelTargetOrder?._id.slice(-6).toUpperCase()}? This will halt prep and notify the diner.`}
        confirmText="Cancel Order"
        isDestructive
      />
    </div>
  );
}
