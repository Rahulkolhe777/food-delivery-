import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import DietaryIndicator from '@/components/shared/DietaryIndicator';
import { formatCurrency, cn } from '@/lib/utils';

export default function OwnerMenuGrid({
  dishes = [],
  onEditDish,
  onDeleteDish,
  onToggleStock,
  isToggling = false,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {dishes.map((dish) => (
        <div
          key={dish._id}
          className={cn(
            'bg-surface border rounded-2xl p-4 shadow-warm-xs flex flex-col justify-between gap-3 transition-all',
            dish.isAvailable
              ? 'border-neutralBorder'
              : 'border-neutralBorder-light bg-surface-subtle opacity-75'
          )}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <DietaryIndicator isVeg={dish.isVeg} size="sm" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted">
                  {dish.category || 'Other'}
                </span>
              </div>

              {/* Stock Switch */}
              <button
                type="button"
                disabled={isToggling}
                onClick={() => onToggleStock(dish._id, dish.isAvailable)}
                className={cn(
                  'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-all cursor-pointer',
                  dish.isAvailable
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-stone-100 text-stone-600 border-stone-300'
                )}
              >
                <span
                  className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    dish.isAvailable ? 'bg-emerald-500' : 'bg-stone-400'
                  )}
                />
                <span>{dish.isAvailable ? 'In Stock' : 'Sold Out'}</span>
              </button>
            </div>

            <div>
              <h4 className="font-display text-base font-bold text-charcoal leading-snug">
                {dish.name}
              </h4>
              <span className="text-[10px] font-mono text-charcoal-muted">
                #{dish._id.slice(-8)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-neutralBorder-light">
            <span className="font-mono font-bold text-base text-terracotta-600">
              {formatCurrency(dish.price)}
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onEditDish(dish)}
                className="p-1.5 text-charcoal-muted hover:text-charcoal rounded-lg hover:bg-surface-subtle transition-colors cursor-pointer"
                title="Edit Dish"
              >
                <Edit3 size={15} />
              </button>
              <button
                type="button"
                onClick={() => onDeleteDish(dish)}
                className="p-1.5 text-charcoal-muted hover:text-culinary-nonveg rounded-lg hover:bg-culinary-nonvegBg transition-colors cursor-pointer"
                title="Delete Dish"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

