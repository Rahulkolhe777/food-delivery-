import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoadingState({
  message = 'Preparing your culinary experience…',
  compact = false,
  className,
}) {
  if (compact) {
    return (
      <div className={cn('flex items-center justify-center gap-2.5 p-4 text-charcoal-secondary text-sm', className)}>
        <Loader2 className="w-4 h-4 animate-spin text-terracotta-500" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-12 min-h-[220px]',
        className
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-terracotta-50 border border-terracotta-100 flex items-center justify-center text-terracotta-500 mb-4 shadow-warm-xs">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
      <p className="font-display text-base font-semibold text-charcoal">{message}</p>
      <p className="text-xs text-charcoal-muted mt-1">Connecting to kitchen services</p>
    </div>
  );
}

