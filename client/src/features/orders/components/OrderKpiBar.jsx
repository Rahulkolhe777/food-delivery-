import React from 'react';
import { Clock, Utensils, CheckCircle2, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function OrderKpiBar({
  totalOrders = 0,
  tabCounts = { placed: 0, preparing: 0, delivered: 0, cancelled: 0 },
  selectedStatus,
  onSelectStatus,
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {/* All Orders */}
      <div
        onClick={() => onSelectStatus('all')}
        className={cn(
          'bg-surface border rounded-xl p-3.5 shadow-warm-xs flex flex-col justify-between cursor-pointer transition-all',
          selectedStatus === 'all'
            ? 'border-charcoal ring-1 ring-charcoal'
            : 'border-neutralBorder hover:border-neutralBorder-strong'
        )}
      >
        <span className="text-[11px] font-semibold text-charcoal-muted uppercase tracking-wider">
          Total Orders
        </span>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="font-display text-2xl font-bold text-charcoal">
            {totalOrders}
          </span>
          <ShoppingBag className="w-4 h-4 text-charcoal-muted" />
        </div>
      </div>

      {/* Placed */}
      <div
        onClick={() => onSelectStatus('placed')}
        className={cn(
          'bg-surface border rounded-xl p-3.5 shadow-warm-xs flex flex-col justify-between cursor-pointer transition-all',
          selectedStatus === 'placed'
            ? 'border-amber-500 ring-1 ring-amber-500'
            : 'border-neutralBorder hover:border-amber-300'
        )}
      >
        <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">
          New Placed
        </span>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="font-display text-2xl font-bold text-amber-600">
            {tabCounts.placed || 0}
          </span>
          <Clock className="w-4 h-4 text-amber-500" />
        </div>
      </div>

      {/* Preparing */}
      <div
        onClick={() => onSelectStatus('preparing')}
        className={cn(
          'bg-surface border rounded-xl p-3.5 shadow-warm-xs flex flex-col justify-between cursor-pointer transition-all',
          selectedStatus === 'preparing'
            ? 'border-terracotta-500 ring-1 ring-terracotta-500'
            : 'border-neutralBorder hover:border-terracotta-300'
        )}
      >
        <span className="text-[11px] font-semibold text-terracotta-700 uppercase tracking-wider">
          Cooking In Prep
        </span>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="font-display text-2xl font-bold text-terracotta-600">
            {tabCounts.preparing || 0}
          </span>
          <Utensils className="w-4 h-4 text-terracotta-500" />
        </div>
      </div>

      {/* Delivered */}
      <div
        onClick={() => onSelectStatus('delivered')}
        className={cn(
          'bg-surface border rounded-xl p-3.5 shadow-warm-xs flex flex-col justify-between cursor-pointer transition-all',
          selectedStatus === 'delivered'
            ? 'border-emerald-500 ring-1 ring-emerald-500'
            : 'border-neutralBorder hover:border-emerald-300'
        )}
      >
        <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
          Delivered
        </span>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="font-display text-2xl font-bold text-emerald-600">
            {tabCounts.delivered || 0}
          </span>
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        </div>
      </div>
    </div>
  );
}

