import React from 'react';
import { cn } from '@/lib/utils';

export default function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  badge,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 mb-8 border-b border-neutralBorder',
        className
      )}
    >
      <div className="space-y-1.5 max-w-2xl">
        {breadcrumbs && (
          <nav className="text-xs font-medium text-charcoal-muted flex items-center gap-1.5 mb-2">
            {breadcrumbs}
          </nav>
        )}

        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
            {title}
          </h1>
          {badge && <div>{badge}</div>}
        </div>

        {description && (
          <p className="text-sm text-charcoal-secondary leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2.5 flex-shrink-0 pt-2 md:pt-0">
          {actions}
        </div>
      )}
    </div>
  );
}

