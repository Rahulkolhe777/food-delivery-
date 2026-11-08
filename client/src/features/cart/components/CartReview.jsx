import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import DietaryIndicator from '@/components/shared/DietaryIndicator';
import { Badge } from '@/components/ui';

export default function CartReview({
  restaurantName,
  items = [],
  totalItems = 0,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) {
  return (
    <div className="bg-surface border border-neutralBorder rounded-3xl p-5 sm:p-6 shadow-warm-xs space-y-4">
      <div className="flex items-center justify-between border-b border-neutralBorder-light pb-3">
        <div>
          <h2 className="font-display text-base font-bold text-charcoal">
            1. Review Ordered Dishes
          </h2>
          <p className="text-xs text-charcoal-secondary mt-0.5">
            Prepared fresh by <strong className="text-charcoal font-semibold">{restaurantName}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="terracotta" size="sm">
            {totalItems} item{totalItems !== 1 ? 's' : ''}
          </Badge>
          <button
            type="button"
            onClick={onClearCart}
            className="text-xs text-charcoal-muted hover:text-culinary-nonveg font-medium transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="divide-y divide-neutralBorder-light">
        {items.map((item) => (
          <div
            key={item.menuItemId}
            className="py-3.5 flex items-center justify-between gap-4"
          >
            {/* Item info */}
            <div className="flex items-start gap-2.5 min-w-0 flex-1">
              <div className="mt-0.5">
                <DietaryIndicator isVeg={item.isVeg} size="sm" />
              </div>
              <div className="min-w-0">
                <h4 className="font-medium text-sm text-charcoal truncate">
                  {item.name}
                </h4>
                <p className="text-xs text-charcoal-muted">
                  {formatCurrency(item.price)} each
                </p>
              </div>
            </div>

            {/* Stepper + Total */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center bg-surface-subtle border border-neutralBorder rounded-xl overflow-hidden h-8">
                <button
                  type="button"
                  onClick={() => {
                    if (item.quantity === 1) {
                      onRemoveItem(item.menuItemId);
                    } else {
                      onUpdateQuantity(item.menuItemId, item.quantity - 1);
                    }
                  }}
                  className="w-7 h-full flex items-center justify-center hover:bg-neutralBorder-light text-charcoal transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  {item.quantity === 1 ? (
                    <Trash2 className="w-3.5 h-3.5 text-culinary-nonveg" />
                  ) : (
                    <Minus className="w-3.5 h-3.5" />
                  )}
                </button>

                <span className="w-7 text-center font-bold text-charcoal select-none text-xs">
                  {item.quantity}
                </span>

                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.menuItemId, item.quantity + 1)}
                  disabled={item.quantity >= 20}
                  className="w-7 h-full flex items-center justify-center hover:bg-neutralBorder-light text-charcoal transition-colors disabled:opacity-40 cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <span className="font-semibold text-sm text-charcoal w-16 text-right tabular-nums">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

