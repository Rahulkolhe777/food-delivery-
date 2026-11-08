import React, { useMemo } from 'react';
import { UtensilsCrossed } from 'lucide-react';
import { Skeleton } from '@/components/ui';
import RestaurantCard from '@/components/shared/RestaurantCard';

export default function RestaurantGrid({
  restaurants = [],
  isLoading = false,
  onResetFilters,
}) {
  // Deduplicate defensively by MongoDB _id identity (preserving distinct branches that legitimately share a name)
  const uniqueRestaurants = useMemo(() => {
    const seen = new Set();
    return restaurants.filter((r) => {
      if (!r || !r._id) return false;
      if (seen.has(r._id)) return false;
      seen.add(r._id);
      return true;
    });
  }, [restaurants]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-surface rounded-2xl border border-neutralBorder p-4 space-y-3">
            <Skeleton className="w-full h-44 rounded-xl" />
            <Skeleton className="w-3/4 h-5 rounded-md" />
            <Skeleton className="w-1/2 h-4 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  if (uniqueRestaurants.length === 0) {
    return (
      <div className="text-center py-20 px-4 bg-surface rounded-3xl border border-neutralBorder shadow-warm-xs max-w-xl mx-auto my-8">
        <div className="w-14 h-14 rounded-2xl bg-terracotta-50 text-terracotta-500 mx-auto flex items-center justify-center mb-4">
          <UtensilsCrossed className="w-7 h-7" />
        </div>
        <h3 className="font-display text-xl font-bold text-charcoal">
          No Culinary Venues Found
        </h3>
        <p className="text-sm text-charcoal-muted mt-1.5 max-w-sm mx-auto">
          We couldn't find any dining establishments matching your current selection or filters.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-5 px-4 py-2 bg-charcoal text-white rounded-xl text-xs font-semibold hover:bg-charcoal/90 transition-all shadow-warm-xs"
          >
            Clear All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {uniqueRestaurants.map((restaurant) => (
        <RestaurantCard key={restaurant._id} restaurant={restaurant} />
      ))}
    </div>
  );
}

