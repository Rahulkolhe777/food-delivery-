import React from 'react';
import { Avatar, Skeleton } from '@/components/ui';
import { formatCurrency, cn } from '@/lib/utils';

export default function VipCustomersTable({
  topCustomers = [],
  isLoading = false,
}) {
  return (
    <div className="bg-surface border border-neutralBorder rounded-3xl p-6 shadow-warm-xs space-y-4">
      <div className="border-b border-neutralBorder-light pb-3 flex items-center justify-between">
        <div>
          <h2 className="font-display text-base font-bold text-charcoal">
            Top 5 VIP Diners (Lifetime Value)
          </h2>
          <p className="text-xs text-charcoal-secondary">
            Ranked by aggregate spend across delivered kitchen orders
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-subtle border border-neutralBorder text-charcoal-secondary">
          {topCustomers.length} Top Diners
        </span>
      </div>

      {isLoading ? (
        <Skeleton className="h-40 w-full rounded-2xl" />
      ) : topCustomers.length === 0 ? (
        <div className="p-8 text-center text-xs text-charcoal-muted">
          No customer lifetime spend data recorded yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-neutralBorder text-charcoal-muted uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">Diner Name</th>
                <th className="py-2.5 px-3">Email Address</th>
                <th className="py-2.5 px-3 text-center">Delivered Orders</th>
                <th className="py-2.5 px-3 text-right">Avg Order Value</th>
                <th className="py-2.5 px-3 text-right">Total Lifetime Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutralBorder-light">
              {topCustomers.map((cust, idx) => (
                <tr key={cust._id} className="hover:bg-surface-subtle transition-colors">
                  <td className="py-3 px-3">
                    <span
                      className={cn(
                        'inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-[11px]',
                        idx === 0
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : idx === 1
                          ? 'bg-stone-200 text-stone-800'
                          : 'bg-surface-subtle text-charcoal-secondary'
                      )}
                    >
                      #{idx + 1}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={cust.user?.name || 'Customer'} size="sm" />
                      <span className="font-semibold text-charcoal">
                        {cust.user?.name || 'Customer'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-charcoal-secondary font-mono text-[11px]">
                    {cust.user?.email || 'N/A'}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-charcoal font-mono">
                    {cust.totalOrder}
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-charcoal tabular-nums">
                    {formatCurrency(cust.averageOrderValue)}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-terracotta-600 tabular-nums">
                    {formatCurrency(cust.totalRevenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

