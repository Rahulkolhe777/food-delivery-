/**
 * OwnerAnalyticsPage — Restaurant revenue, order distribution & VIP customers dashboard.
 * Decomposed using:
 *  - features/analytics: AnalyticsKpiGrid, RevenueChart, OrderStatusDonut, VipCustomersTable
 */

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { RefreshCcw, Calendar, AlertCircle } from 'lucide-react';

import { useOwnerRestaurant } from '@/context/OwnerRestaurantContext';
import {
  getRestaurantRevenue,
  getTopCustomers,
  getTopDishes,
} from '@/features/analytics';
import { getRestaurantOrders } from '@/features/orders';
import { queryKeys } from '@/lib/queryKeys';
import { formatDateISO, cn } from '@/lib/utils';
import { Button } from '@/components/ui';

// Decomposed Feature Components
import AnalyticsKpiGrid from '@/features/analytics/components/AnalyticsKpiGrid';
import RevenueChart from '@/features/analytics/components/RevenueChart';
import OrderStatusDonut from '@/features/analytics/components/OrderStatusDonut';
import VipCustomersTable from '@/features/analytics/components/VipCustomersTable';

const STATUS_COLORS = {
  delivered: '#2D6A4F',
  preparing: '#C85A32',
  placed: '#D97706',
  cancelled: '#8C857B',
};

function getPresetDateRange(presetDays) {
  const now = new Date();
  const past = new Date();
  past.setDate(now.getDate() - (typeof presetDays === 'number' ? presetDays : 30));
  return {
    fromDate: formatDateISO(past),
    toDate: formatDateISO(now),
  };
}

