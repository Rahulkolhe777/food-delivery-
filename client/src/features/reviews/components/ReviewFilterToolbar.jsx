import React from 'react';
import { Search, X, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ReviewFilterToolbar({
  searchQuery,
  setSearchQuery,
  onlyWithComments,
  setOnlyWithComments,
  ratingFilter,
  setRatingFilter,
  total = 0,
}) {
  return (
    <div className="bg-surface border border-neutralBorder rounded-2xl p-4 shadow-warm-xs space-y-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Box */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-muted pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reviews by diner name or comment..."
            className="w-full h-10 pl-10 pr-9 bg-surface-subtle border border-neutralBorder rounded-xl text-xs text-charcoal placeholder:text-charcoal-muted focus:outline-none focus:border-terracotta-400 focus:bg-surface transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-charcoal"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Comment toggle check */}
        <label className="flex items-center gap-2 text-xs font-semibold text-charcoal cursor-pointer select-none shrink-0 px-2 py-1 bg-surface-subtle border border-neutralBorder rounded-xl h-10">
          <input
            type="checkbox"
            checked={onlyWithComments}
            onChange={(e) => setOnlyWithComments(e.target.checked)}
            className="rounded text-terracotta-600 focus:ring-terracotta-400"
          />
          <span>Written Comments Only</span>
        </label>
      </div>

      {/* Star Rating Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1 border-t border-neutralBorder-light">
        <span className="text-[11px] font-semibold text-charcoal-muted mr-1 uppercase tracking-wider shrink-0">
          Rating:
        </span>
        {[0, 5, 4, 3, 2, 1].map((stars) => (
          <button
            key={stars}
            type="button"
            onClick={() => setRatingFilter(stars)}
            className={cn(
              'px-3.5 py-1 rounded-full text-xs font-medium transition-all shrink-0 flex items-center gap-1',
              ratingFilter === stars
                ? 'bg-charcoal text-white font-bold shadow-warm-xs'
                : 'bg-surface-subtle text-charcoal-secondary border border-neutralBorder hover:border-terracotta-300 hover:text-charcoal'
            )}
          >
            {stars === 0 ? (
              <span>All Ratings ({total})</span>
            ) : (
              <>
                <span>{stars}</span>
                <Star
                  size={11}
                  className={ratingFilter === stars ? 'fill-white text-white' : 'fill-amber-400 text-amber-500'}
                />
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

