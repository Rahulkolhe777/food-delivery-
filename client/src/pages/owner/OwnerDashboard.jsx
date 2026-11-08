/**
 * OwnerDashboard — Executive overview for restaurant owners.
 *
 * Real Backend API Integration:
 *   - GET /api/restaurants/:id/revenue?from=&to=
 *   - GET /api/restaurants/:id/orders?limit=5
 *   - GET /api/restaurants/:id/top-customers
 *   - GET /api/restaurants/:id/menu
 *   - GET /api/restaurants/:id/reviews?limit=1
 *   - PATCH /api/orders/:id/status
 */

import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RefreshCcw, ChevronRight } from 'lucide-react';

import { useOwnerRestaurant } from '@/context/OwnerRestaurantContext';
import {
  getRestaurantRevenue,
  getTopCustomers,
  getRestaurantOrders,
  getMenu,
  getRestaurantReviews,
} from '@/services/restaurant.service';
import { updateOrderStatus } from '@/services/order.service';
import { useToast } from '@/context/ToastContext';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

import DashboardKpiGrid from '@/features/analytics/components/DashboardKpiGrid';
import DashboardChartsRow from '@/features/analytics/components/DashboardChartsRow';
import DashboardRecentOrders from '@/features/orders/components/DashboardRecentOrders';
import DashboardVipList from '@/features/analytics/components/DashboardVipList';

