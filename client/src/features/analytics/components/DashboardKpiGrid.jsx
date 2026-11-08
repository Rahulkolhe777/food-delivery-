import React from 'react';
import { TrendingUp, ShoppingBag, Utensils, Star, Store } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';

export default function DashboardKpiGrid({
  isLoadingRevenue,
  revenueData,
  isLoadingOrders,
  totalOrdersCount,
  menuCount,
  reviewsCount,
  activeRestaurant,
  toggleRestaurantOpen,
  isUpdatingStatus,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* KPI 1: Revenue */}
      <div className="bg-surface border border-neutralBorder rounded-3xl p-5 shadow-warm-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider">
            Recent Revenue
          </span>
          <div className="w-8 h-8 rounded-xl bg-terracotta-50 text-terracotta-600 flex items-center justify-center">
            <TrendingUp size={16} />
          </div>
        </div>
        <div>
          <h3 className="font-display text-2xl font-bold text-charcoal">
            {isLoadingRevenue ? '...' : formatCurrency(revenueData?.revenue || 0)}
          </h3>
          <p className="text-[11px] text-charcoal-muted mt-0.5">
            Delivered earnings (7-day window)
          </p>
        </div>
      </div>

      {/* KPI 2: Total Orders */}
      <div className="bg-surface border border-neutralBorder rounded-3xl p-5 shadow-warm-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider">
            Total Orders
          </span>
          <div className="w-8 h-8 rounded-xl bg-surface-subtle text-charcoal flex items-center justify-center">
            <ShoppingBag size={16} />
          </div>
        </div>
        <div>
          <h3 className="font-display text-2xl font-bold text-charcoal">
            {isLoadingOrders ? '...' : totalOrdersCount.toLocaleString()}
          </h3>
          <p className="text-[11px] text-charcoal-muted mt-0.5">
            Processed in restaurant ledger
          </p>
        </div>
      </div>

      {/* KPI 3: Menu Items & Reviews */}
      <div className="bg-surface border border-neutralBorder rounded-3xl p-5 shadow-warm-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider">
            Dishes & Reviews
          </span>
          <div className="w-8 h-8 rounded-xl bg-surface-subtle text-charcoal flex items-center justify-center">
            <Utensils size={16} />
          </div>
        </div>
        <div>
          <h3 className="font-display text-2xl font-bold text-charcoal">
            {menuCount} Dishes
          </h3>
          <p className="text-[11px] text-charcoal-muted mt-0.5 flex items-center gap-1">
            <Star size={12} className="text-amber-500 fill-amber-400" />
            <span>{reviewsCount.toLocaleString()} verified customer reviews</span>
          </p>
        </div>
      </div>

      {/* KPI 4: Kitchen Ordering State */}
      <div className="bg-surface border border-neutralBorder rounded-3xl p-5 shadow-warm-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider">
            Operational Status
          </span>
          <div
            className={cn(
              'w-8 h-8 rounded-xl flex items-center justify-center',
              activeRestaurant?.isOpen ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
            )}
          >
            <Store size={16} />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'w-2.5 h-2.5 rounded-full',
                activeRestaurant?.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              )}
            />
            <span className="font-display text-xl font-bold text-charcoal">
              {activeRestaurant?.isOpen ? 'Open for Orders' : 'Paused / Closed'}
            </span>
          </div>
          <button
            type="button"
            onClick={toggleRestaurantOpen}
            disabled={isUpdatingStatus}
            className="mt-1 text-xs text-terracotta-600 font-semibold underline hover:text-terracotta-700 block transition-colors"
          >
            {activeRestaurant?.isOpen ? 'Pause incoming orders' : 'Open kitchen now'}
          </button>
        </div>
      </div>
    </div>
  );
}

