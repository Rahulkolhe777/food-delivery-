import React from 'react';
import { Plus, Minus } from 'lucide-react';
import DietaryIndicator from './DietaryIndicator';
import PriceDisplay from './PriceDisplay';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export default function FoodCard({
  item,
  quantity = 0,
  onAdd,
  onRemove,
  imageUrl,
  className,
}) {
  const {
    name = 'Dish Name',
    category,
    price = 0,
    isVeg = true,
    isAvailable = true,
  } = item || {};

  return (
    <div
      className={cn(
        'bg-surface border border-neutralBorder rounded-2xl p-4 shadow-warm-xs transition-all duration-150',
        'hover:border-neutralBorder-strong hover:shadow-warm-sm flex items-start justify-between gap-4',
        !isAvailable && 'opacity-60 bg-surface-subtle',
        className
      )}
    >
      {/* Left Column: Dish details */}
      <div className="flex-1 min-w-0 pr-2">
        <div className="flex items-center gap-2 mb-1.5">
          <DietaryIndicator isVeg={isVeg} size="sm" />
          {category && (
            <span className="text-[11px] font-medium text-charcoal-muted uppercase tracking-wider">
              {category}
            </span>
          )}
          {!isAvailable && (
            <Badge variant="default" size="sm" className="text-[10px] text-charcoal-muted">
              Sold Out
            </Badge>
          )}
        </div>

        <h4 className="font-display text-base font-semibold text-charcoal tracking-tight leading-snug line-clamp-1">
          {name}
        </h4>

        <div className="mt-2">
          <PriceDisplay price={price} size="md" />
        </div>
      </div>

      {/* Right Column: Image thumbnail + Add/Quantity Stepper */}
      <div className="flex flex-col items-center flex-shrink-0 relative">
        {imageUrl ? (
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-subtle border border-neutralBorder mb-2">
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ) : null}

        {isAvailable ? (
          quantity > 0 ? (
            /* Stepper */
            <div className="flex items-center bg-terracotta-500 text-white rounded-xl shadow-sm overflow-hidden h-8 px-1">
              <button
                type="button"
                onClick={onRemove}
                className="w-7 h-full flex items-center justify-center hover:bg-terracotta-600 active:bg-terracotta-700 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-7 text-center text-xs font-bold select-none">
                {quantity}
              </span>
              <button
                type="button"
                onClick={onAdd}
                disabled={quantity >= 20}
                className="w-7 h-full flex items-center justify-center hover:bg-terracotta-600 active:bg-terracotta-700 transition-colors disabled:opacity-50"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Add button */
            <Button
              variant="secondary"
              size="sm"
              onClick={onAdd}
              leftIcon={<Plus className="w-3.5 h-3.5 text-terracotta-500" />}
              className="text-terracotta-600 hover:text-terracotta-700 hover:border-terracotta-300 font-semibold px-3 py-1.5 h-8"
            >
              Add
            </Button>
          )
        ) : (
          <span className="text-xs text-charcoal-muted font-medium py-1">Unavailable</span>
        )}
      </div>
    </div>
  );
}

