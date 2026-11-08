import React from 'react';
import { cn } from '@/lib/utils';

export default function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-surface-muted/60',
        className
      )}
      {...props}
    />
  );
}

export function RestaurantCardSkeleton() {
  return (
    <div className="bg-surface border border-neutralBorder rounded-2xl overflow-hidden shadow-warm-sm">
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4 rounded-lg" />
        <Skeleton className="h-3.5 w-1/2 rounded-md" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-5 w-16 rounded-md" />
          <Skeleton className="h-5 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function FoodCardSkeleton() {
  return (
    <div className="bg-surface border border-neutralBorder rounded-2xl p-4 flex gap-4 shadow-warm-sm">
      <div className="flex-1 space-y-2.5">
        <Skeleton className="h-4 w-12 rounded-md" />
        <Skeleton className="h-5 w-3/4 rounded-lg" />
        <Skeleton className="h-4 w-1/4 rounded-md" />
        <Skeleton className="h-3 w-full rounded-md" />
      </div>
      <Skeleton className="w-24 h-24 rounded-xl flex-shrink-0" />
    </div>
  );
}
