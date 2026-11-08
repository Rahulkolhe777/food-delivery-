/**
 * CustomerHome — Curated restaurant discovery landing page.
 * Uses centralized cuisineImages, RestaurantCard, and TanStack Query.
 */

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  MapPin,
  ChevronDown,
  ArrowRight,
  Store,
  Check,
} from 'lucide-react';

import { getRestaurants } from '@/features/restaurants';
import { queryKeys } from '@/lib/queryKeys';
import { INDIAN_CITIES, cn } from '@/lib/utils';
import { HERO_IMAGE, CUISINE_META } from '@/lib/cuisineImages';
import { RestaurantCardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState, Pagination } from '@/components/ui';
import RestaurantCard from '@/components/shared/RestaurantCard';

const ITEMS_PER_PAGE = 12;

function CityPicker({ city, onChange }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="inline-flex items-center gap-2 bg-surface/90 backdrop-blur-md border border-white/20 hover:border-white/40 text-charcoal font-semibold text-sm px-4 py-2 rounded-xl shadow-warm-xs transition-all"
      >
        <MapPin className="w-4 h-4 text-terracotta-500" />
        <span>{city}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-charcoal-muted transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-56 max-h-72 overflow-y-auto bg-surface rounded-2xl shadow-warm-lg border border-neutralBorder p-1.5 z-50 scrollbar-thin">
          <p className="text-[10px] uppercase font-bold tracking-wider text-charcoal-muted px-3 py-1.5 sticky top-0 bg-surface/95 backdrop-blur-xs z-10">
            Select Dining Hub
          </p>
          {INDIAN_CITIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                onChange(c);
                setOpen(false);
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
  );
}

export default function CustomerHome() {
  const [city, setCity] = useState('Bhopal');
  const [page, setPage] = useState(1);
  const [selectedCuisine, setSelectedCuisine] = useState('All');

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.restaurants.all({ city, page, limit: ITEMS_PER_PAGE }),
    queryFn: () => getRestaurants({ city, page, limit: ITEMS_PER_PAGE }),
    keepPreviousData: true,
    staleTime: 60_000,
  });

  const totalPages = data?.totalPages ?? 1;
  const totalCount = data?.total ?? 0;

  const restaurants = useMemo(() => {
    const list = data?.restaurants ?? [];
    const filtered =
      selectedCuisine === 'All'
        ? list
        : list.filter((r) =>
            (r.cuisines ?? []).some(
              (c) => c.toLowerCase() === selectedCuisine.toLowerCase()
            )
          );

    // Defensive unique _id check
    const seen = new Set();
    return filtered.filter((r) => {
      if (!r || !r._id) return false;
      if (seen.has(r._id)) return false;
      seen.add(r._id);
      return true;
    });
  }, [data?.restaurants, selectedCuisine]);

  const handleCityChange = useCallback((newCity) => {
    setCity(newCity);
    setPage(1);
    setSelectedCuisine('All');
  }, []);

  return (
    <div className="bg-canvas min-h-screen">
      {/* ── Atmospheric Hero ── */}
      <section className="relative h-[480px] sm:h-[520px]">
        {/* Background visual container - clipped without cutting off interactive dropdowns */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            src={HERO_IMAGE}
            alt="Artisanal restaurant dining"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-charcoal/80 via-charcoal/55 to-charcoal/30" />
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-canvas to-transparent" />
        </div>

        <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col justify-center">
          <div className="max-w-xl">
            <p className="text-terracotta-300 text-xs font-semibold uppercase tracking-widest mb-3">
              Haute Gastronomy & Dining
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
              Discover the finest<br />
              <span className="text-terracotta-300">culinary kitchens</span> near you
            </h1>
            <p className="text-white/70 text-sm leading-relaxed mb-8 max-w-md">
              From historic tandoors to modern bistros — curated dining establishments with live digital menus.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-white/70 text-xs font-medium uppercase tracking-wider">Dining in</span>
              <CityPicker city={city} onChange={handleCityChange} />
              <Link
                to="/restaurants"
                className="ml-2 text-xs font-semibold text-terracotta-200 border border-terracotta-300/50 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all"
              >
                Browse all venues →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Cuisine Pill Bar ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg font-semibold text-charcoal">
            Explore by Culinary Tradition
          </h2>
          <Link to="/restaurants" className="text-xs font-semibold text-terracotta-600 hover:text-terracotta-700 flex items-center gap-1">
            <span>View all</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-2">
          <button
            type="button"
            onClick={() => setSelectedCuisine('All')}
            className={cn(
              'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border',
              selectedCuisine === 'All'
                ? 'bg-charcoal text-white border-charcoal shadow-warm-xs'
                : 'bg-surface border-neutralBorder text-charcoal-secondary hover:border-neutralBorder-strong'
            )}
          >
            <span>🍽️</span>
            <span>All Cuisines</span>
          </button>

          {CUISINE_META.map(({ label, emoji }) => (
            <button
              key={label}
              type="button"
              onClick={() => setSelectedCuisine(label)}
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border',
                selectedCuisine === label
                  ? 'bg-terracotta-500 text-white border-terracotta-500 shadow-warm-xs'
                  : 'bg-surface border-neutralBorder text-charcoal-secondary hover:border-terracotta-300'
              )}
            >
              <span>{emoji}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Restaurant Cards Section ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex items-baseline justify-between">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-charcoal">
              Featured Dining Venues in {city}
            </h2>
            <p className="text-xs text-charcoal-muted mt-1">
              Showing authentic establishments with fresh online ordering
            </p>
          </div>
          <span className="text-xs text-charcoal-muted font-medium">
            {restaurants.length} venue{restaurants.length !== 1 ? 's' : ''} listed
          </span>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <RestaurantCardSkeleton key={i} />
            ))}
          </div>
        )}

        {isError && !isLoading && (
          <ErrorState
            title="Unable to load restaurants"
            message={`We could not retrieve venues in ${city}. Please verify your connection and try again.`}
            onRetry={refetch}
          />
        )}

        {!isLoading && !isError && restaurants.length === 0 && (
          <EmptyState
            icon={Store}
            title="No restaurants found"
            description={`No establishments found for ${selectedCuisine} in ${city}. Try picking another cuisine.`}
            action={
              <button
                type="button"
                onClick={() => setSelectedCuisine('All')}
                className="px-4 py-2 bg-charcoal text-white rounded-xl text-xs font-semibold shadow-warm-xs"
              >
                Reset to All Cuisines
              </button>
            }
          />
        )}

        {!isLoading && !isError && restaurants.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {restaurants.map((restaurant) => (
                <RestaurantCard key={restaurant._id} restaurant={restaurant} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pt-8 border-t border-neutralBorder flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-charcoal-muted">
                  Showing page <strong className="text-charcoal">{page}</strong> of{' '}
                  <strong className="text-charcoal">{totalPages}</strong> ({totalCount} total in {city})
                </span>
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
