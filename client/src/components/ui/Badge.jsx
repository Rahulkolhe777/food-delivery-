import React from 'react';
import { cn } from '@/lib/utils';

const variantClasses = {
  default:
    'bg-surface-subtle text-charcoal-secondary border-neutralBorder',
  terracotta:
    'bg-terracotta-50 text-terracotta-500 border-terracotta-200',
  veg:
    'bg-culinary-vegBg text-culinary-veg border-emerald-200',
  nonveg:
    'bg-culinary-nonvegBg text-culinary-nonveg border-red-200',
  gold:
    'bg-culinary-goldBg text-amber-800 border-amber-200',
  placed:
    'bg-amber-50 text-amber-700 border-amber-200',
  preparing:
    'bg-terracotta-50 text-terracotta-600 border-terracotta-200',
  delivered:
    'bg-culinary-vegBg text-culinary-veg border-emerald-200',
  cancelled:
    'bg-culinary-nonvegBg text-culinary-nonveg border-red-200',
};

const sizeClasses = {
  sm: 'text-[11px] px-2 py-0.5 rounded-md font-medium',
  md: 'text-xs px-2.5 py-1 rounded-lg font-medium',
  lg: 'text-sm px-3 py-1.5 rounded-lg font-semibold',
};

export default function Badge({
  variant = 'default',
  size = 'md',
  className,
  icon,
  children,
  ...props
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 border tracking-tight transition-colors',
        variantClasses[variant] || variantClasses.default,
        sizeClasses[size] || sizeClasses.md,
        className
      )}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
