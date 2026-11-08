import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AnalyticsKpiGrid({
  totalRev = 0,
  deliveredOrders = 0,
  fulfillmentRate = 0,
  avgOrderValue = 0,
  avgDaily = 0,
  activeDaysCount = 0,
  topCustomer = null,
  fromDate,
  toDate,
  isLoadingRev = false,
  isLoadingOrders = false,
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {/* Period Revenue */}
      <div className="bg-surface border border-neutralBorder rounded-2xl p-4 shadow-warm-xs flex flex-col justify-between">
        <span className="text-[11px] font-semibold text-charcoal-muted uppercase tracking-wider">
          Period Gross Revenue
        </span>
        <div className="mt-2">
          <h3 className="font-display text-2xl font-bold text-terracotta-600">
            {isLoadingRev ? '...' : formatCurrency(totalRev)}
          </h3>
          <p className="text-[10px] text-charcoal-muted mt-1">
            Delivered ({fromDate} to {toDate})
          </p>
        </div>
      </div>

      {/* Total Orders */}
      <div className="bg-surface border border-neutralBorder rounded-2xl p-4 shadow-warm-xs flex flex-col justify-between">
        <span className="text-[11px] font-semibold text-charcoal-muted uppercase tracking-wider">
          Delivered Orders
        </span>
        <div className="mt-2">
          <h3 className="font-display text-2xl font-bold text-charcoal">
            {isLoadingOrders ? '...' : deliveredOrders}
          </h3>
          <p className="text-[10px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 size={11} />
            {fulfillmentRate}% Fulfillment Rate
          </p>
        </div>
      </div>

      {/* Avg Order Value */}
      <div className="bg-surface border border-neutralBorder rounded-2xl p-4 shadow-warm-xs flex flex-col justify-between">
        <span className="text-[11px] font-semibold text-charcoal-muted uppercase tracking-wider">
          Avg Order Value (AOV)
        </span>
        <div className="mt-2">
          <h3 className="font-display text-2xl font-bold text-charcoal">
            {isLoadingOrders ? '...' : formatCurrency(avgOrderValue)}
          </h3>
          <p className="text-[10px] text-charcoal-muted mt-1">
            Average receipt across orders
          </p>
        </div>
      </div>

      {/* Daily Run Rate */}
      <div className="bg-surface border border-neutralBorder rounded-2xl p-4 shadow-warm-xs flex flex-col justify-between">
        <span className="text-[11px] font-semibold text-charcoal-muted uppercase tracking-wider">
          Daily Run Rate
        </span>
        <div className="mt-2">
          <h3 className="font-display text-2xl font-bold text-charcoal">
            {isLoadingRev ? '...' : formatCurrency(avgDaily)}
          </h3>
          <p className="text-[10px] text-charcoal-muted mt-1">
            Across {activeDaysCount} active days
          </p>
        </div>
      </div>

      {/* Top Diner Contribution */}
      <div className="bg-surface border border-neutralBorder rounded-2xl p-4 shadow-warm-xs flex flex-col justify-between col-span-2 sm:col-span-1">
        <span className="text-[11px] font-semibold text-charcoal-muted uppercase tracking-wider">
          Top VIP Diner Spend
        </span>
        <div className="mt-2">
          <h3 className="font-display text-2xl font-bold text-charcoal">
            {topCustomer ? formatCurrency(topCustomer.totalRevenue) : '₹0'}
          </h3>
          <p className="text-[10px] text-charcoal-muted mt-1 truncate">
            {topCustomer?.user?.name || 'Top Customer'}
          </p>
        </div>
      </div>
    </div>
  );
}

