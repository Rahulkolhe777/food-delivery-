import React from 'react';
import { formatCurrency } from '@/lib/utils';
import DietaryIndicator from './DietaryIndicator';

export default function OrderItemBill({
  items = [],
  deliveryFee = 40,
  taxRate = 0.05,
  totalAmount,
  className = '',
}) {
  const calculatedSubtotal = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );
  const calculatedTax = Math.round(calculatedSubtotal * taxRate);
  const finalTotal = totalAmount !== undefined ? totalAmount : calculatedSubtotal + deliveryFee + calculatedTax;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Items List */}
      <div className="divide-y divide-neutralBorder-light/70 border-t border-b border-neutralBorder-light">
        {items.map((item, idx) => {
          const itemTotal = (Number(item.price) || 0) * (Number(item.quantity) || 1);
          return (
            <div key={item._id || item.menuItemId || idx} className="py-2.5 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 min-w-0 pr-3">
                <DietaryIndicator isVeg={item.isVeg ?? item.menuItem?.isVeg ?? true} size="sm" />
                <span className="font-medium text-charcoal truncate">
                  {item.name || item.menuItem?.name || 'Dish'}
                </span>
                <span className="text-xs text-charcoal-muted flex-shrink-0">
                  × {item.quantity}
                </span>
              </div>
              <span className="font-medium text-charcoal flex-shrink-0 tabular-nums">
                {formatCurrency(itemTotal)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bill Breakdown */}
      <div className="space-y-1.5 text-xs text-charcoal-secondary pt-1">
        <div className="flex justify-between">
          <span>Item Total</span>
          <span className="font-medium tabular-nums">{formatCurrency(calculatedSubtotal)}</span>
        </div>
        {deliveryFee > 0 && (
          <div className="flex justify-between">
            <span>Delivery Partner Fee</span>
            <span className="font-medium tabular-nums">{formatCurrency(deliveryFee)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Taxes & Restaurant Charges (5%)</span>
          <span className="font-medium tabular-nums">{formatCurrency(calculatedTax)}</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-neutralBorder font-bold text-sm text-charcoal">
          <span>Total Paid / Payable</span>
          <span className="text-terracotta-600 tabular-nums">{formatCurrency(finalTotal)}</span>
        </div>
      </div>
    </div>
  );
}

