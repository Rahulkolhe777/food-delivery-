import React, { useState, useRef, useEffect } from 'react';
import { Search, X, ChevronDown, Check, MapPin } from 'lucide-react';
import { INDIAN_CITIES, CUISINE_TYPES } from '@/lib/utils';

export default function RestaurantFilterBar({
  city,
  onCityChange,
  nameQuery,
  onNameQueryChange,
  selectedCuisine,
  onCuisineChange,
  onlyOpen,
  onToggleOnlyOpen,
  cuisineCounts = {},
  totalCount = 0,
}) {
  const [cityOpen, setCityOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCityOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-surface border-b border-neutralBorder sticky top-16 z-30 shadow-warm-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-3">
        {/* City picker */}
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setCityOpen((o) => !o)}
            className="flex items-center gap-2 h-10 px-3.5 bg-surface border border-neutralBorder rounded-xl text-sm font-semibold text-charcoal hover:border-terracotta-400 focus:outline-none focus:ring-1 focus:ring-terracotta-300 transition-colors shadow-warm-xs"
          >
            <MapPin className="w-4 h-4 text-terracotta-500 flex-shrink-0" />
            <span>{city}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-charcoal-muted transition-transform duration-200 ${
                cityOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {cityOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-52 bg-surface rounded-2xl shadow-warm-lg border border-neutralBorder p-1.5 z-50">
              <p className="text-[10px] uppercase font-bold tracking-wider text-charcoal-muted px-3 py-1.5">
                Select Culinary Hub
              </p>
              {INDIAN_CITIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    onCityChange(c);
                    setCityOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors ${
                    c === city
                      ? 'bg-terracotta-50 text-terracotta-600 font-semibold'
                      : 'text-charcoal-secondary hover:bg-surface-hover'
                  }`}
                >
                  <span>{c}</span>
                  {c === city && <Check className="w-4 h-4 text-terracotta-500" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Name search */}
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-muted pointer-events-none" />
          <input
            type="text"
            value={nameQuery}
            onChange={(e) => onNameQueryChange(e.target.value)}
            placeholder="Search restaurants…"
            className="w-full h-10 pl-9 pr-8 bg-surface border border-neutralBorder rounded-xl text-sm text-charcoal placeholder:text-charcoal-muted focus:outline-none focus:border-terracotta-400 focus:ring-1 focus:ring-terracotta-200 transition-colors shadow-warm-xs"
          />
          {nameQuery && (
            <button
              type="button"
              onClick={() => onNameQueryChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-charcoal"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Open Now toggle */}
        <button
          type="button"
          onClick={onToggleOnlyOpen}
          className={`flex items-center gap-1.5 h-10 px-3.5 rounded-xl border text-sm font-semibold transition-all ${
            onlyOpen
              ? 'bg-culinary-vegBg text-culinary-veg border-culinary-veg/40 shadow-xs'
              : 'bg-surface border-neutralBorder text-charcoal-secondary hover:border-neutralBorder-strong'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              onlyOpen ? 'bg-culinary-veg' : 'bg-charcoal-subtle'
            }`}
          />
          <span>Open Now</span>
        </button>

        {/* Total count badge */}
        <div className="hidden sm:flex items-center text-xs text-charcoal-muted ml-auto font-medium">
          <span>{totalCount} places in {city}</span>
        </div>
      </div>

      {/* Cuisine horizontal pill bar */}
      <div className="border-t border-neutralBorder-light overflow-x-auto scrollbar-none py-2 px-4 sm:px-6 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onCuisineChange('All')}
          className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
            selectedCuisine === 'All'
              ? 'bg-charcoal text-white shadow-xs'
              : 'bg-surface border border-neutralBorder text-charcoal-secondary hover:border-neutralBorder-strong'
          }`}
        >
          All Cuisines
        </button>

        {CUISINE_TYPES.map((cuisine) => {
          const isSelected = selectedCuisine === cuisine;
          const count = cuisineCounts[cuisine] ?? 0;
          return (
            <button
              key={cuisine}
              type="button"
              onClick={() => onCuisineChange(cuisine)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap flex items-center gap-1.5 transition-all ${
                isSelected
                  ? 'bg-terracotta-500 text-white shadow-xs'
                  : 'bg-surface border border-neutralBorder text-charcoal-secondary hover:border-terracotta-300'
              }`}
            >
              <span>{cuisine}</span>
              {count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-surface-subtle text-charcoal-muted'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

