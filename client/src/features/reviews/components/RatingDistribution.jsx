import React from 'react';
import { ThumbsUp } from 'lucide-react';
import RatingStars from '@/components/shared/RatingStars';

export default function RatingDistribution({
  avgRating = '0.0',
  totalReviews = 0,
  satisfactionRate = 0,
  sampleSize = 0,
  counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
}) {
  return (
    <div className="bg-surface border border-neutralBorder rounded-3xl p-6 shadow-warm-xs grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left: Overall Score */}
      <div className="flex flex-col justify-center items-center md:items-start md:border-r border-neutralBorder-light md:pr-6 space-y-2 text-center md:text-left">
        <span className="text-[11px] font-semibold text-charcoal-muted uppercase tracking-wider">
          Overall Diner Rating
        </span>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-5xl font-extrabold text-charcoal">
            {avgRating}
          </span>
          <span className="text-base text-charcoal-muted font-bold">/ 5.0</span>
        </div>
        <RatingStars rating={Number(avgRating)} size="md" />
        <p className="text-xs text-charcoal-secondary mt-1">
          Based on <strong className="text-charcoal">{totalReviews}</strong> verified customer reviews
        </p>
        <div className="pt-2 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
          <ThumbsUp size={14} className="text-emerald-600" />
          <span>{satisfactionRate}% Positive Sentiment</span>
        </div>
      </div>

      {/* Right: Distribution Bars */}
      <div className="md:col-span-2 flex flex-col justify-center space-y-2.5">
        <div className="flex items-center justify-between text-xs text-charcoal-muted pb-1">
          <span className="font-semibold uppercase tracking-wider text-[11px]">
            Star Rating Distribution
          </span>
          <span className="text-[10px]">Sample of {sampleSize} recent ratings</span>
        </div>

        {[5, 4, 3, 2, 1].map((star) => {
          const count = counts[star] || 0;
          const pct = sampleSize > 0 ? Math.round((count / sampleSize) * 100) : 0;

          return (
            <div key={star} className="flex items-center gap-3 text-xs">
              <span className="w-12 font-semibold text-charcoal flex items-center gap-1 text-[11px]">
                {star} Stars
              </span>
              <div className="flex-1 h-2.5 bg-surface-subtle border border-neutralBorder-light rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    star >= 4
                      ? 'bg-emerald-500'
                      : star === 3
                      ? 'bg-amber-400'
                      : 'bg-culinary-nonveg'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-16 text-right text-charcoal-muted font-mono text-[11px]">
                {count} ({pct}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

