import React from 'react';
import { Search, X } from 'lucide-react';
import DietaryIndicator from '@/components/shared/DietaryIndicator';
import { cn } from '@/lib/utils';

export default function RestaurantMenuNav({
  activeTab,
  setActiveTab,
  reviewsTotal = 0,
  isVegOnly,
  setIsVegOnly,
  menuSearchQuery,
  setMenuSearchQuery,
  categories = [],
  selectedCategory,
  setSelectedCategory,
  rawMenuItems = [],
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 border-b border-neutralBorder bg-canvas sticky top-16 z-20 pt-2 pb-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('menu')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all',
              activeTab === 'menu'
                ? 'bg-charcoal text-white shadow-warm-xs'
                : 'bg-surface border border-neutralBorder text-charcoal-secondary hover:text-charcoal'
            )}
          >
            Order Online Menu
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all',
              activeTab === 'reviews'
                ? 'bg-charcoal text-white shadow-warm-xs'
                : 'bg-surface border border-neutralBorder text-charcoal-secondary hover:text-charcoal'
            )}
          >
            <span>Reviews</span>
            <span
              className={cn(
                'text-xs px-1.5 py-0.2 rounded-full font-bold',
                activeTab === 'reviews'
                  ? 'bg-white/25 text-white'
                  : 'bg-surface-subtle text-charcoal-muted'
              )}
            >
              {reviewsTotal}
            </span>
          </button>
        </div>

        {activeTab === 'menu' && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsVegOnly((v) => !v)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all',
                isVegOnly
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-warm-xs'
                  : 'bg-surface border-neutralBorder text-charcoal-secondary hover:border-emerald-300'
              )}
            >
              <DietaryIndicator isVeg={true} size="sm" />
              <span className="hidden sm:inline">Veg Only</span>
            </button>

            <div className="relative w-36 sm:w-56">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-charcoal-muted pointer-events-none" />
              <input
                type="text"
                value={menuSearchQuery}
                onChange={(e) => setMenuSearchQuery(e.target.value)}
                placeholder="Search dish..."
                className="w-full h-8 pl-8 pr-7 bg-surface border border-neutralBorder rounded-xl text-xs text-charcoal placeholder:text-charcoal-muted focus:outline-none focus:border-terracotta-400 focus:ring-1 focus:ring-terracotta-200 transition-colors shadow-warm-xs"
              />
              {menuSearchQuery && (
                <button
                  type="button"
                  onClick={() => setMenuSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-charcoal"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Category Pills (Menu mode) */}
      {activeTab === 'menu' && categories.length > 2 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-none pt-3 pb-1">
          {categories.map((cat) => {
            const count =
              cat === 'All'
                ? rawMenuItems.length
                : rawMenuItems.filter((i) => i.category === cat).length;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'shrink-0 text-xs font-medium px-3 py-1 rounded-full border transition-all duration-150',
                  selectedCategory === cat
                    ? 'bg-terracotta-500 border-terracotta-500 text-white font-semibold shadow-warm-xs'
                    : 'bg-surface border-neutralBorder text-charcoal-secondary hover:border-terracotta-300'
                )}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

