import React from 'react';
import { Store, MapPin, Compass, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

export default function RestaurantManagementCard({
  restaurant,
  isSelected,
  onSelect,
  onOpenEdit,
  onOpenDelete,
  onOpenDetails,
  onToggleStatus,
  isToggling = false,
}) {
  const isOpen = restaurant.isOpen !== false;
  const coords = restaurant.location?.coordinates || [77.4126, 23.2599];

  return (
    <div
      className={cn(
        'bg-surface border rounded-3xl p-5 shadow-warm-xs flex flex-col justify-between transition-all duration-200',
        isSelected
          ? 'border-terracotta-500 ring-2 ring-terracotta-400/20 shadow-warm-md'
          : 'border-neutralBorder hover:border-neutralBorder-strong hover:shadow-warm-sm'
      )}
    >
      <div className="space-y-3">
        {/* Header: Icon + Name + Status toggle */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-2xl bg-terracotta-50 text-terracotta-600 flex items-center justify-center shrink-0 shadow-warm-xs">
              <Store size={18} />
            </div>
            <div className="min-w-0">
              <h3 className="font-display text-base font-bold text-charcoal truncate">
                {restaurant.name}
              </h3>
              <p className="text-xs text-charcoal-muted flex items-center gap-1 mt-0.5 truncate">
                <MapPin size={12} className="text-terracotta-500 shrink-0" />
                <span>{[restaurant.area, restaurant.city].filter(Boolean).join(', ')}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isToggling}
            onClick={() => onToggleStatus(restaurant._id, isOpen)}
            className={cn(
              'text-xs font-semibold px-2.5 py-1 rounded-full border transition-all shrink-0 cursor-pointer',
              isOpen
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
            )}
            title="Click to toggle live kitchen ordering"
          >
            {isOpen ? 'Open Now' : 'Closed'}
          </button>
        </div>

        {/* Cuisines Tags */}
        {restaurant.cuisines?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {restaurant.cuisines.slice(0, 3).map((c) => (
              <span
                key={c}
                className="text-[10px] font-semibold bg-surface-subtle border border-neutralBorder-light px-2 py-0.5 rounded-md text-charcoal-secondary"
              >
                {c}
              </span>
            ))}
            {restaurant.cuisines.length > 3 && (
              <span className="text-[10px] text-charcoal-muted px-1 py-0.5 font-medium">
                +{restaurant.cuisines.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Coordinates */}
        <div className="text-[10px] text-charcoal-muted flex items-center gap-1 font-mono">
          <Compass size={11} />
          <span>
            {Number(coords[0]).toFixed(4)}, {Number(coords[1]).toFixed(4)}
          </span>
        </div>
      </div>

      {/* Bottom Actions Bar */}
      <div className="pt-3 border-t border-neutralBorder-light space-y-2 text-xs">
        <Button
          variant={isSelected ? 'secondary' : 'outline'}
          size="sm"
          onClick={() => onSelect(restaurant._id)}
          disabled={isSelected}
          className="w-full text-xs font-semibold cursor-pointer"
        >
          {isSelected ? '✓ Active in Dashboard' : 'Switch to this Location'}
        </Button>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onOpenDetails(restaurant)}
              className="px-2 py-1 text-charcoal-muted hover:text-charcoal rounded-lg hover:bg-surface-subtle transition-colors flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
            >
              <Eye size={13} />
              <span>Details</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenEdit(restaurant)}
              className="px-2 py-1 text-charcoal-muted hover:text-charcoal rounded-lg hover:bg-surface-subtle transition-colors flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
            >
              <Edit size={13} />
              <span>Edit</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => onOpenDelete(restaurant)}
            className="p-1.5 text-charcoal-muted hover:text-culinary-nonveg rounded-lg hover:bg-culinary-nonvegBg transition-colors cursor-pointer"
            title="Delete Restaurant"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

