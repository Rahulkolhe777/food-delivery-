import React from 'react';
import { ThumbsUp, Star } from 'lucide-react';
import RatingStars from '@/components/food/RatingStars';
import { cn } from '@/lib/utils';

export default function OwnerRatingDistribution({
  distribution,
  total = 0,
  ratingFilter = 0,
  onSelectRatingFilter,
}) {
  return (
    <div className="bg-surface border border-neutralBorder rounded-3xl p-6 shadow-warm-xs grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left: Big Rating Score */}
      <div className="flex flex-col justify-center items-center md:items-start md:border-r border-neutralBorder-light md:pr-6 space-y-2 text-center md:text-left">
        <span className="text-[11px] font-semibold text-charcoal-muted uppercase tracking-wider">
          Overall Diner Rating
        </span>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-5xl font-extrabold text-charcoal">
            {distribution.avgRating}
          </span>
          <span className="text-base text-charcoal-muted font-bold">/ 5.0</span>
        </div>
        <RatingStars rating={Number(distribution.avgRating)} size="md" />
        <p className="text-xs text-charcoal-secondary mt-1">
          Based on <strong className="text-charcoal">{total}</strong> verified customer reviews
        </p>
        <div className="pt-2 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
          <ThumbsUp size={14} className="text-emerald-600" />
          <span>{distribution.satisfactionRate}% Recommend this Kitchen</span>
        </div>
      </div>

      {/* Middle & Right: Rating Distribution Progress Bars */}
      <div className="md:col-span-2 flex flex-col justify-center space-y-2.5">
        <div className="flex items-center justify-between text-xs text-charcoal-muted pb-1">
          <span className="font-semibold uppercase tracking-wider text-[11px]">
            Star Rating Distribution
          </span>
          <span className="text-[10px]">Sample of {distribution.sampleSize} recent ratings</span>
        </div>

        {[5, 4, 3, 2, 1].map((star) => {
          const count = distribution.counts[star] || 0;
          const pct =
            distribution.sampleSize > 0
              ? Math.round((count / distribution.sampleSize) * 100)
              : 0;

          return (
            <div
              key={star}
              onClick={() => onSelectRatingFilter(ratingFilter === star ? 0 : star)}
              className={cn(
                'flex items-center gap-3 text-xs cursor-pointer group p-1 rounded-lg transition-colors',
                ratingFilter === star ? 'bg-surface-subtle font-bold' : 'hover:bg-surface-subtle/50'
              )}
              title={`Filter by ${star} stars`}
            >
              <div className="flex items-center gap-1 w-14 shrink-0 font-medium text-charcoal">
                <span>{star}</span>
                <Star size={11} className="fill-amber-400 text-amber-500" />
              </div>

              {/* Progress track */}
              <div className="flex-1 h-2.5 bg-neutralBorder-light rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    star >= 4
                      ? 'bg-emerald-600'
                      : star === 3
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="w-16 text-right font-mono text-[11px] text-charcoal-muted shrink-0">
                {count} ({pct}%)
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

