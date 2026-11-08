import React from 'react';
import { Utensils, CheckCircle2, AlertCircle } from 'lucide-react';

export default function MenuKpiBar({
  totalItems = 0,
  inStockCount = 0,
  vegCount = 0,
  nonVegCount = 0,
}) {
  const soldOutCount = totalItems - inStockCount;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {/* Total Items */}
      <div className="bg-surface border border-neutralBorder rounded-2xl p-3.5 shadow-warm-xs flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-surface-subtle text-charcoal flex items-center justify-center flex-shrink-0">
          <Utensils size={18} />
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-muted block">
            Catalog Items
          </span>
          <span className="font-display text-xl font-bold text-charcoal">
            {totalItems}
          </span>
        </div>
      </div>

      {/* In Stock */}
      <div className="bg-surface border border-neutralBorder rounded-2xl p-3.5 shadow-warm-xs flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-culinary-vegBg text-culinary-veg flex items-center justify-center flex-shrink-0">
          <CheckCircle2 size={18} />
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-muted block">
            In Stock
          </span>
          <span className="font-display text-xl font-bold text-culinary-veg">
            {inStockCount}
          </span>
        </div>
      </div>

      {/* Sold Out */}
      <div className="bg-surface border border-neutralBorder rounded-2xl p-3.5 shadow-warm-xs flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-surface-subtle text-charcoal-muted flex items-center justify-center flex-shrink-0">
          <AlertCircle size={18} />
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-muted block">
            Sold Out
          </span>
          <span className="font-display text-xl font-bold text-charcoal-secondary">
            {soldOutCount}
          </span>
        </div>
      </div>

      {/* Veg vs Non-Veg */}
      <div className="bg-surface border border-neutralBorder rounded-2xl p-3.5 shadow-warm-xs flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-terracotta-50 text-terracotta-600 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold font-mono">V/NV</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-muted block">
            Ratio (Veg / NV)
          </span>
          <span className="font-display text-xl font-bold text-charcoal">
            {vegCount} <span className="text-xs text-charcoal-muted">/</span> {nonVegCount}
          </span>
        </div>
      </div>
    </div>
  );
}

