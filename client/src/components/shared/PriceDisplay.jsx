import React from 'react';
import { cn } from '@/lib/utils';

export default function PriceDisplay({
  price,
  originalPrice,
  size = 'md',
  className,
}) {
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price || 0);

  const formattedOriginalPrice = originalPrice
    ? new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(originalPrice)
    : null;

  const sizeClasses = {
    sm: 'text-xs font-semibold',
    md: 'text-sm font-semibold',
    lg: 'text-base font-bold',
    xl: 'text-xl font-bold font-display',
  };

  return (
    <div className={cn('inline-flex items-baseline gap-1.5', className)}>
      <span className={cn('text-charcoal tracking-tight', sizeClasses[size] || sizeClasses.md)}>
        {formattedPrice}
      </span>
      {formattedOriginalPrice && (
        <span className="text-xs text-charcoal-muted line-through font-normal">
          {formattedOriginalPrice}
        </span>
      )}
    </div>
  );
}

