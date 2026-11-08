import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui';
import DietaryIndicator from '@/components/shared/DietaryIndicator';
import { formatCurrency, cn } from '@/lib/utils';

export default function OwnerMenuTable({
  dishes = [],
  onEditDish,
  onDeleteDish,
  onToggleStock,
  isToggling = false,
}) {
  return (
    <div className="bg-surface border border-neutralBorder rounded-2xl shadow-warm-xs overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-surface-subtle/80 text-[11px] uppercase tracking-wider text-charcoal-muted border-b border-neutralBorder">
            <TableHead className="w-12 text-center">Diet</TableHead>
            <TableHead>Dish Specification</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Price (INR)</TableHead>
            <TableHead className="text-center">Live Kitchen Stock</TableHead>
            <TableHead className="text-right w-28">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-neutralBorder-light">
          {dishes.map((dish) => (
            <TableRow
              key={dish._id}
              className={cn(
                'transition-colors',
                !dish.isAvailable && 'bg-surface-subtle/50 opacity-80'
              )}
            >
              {/* Dietary Icon */}
              <TableCell className="text-center">
                <div className="flex justify-center">
                  <DietaryIndicator isVeg={dish.isVeg} size="sm" />
                </div>
              </TableCell>

              {/* Dish Name */}
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-semibold text-charcoal text-sm">
                    {dish.name}
                  </span>
                  <span className="text-[11px] text-charcoal-muted font-mono">
                    ID: {dish._id.slice(-8)}
                  </span>
                </div>
              </TableCell>

              {/* Category */}
              <TableCell>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-subtle border border-neutralBorder text-charcoal-secondary">
                  {dish.category || 'Other'}
                </span>
              </TableCell>

              {/* Price */}
              <TableCell className="text-right font-mono font-bold text-sm text-terracotta-600">
                {formatCurrency(dish.price)}
              </TableCell>

              {/* Stock Toggle Switch */}
              <TableCell className="text-center">
                <button
                  type="button"
                  disabled={isToggling}
                  onClick={() => onToggleStock(dish._id, dish.isAvailable)}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer',
                    dish.isAvailable
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                      : 'bg-stone-100 text-stone-600 border-stone-300 hover:bg-stone-200'
                  )}
                  title="Click to toggle availability"
                >
                  <span
                    className={cn(
                      'w-2 h-2 rounded-full',
                      dish.isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'
                    )}
                  />
                  <span>{dish.isAvailable ? 'In Stock' : 'Sold Out'}</span>
                </button>
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

