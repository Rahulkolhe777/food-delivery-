import React from 'react';
import { Users } from 'lucide-react';
import Skeleton from '@/components/ui/Skeleton';
import { formatCurrency, cn } from '@/lib/utils';

export default function DashboardVipList({
  isLoadingCustomers,
  topCustomers = [],
}) {
  return (
    <div className="bg-surface border border-neutralBorder rounded-3xl p-6 shadow-warm-xs space-y-4">
      <div className="flex items-center justify-between border-b border-neutralBorder-light pb-3">
        <div>
          <h2 className="font-display text-base font-bold text-charcoal">
            Top Customers (VIP)
          </h2>
          <p className="text-xs text-charcoal-secondary">
            Highest-spending repeat diners
          </p>
        </div>
        <Users size={16} className="text-terracotta-500" />
      </div>

      {isLoadingCustomers ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-2xl" />
          ))}
        </div>
      ) : topCustomers.length === 0 ? (
        <div className="p-8 text-center text-charcoal-muted space-y-2">
          <Users className="w-8 h-8 mx-auto stroke-[1.5]" />
          <p className="text-xs">No customer aggregations available yet.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {topCustomers.map((cust, idx) => (
            <div
              key={cust._id}
              className="p-3 bg-surface-subtle border border-neutralBorder-light rounded-2xl flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={cn(
                    'w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[10px] shrink-0',
                    idx === 0
                      ? 'bg-amber-100 text-amber-800'
                      : idx === 1
                      ? 'bg-stone-200 text-stone-700'
                      : 'bg-surface text-charcoal-muted'
                  )}
                >
                  #{idx + 1}
                </span>
                <div className="truncate">
                  <p className="font-bold text-charcoal truncate">
                    {cust.user?.name || 'Verified Diner'}
                  </p>
                  <p className="text-[10px] text-charcoal-muted">
                    {cust.totalOrder} orders • AOV: {formatCurrency(Math.round(cust.averageOrderValue || 0))}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="font-bold text-terracotta-600 block">
                  {formatCurrency(cust.totalRevenue)}
                </span>
                <span className="text-[10px] text-charcoal-muted">Lifetime</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

