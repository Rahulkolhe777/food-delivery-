import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RatingStars({
  rating = 0,
  maxRating = 5,
  isInteractive = false,
  onChange,
  size = 'sm',
  showScore = false,
  className,
}) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  const activeValue = hoverRating || rating;

  return (
    <div className={cn('inline-flex items-center gap-1 select-none', className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }, (_, i) => {
          const starValue = i + 1;
          const isFilled = activeValue >= starValue;

          return (
            <button
              key={i}
              type="button"
              disabled={!isInteractive}
              onClick={() => isInteractive && onChange && onChange(starValue)}
              onMouseEnter={() => isInteractive && setHoverRating(starValue)}
              onMouseLeave={() => isInteractive && setHoverRating(0)}
              className={cn(
                'transition-transform duration-100 p-0.5',
                isInteractive && 'cursor-pointer hover:scale-110 active:scale-95'
              )}
              aria-label={`Rate ${starValue} stars`}
            >
              <Star
                className={cn(
                  sizeClasses[size] || sizeClasses.sm,
                  isFilled
                    ? 'fill-amber-400 text-amber-500'
                    : 'fill-neutralBorder-light text-neutralBorder'
                )}
              />
            </button>
          );
        })}
      </div>

      {showScore && (
        <span className="text-xs font-semibold text-charcoal ml-1">
          {Number(rating).toFixed(1)}
        </span>
      )}
    </div>
  );
}

