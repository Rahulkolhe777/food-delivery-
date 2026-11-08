import React from 'react';
import { cn } from '@/lib/utils';

export default function EmptyState({
  icon: Icon,
  title = 'No items found',
  description = 'There are no records to display at this moment.',
  action,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-surface/50 border border-dashed border-neutralBorder rounded-2xl',
        className
      )}
    >
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-surface-subtle border border-neutralBorder-light flex items-center justify-center text-charcoal-muted mb-4 shadow-warm-xs">
          <Icon className="w-6 h-6 stroke-[1.75]" />
        </div>
      )}

      <h4 className="font-display text-lg font-semibold text-charcoal tracking-tight">
        {title}
      </h4>

      {description && (
        <p className="text-sm text-charcoal-secondary max-w-sm mt-1.5 leading-relaxed">
          {description}
        </p>
      )}

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