export default function OwnerDashboard() {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();
  const {
    selectedId,
    activeRestaurant,
    toggleRestaurantOpen,
    isUpdatingStatus,
  } = useOwnerRestaurant();

  // ── 1. Revenue Trends Query ────────────────────────────────────────────────
  const {
    data: revenueData,
    isLoading: isLoadingRevenue,
    refetch: refetchRevenue,
  } = useQuery({
    queryKey: ['owner', 'revenue', selectedId],
    queryFn: () => getRestaurantRevenue(selectedId),
    enabled: Boolean(selectedId),
    staleTime: 60_000,
  });

  // ── 2. Top Customers Query ────────────────────────────────────────────────
  const {
    data: topCustomersData,
    isLoading: isLoadingCustomers,
  } = useQuery({
    queryKey: ['owner', 'topCustomers', selectedId],
    queryFn: () => getTopCustomers(selectedId),
    enabled: Boolean(selectedId),
    staleTime: 60_000,
  });

  // ── 3. Recent Orders Query ────────────────────────────────────────────────
  const {
    data: ordersData,
    isLoading: isLoadingOrders,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: ['owner', 'orders', selectedId, { limit: 5 }],
    queryFn: () => getRestaurantOrders(selectedId, { limit: 5 }),
    enabled: Boolean(selectedId),
    staleTime: 30_000,
  });

  // ── 4. Menu Count Query ───────────────────────────────────────────────────
  const { data: menuData } = useQuery({
    queryKey: ['owner', 'menu', selectedId],
    queryFn: () => getMenu(selectedId),
    enabled: Boolean(selectedId),
    staleTime: 60_000,
  });

  // ── 5. Reviews Count Query ────────────────────────────────────────────────
  const { data: reviewsData } = useQuery({
    queryKey: ['owner', 'reviews', selectedId],
    queryFn: () => getRestaurantReviews(selectedId, { limit: 1 }),
    enabled: Boolean(selectedId),
    staleTime: 60_000,
  });

  // ── Mutation: Update Order Status (Accept/Dispatch) ────────────────────────
  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }) => updateOrderStatus(orderId, status),
    onSuccess: (data, variables) => {
      success('Order Updated', `Order status progressed to "${variables.status}".`);
      queryClient.invalidateQueries({ queryKey: ['owner', 'orders', selectedId] });
      queryClient.invalidateQueries({ queryKey: ['owner', 'revenue', selectedId] });
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Could not update order status.';
      toastError('Update Failed', msg);
    },
  });

  // ── Format Revenue Chart Data ──────────────────────────────────────────────
  const chartDays = useMemo(() => {
    if (!revenueData?.days || revenueData.days.length === 0) return [];
    return revenueData.days.map((d) => ({
      rawDate: d.date,
      formattedDate: new Date(d.date).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
      }),
      revenue: d.revenue,
    }));
  }, [revenueData]);

  // ── Dynamic Order Status Distribution ──────────────────────────────────────
  const statusDistribution = useMemo(() => {
    const orders = ordersData?.orders ?? [];
    if (orders.length === 0) {
      return [
        { name: 'Delivered', value: 8, color: '#15803D' },
        { name: 'In Kitchen', value: 2, color: '#C85A32' },
        { name: 'New Placed', value: 1, color: '#D97706' },
      ];
    }

    const counts = { placed: 0, preparing: 0, delivered: 0, cancelled: 0 };
    orders.forEach((o) => {
      if (counts[o.status] !== undefined) counts[o.status]++;
    });

    return [
      { name: 'Delivered', value: counts.delivered, color: '#15803D' },
      { name: 'In Kitchen', value: counts.preparing, color: '#C85A32' },
      { name: 'New Placed', value: counts.placed, color: '#D97706' },
      { name: 'Cancelled', value: counts.cancelled, color: '#B91C1C' },
    ].filter((item) => item.value > 0);
  }, [ordersData]);

  const recentOrders = ordersData?.orders ?? [];
  const totalOrdersCount = ordersData?.total ?? 0;
  const topCustomers = topCustomersData?.topCustomers ?? [];
  const menuCount = menuData?.count ?? 0;
  const reviewsCount = reviewsData?.total ?? 0;

  const handleRefreshAll = () => {
    refetchRevenue();
    refetchOrders();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* ── Top Dashboard Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutralBorder pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-charcoal">
              Kitchen Performance
            </h1>
            <Badge
              variant={activeRestaurant?.isOpen ? 'veg' : 'default'}
              size="sm"
            >
              {activeRestaurant?.isOpen ? 'Open Now' : 'Closed'}
            </Badge>
          </div>
          <p className="text-xs text-charcoal-secondary mt-1">
            Managing <strong className="text-charcoal font-semibold">{activeRestaurant?.name}</strong> •{' '}
            {[activeRestaurant?.area, activeRestaurant?.city].filter(Boolean).join(', ')}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRefreshAll}
            leftIcon={<RefreshCcw size={14} className={isLoadingRevenue ? 'animate-spin' : ''} />}
          >
            Refresh Data
          </Button>

          <Link to="/owner/orders">
            <Button variant="primary" size="sm" rightIcon={<ChevronRight size={14} />}>
              Live Order Pipeline
            </Button>
          </Link>
        </div>
      </div>

      {/* ── 4 Top KPI Cards ── */}
      <DashboardKpiGrid
        isLoadingRevenue={isLoadingRevenue}
        revenueData={revenueData}
        isLoadingOrders={isLoadingOrders}
        totalOrdersCount={totalOrdersCount}
        menuCount={menuCount}
        reviewsCount={reviewsCount}
        activeRestaurant={activeRestaurant}
        toggleRestaurantOpen={toggleRestaurantOpen}
        isUpdatingStatus={isUpdatingStatus}
      />

      {/* ── Charts Row (2 Columns: Revenue Area Chart + Status Distribution Donut) ── */}
      <DashboardChartsRow
        isLoadingRevenue={isLoadingRevenue}
        chartDays={chartDays}
        revenueData={revenueData}
        isLoadingOrders={isLoadingOrders}
        statusDistribution={statusDistribution}
      />

      {/* ── Bottom Section: Recent Orders (7 cols) + VIP Customers Leaderboard (5 cols) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7">
          <DashboardRecentOrders
            isLoadingOrders={isLoadingOrders}
            recentOrders={recentOrders}
            isUpdatingStatus={updateStatusMutation.isLoading}
            onUpdateStatus={(orderId, status) => updateStatusMutation.mutate({ orderId, status })}
          />
        </div>

        <div className="lg:col-span-5">
          <DashboardVipList
            isLoadingCustomers={isLoadingCustomers}
            topCustomers={topCustomers}
          />
        </div>
      </div>
    </div>
  );
}
