import React from 'react';
import { Search, X, LayoutList, Grid } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function OwnerMenuFilterBar({
  categories = [],
  selectedCategory,
  setSelectedCategory,
  dishes = [],
  searchQuery,
  setSearchQuery,
  dietaryFilter,
  setDietaryFilter,
  availabilityFilter,
  setAvailabilityFilter,
  viewMode,
  setViewMode,
  onResetPage,
}) {
  return (
    <div className="bg-surface border border-neutralBorder rounded-2xl p-4 shadow-warm-xs space-y-3">
      {/* Category Pills */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const count =
            cat === 'All'
              ? dishes.length
              : dishes.filter((d) => d.category === cat).length;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
                onResetPage?.();
              }}
              className={cn(
                'text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all border cursor-pointer',
                isSelected
                  ? 'bg-charcoal text-white border-charcoal shadow-warm-xs'
                  : 'bg-surface border-neutralBorder text-charcoal-secondary hover:border-neutralBorder-strong'
              )}
            >
              <span>{cat}</span>
              <span
                className={cn(
                  'text-[10px] ml-1.5 px-1.5 py-0.2 rounded-full font-bold',
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-surface-subtle text-charcoal-muted'
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter Controls Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2 border-t border-neutralBorder-light">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-muted pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              onResetPage?.();
            }}
            placeholder="Search dishes by name or category..."
            className="w-full h-9 pl-9 pr-8 bg-surface-subtle border border-neutralBorder rounded-xl text-xs text-charcoal placeholder:text-charcoal-muted focus:outline-none focus:border-terracotta-400 focus:bg-surface transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                onResetPage?.();
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-charcoal cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={dietaryFilter}
            onChange={(e) => {
              setDietaryFilter(e.target.value);
              onResetPage?.();
            }}
            className="h-9 px-2.5 bg-surface border border-neutralBorder rounded-xl text-xs text-charcoal font-medium focus:outline-none focus:border-terracotta-400 cursor-pointer"
          >
            <option value="all">All Diets</option>
            <option value="veg">Vegetarian</option>
            <option value="nonveg">Non-Vegetarian</option>
          </select>

          <select
            value={availabilityFilter}
            onChange={(e) => {
              setAvailabilityFilter(e.target.value);
              onResetPage?.();
            }}
            className="h-9 px-2.5 bg-surface border border-neutralBorder rounded-xl text-xs text-charcoal font-medium focus:outline-none focus:border-terracotta-400 cursor-pointer"
          >
            <option value="all">All Stock Status</option>
            <option value="instock">In Stock</option>
            <option value="soldout">Sold Out</option>
          </select>

          <div className="flex items-center bg-surface-subtle p-0.5 border border-neutralBorder rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={cn(
                'p-1.5 rounded-md text-xs transition-colors cursor-pointer',
                viewMode === 'table'
                  ? 'bg-surface text-charcoal font-bold shadow-warm-xs'
                  : 'text-charcoal-muted hover:text-charcoal'
              )}
              title="Table View"
            >
              <LayoutList size={15} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-1.5 rounded-md text-xs transition-colors cursor-pointer',
                viewMode === 'grid'
                  ? 'bg-surface text-charcoal font-bold shadow-warm-xs'
                  : 'text-charcoal-muted hover:text-charcoal'
              )}
              title="Grid View"
            >
              <Grid size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

