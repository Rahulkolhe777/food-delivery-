import React from 'react';
import { Search, X, LayoutList, Grid } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function OwnerOrdersFilterBar({
  searchQuery,
  setSearchQuery,
  paymentFilter,
  setPaymentFilter,
  viewMode,
  setViewMode,
}) {
  return (
    <div className="bg-surface border border-neutralBorder rounded-2xl p-4 shadow-warm-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-muted pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by order ID (#XXXXXX), customer name, or dish..."
          className="w-full h-10 pl-10 pr-9 bg-surface-subtle border border-neutralBorder rounded-xl text-xs text-charcoal placeholder:text-charcoal-muted focus:outline-none focus:border-terracotta-400 focus:bg-surface transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-charcoal cursor-pointer"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="h-10 px-3 bg-surface border border-neutralBorder rounded-xl text-xs text-charcoal font-medium focus:outline-none focus:border-terracotta-400 cursor-pointer"
        >
          <option value="all">All Payment Methods</option>
          <option value="upi">UPI Transfers</option>
          <option value="card">Card Payments</option>
          <option value="cod">Cash on Delivery</option>
        </select>

        <div className="flex items-center bg-surface-subtle p-1 border border-neutralBorder rounded-xl">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={cn(
              'p-1.5 rounded-lg text-xs transition-colors cursor-pointer',
              viewMode === 'table'
                ? 'bg-surface text-charcoal font-semibold shadow-warm-xs'
                : 'text-charcoal-muted hover:text-charcoal'
            )}
            title="Table View"
          >
            <LayoutList size={16} />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={cn(
              'p-1.5 rounded-lg text-xs transition-colors cursor-pointer',
              viewMode === 'cards'
                ? 'bg-surface text-charcoal font-semibold shadow-warm-xs'
                : 'text-charcoal-muted hover:text-charcoal'
            )}
            title="Cards View"
          >
            <Grid size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