export default function OwnerAnalyticsPage() {
  const { activeRestaurant, selectedId } = useOwnerRestaurant();

  // Date Range Filter
  const [rangePreset, setRangePreset] = useState(30);
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [appliedCustomDates, setAppliedCustomDates] = useState(null);

  const { fromDate, toDate } = useMemo(() => {
    if (appliedCustomDates) return appliedCustomDates;
    return getPresetDateRange(rangePreset);
  }, [rangePreset, appliedCustomDates]);

  // Query 1: Revenue Aggregation
  const {
    data: revenueData,
    isLoading: isLoadingRev,
    isError: isErrorRev,
    isFetching: isFetchingRev,
    refetch: refetchRevenue,
  } = useQuery({
    queryKey: queryKeys.analytics.revenue(selectedId, { from: fromDate, to: toDate }),
    queryFn: () => getRestaurantRevenue(selectedId, { from: fromDate, to: toDate }),
    enabled: Boolean(selectedId),
  });

  // Query 2: Top Customers
  const {
    data: topCustomersData,
    isLoading: isLoadingCust,
    refetch: refetchCustomers,
  } = useQuery({
    queryKey: queryKeys.analytics.topCustomers(selectedId),
    queryFn: () => getTopCustomers(selectedId),
    enabled: Boolean(selectedId),
  });

  // Query 3: Order Queue for Status Distribution
  const {
    data: ordersData,
    isLoading: isLoadingOrders,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: queryKeys.orders.restaurant(selectedId, { limit: 100 }),
    queryFn: () => getRestaurantOrders(selectedId, { limit: 100 }),
    enabled: Boolean(selectedId),
  });

  // Query 4: Top Dishes (Backend 501 stub)
  const { isError: isTopDishesStub } = useQuery({
    queryKey: ['analytics', 'top-dishes', selectedId],
    queryFn: () => getTopDishes(selectedId),
    enabled: Boolean(selectedId),
    retry: false,
  });

  const chartData = revenueData?.days || [];
  const topCustomers = topCustomersData?.topCustomers || [];

  // Revenue metrics calculation
  const revenueStats = useMemo(() => {
    const days = revenueData?.days || [];
    const totalRev = revenueData?.revenue ?? 0;
    const activeDays = days.filter((d) => d.revenue > 0);
    const avgDaily = activeDays.length > 0 ? Math.round(totalRev / activeDays.length) : 0;

    let peakDay = null;
    let maxRev = 0;
    days.forEach((d) => {
      if (d.revenue > maxRev) {
        maxRev = d.revenue;
        peakDay = d;
      }
    });

    return { totalRev, avgDaily, activeDaysCount: activeDays.length, peakDay, maxRev };
  }, [revenueData?.revenue, revenueData?.days]);

  // Order status counts
  const statusStats = useMemo(() => {
    const list = ordersData?.orders || [];
    const counts = { placed: 0, preparing: 0, delivered: 0, cancelled: 0 };
    list.forEach((o) => {
      if (counts[o.status] !== undefined) counts[o.status]++;
    });

    const total = list.length;
    const deliveredCount = counts.delivered;
    const fulfillmentRate = total > 0 ? Math.round((deliveredCount / total) * 100) : 0;
    const totalDeliveredRevenue = list
      .filter((o) => o.status === 'delivered')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const avgOrderValue = deliveredCount > 0 ? Math.round(totalDeliveredRevenue / deliveredCount) : 0;

    const pieData = [
      { name: 'Delivered', value: counts.delivered, color: STATUS_COLORS.delivered },
      { name: 'In Kitchen Prep', value: counts.preparing, color: STATUS_COLORS.preparing },
      { name: 'New Orders', value: counts.placed, color: STATUS_COLORS.placed },
      { name: 'Cancelled', value: counts.cancelled, color: STATUS_COLORS.cancelled },
    ].filter((item) => item.value > 0);

    return { counts, total, fulfillmentRate, avgOrderValue, pieData };
  }, [ordersData?.orders]);

  const handleApplyCustomDates = (e) => {
    e.preventDefault();
    if (!customFrom || !customTo) return;
    setAppliedCustomDates({ fromDate: customFrom, toDate: customTo });
  };

  const handleRefreshAll = () => {
    refetchRevenue();
    refetchCustomers();
    refetchOrders();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-7">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutralBorder pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
              Restaurant Analytics & Growth
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-terracotta-50 text-terracotta-700 border border-terracotta-200">
              Live Aggregations
            </span>
          </div>
          <p className="text-xs text-charcoal-secondary mt-1">
            Real delivered order curves, customer spend lifetime value, and fulfillment efficiency for{' '}
            <strong className="text-charcoal font-semibold">{activeRestaurant?.name}</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Preset Buttons */}
          <div className="flex items-center p-1 bg-surface-subtle border border-neutralBorder rounded-xl text-xs">
            {[
              { val: 7, label: '7D' },
              { val: 14, label: '14D' },
              { val: 30, label: '30D' },
              { val: 90, label: '90D' },
              { val: 'custom', label: 'Custom' },
            ].map((p) => (
              <button
                key={p.val}
                type="button"
                onClick={() => {
                  setRangePreset(p.val);
                  if (p.val !== 'custom') setAppliedCustomDates(null);
                }}
                className={cn(
                  'px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer',
                  rangePreset === p.val
                    ? 'bg-surface text-charcoal font-bold shadow-warm-xs'
                    : 'text-charcoal-secondary hover:text-charcoal'
                )}
              >
                {p.label}
              </button>
            ))}
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleRefreshAll}
            disabled={isFetchingRev}
            leftIcon={<RefreshCcw size={14} className={isFetchingRev ? 'animate-spin' : ''} />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Custom Window Drawer */}
      {rangePreset === 'custom' && (
        <form
          onSubmit={handleApplyCustomDates}
          className="p-4 bg-surface border border-neutralBorder rounded-2xl shadow-warm-xs flex flex-wrap items-center gap-3 text-xs"
        >
          <div className="flex items-center gap-2">
            <Calendar size={15} className="text-charcoal-muted" />
            <span className="font-semibold text-charcoal">Custom Window:</span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-charcoal-muted">From:</label>
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              required
              className="h-9 px-2.5 bg-surface-subtle border border-neutralBorder rounded-xl text-xs text-charcoal focus:outline-none focus:border-terracotta-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-charcoal-muted">To:</label>
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              required
              className="h-9 px-2.5 bg-surface-subtle border border-neutralBorder rounded-xl text-xs text-charcoal focus:outline-none focus:border-terracotta-400"
            />
          </div>

          <Button type="submit" variant="primary" size="sm">
            Apply Custom Window
          </Button>
        </form>
      )}

      {/* 5 KPI Metric Cards */}
      <AnalyticsKpiGrid
        totalRev={revenueStats.totalRev}
        deliveredOrders={statusStats.counts.delivered}
        fulfillmentRate={statusStats.fulfillmentRate}
        avgOrderValue={statusStats.avgOrderValue}
        avgDaily={revenueStats.avgDaily}
        activeDaysCount={revenueStats.activeDaysCount}
        topCustomer={topCustomers[0]}
        fromDate={fromDate}
        toDate={toDate}
        isLoadingRev={isLoadingRev}
        isLoadingOrders={isLoadingOrders}
      />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart
            chartData={chartData}
            fromDate={fromDate}
            toDate={toDate}
            peakDay={revenueStats.peakDay}
            maxRevenue={revenueStats.maxRev}
            isLoading={isLoadingRev}
            isError={isErrorRev}
          />
        </div>

        <div className="lg:col-span-1">
          <OrderStatusDonut
            pieData={statusStats.pieData}
            counts={statusStats.counts}
            total={statusStats.total}
            isLoading={isLoadingOrders}
          />
        </div>
      </div>

      {/* VIP Customers Table */}
      <VipCustomersTable
        topCustomers={topCustomers}
        isLoading={isLoadingCust}
      />

      {/* Backend 501 Top Dishes Notice */}
      {isTopDishesStub && (
        <div className="p-4 rounded-2xl bg-surface border border-neutralBorder-light flex items-center justify-between text-xs text-charcoal-muted shadow-warm-xs">
          <div className="flex items-center gap-2">
            <AlertCircle size={15} className="text-amber-500 shrink-0" />
            <span>
              <strong>Backend Endpoint Transparency:</strong> <code>GET /api/analytics/restaurants/:id/top-dishes</code> returns <em>501 Not Implemented Yet</em> on the server.
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider font-mono bg-surface-subtle px-2 py-0.5 rounded border">
            Task 2 Roadmap
          </span>
        </div>
      )}
    </div>
  );
}
