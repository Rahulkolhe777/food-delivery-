import React from 'react';
import { cn } from '@/lib/utils';

export default function DietaryIndicator({ isVeg = true, size = 'md', className }) {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5 p-0.5',
    md: 'w-4 h-4 p-0.5',
    lg: 'w-5 h-5 p-1',
  };

  if (isVeg) {
    return (
      <span
        title="Vegetarian"
        className={cn(
          'inline-flex items-center justify-center border border-culinary-veg rounded-sm flex-shrink-0 bg-white',
          sizeClasses[size] || sizeClasses.md,
          className
        )}
      >
        <span className="w-full h-full rounded-full bg-culinary-veg" />
      </span>
    );
  }

  return (
    <span
      title="Non-Vegetarian"
      className={cn(
        'inline-flex items-center justify-center border border-culinary-nonveg rounded-sm flex-shrink-0 bg-white',
        sizeClasses[size] || sizeClasses.md,
        className
      )}
    >
      <span
        className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[6px] border-b-culinary-nonveg"
      />
    </span>
  );
}

