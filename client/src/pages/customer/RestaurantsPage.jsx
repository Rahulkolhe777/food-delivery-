/**
 * RestaurantsPage — Full restaurant discovery & listing page.
 * Uses decomposed features/restaurants: RestaurantFilterBar & RestaurantGrid.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRestaurants } from '@/features/restaurants';
import { queryKeys } from '@/lib/queryKeys';
import { Pagination, ErrorState } from '@/components/ui';
import RestaurantFilterBar from '@/features/restaurants/components/RestaurantFilterBar';
import RestaurantGrid from '@/features/restaurants/components/RestaurantGrid';

const ITEMS_PER_PAGE = 24;

export default function RestaurantsPage() {
  const [city, setCity] = useState('Bhopal');
  const [page, setPage] = useState(1);
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [nameQuery, setNameQuery] = useState('');

  // Server-side query for restaurants by city + page
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.restaurants.all({ city, page, limit: ITEMS_PER_PAGE }),
    queryFn: () => getRestaurants({ city, page, limit: ITEMS_PER_PAGE }),
    keepPreviousData: true,
    staleTime: 60_000,
  });

  const totalPages = data?.totalPages ?? 1;
  const totalCount = data?.total ?? 0;

  // Client-side filtering (applied to current page)
  const restaurants = useMemo(() => {
    let list = data?.restaurants ?? [];

    if (selectedCuisine !== 'All') {
      list = list.filter((r) =>
        (r.cuisines ?? []).some(
          (c) => c.toLowerCase() === selectedCuisine.toLowerCase()
        )
      );
    }

    if (onlyOpen) {
      list = list.filter((r) => r.isOpen === true);
    }

    if (nameQuery.trim()) {
      const q = nameQuery.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.name?.toLowerCase().includes(q) ||
          r.area?.toLowerCase().includes(q)
      );
    }

    // Defensive unique _id identity check
    const seen = new Set();
    return list.filter((r) => {
      if (!r || !r._id) return false;
      if (seen.has(r._id)) return false;
      seen.add(r._id);
      return true;
    });
  }, [data?.restaurants, selectedCuisine, onlyOpen, nameQuery]);

  // Count cuisine occurrences in the fetched page for pill badges
  const cuisineCounts = useMemo(() => {
    const counts = {};
    const list = data?.restaurants ?? [];
    for (const r of list) {
      for (const c of r.cuisines ?? []) {
        counts[c] = (counts[c] ?? 0) + 1;
      }
    }
    return counts;
  }, [data?.restaurants]);

  const handleCityChange = useCallback((newCity) => {
    setCity(newCity);
    setPage(1);
    setSelectedCuisine('All');
    setOnlyOpen(false);
    setNameQuery('');
  }, []);

  const handleResetFilters = useCallback(() => {
    setSelectedCuisine('All');
    setOnlyOpen(false);
    setNameQuery('');
    setPage(1);
  }, []);

  return (
    <div className="min-h-screen bg-canvas">
      {/* Sticky Filter Bar */}
      <RestaurantFilterBar
        city={city}
        onCityChange={handleCityChange}
        nameQuery={nameQuery}
        onNameQueryChange={(q) => {
          setNameQuery(q);
          setPage(1);
        }}
        selectedCuisine={selectedCuisine}
        onCuisineChange={(c) => {
          setSelectedCuisine(c);
          setPage(1);
        }}
        onlyOpen={onlyOpen}
        onToggleOnlyOpen={() => {
          setOnlyOpen((o) => !o);
          setPage(1);
        }}
        cuisineCounts={cuisineCounts}
        totalCount={totalCount}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {isError && !isLoading && (
          <ErrorState
            title="Could not load restaurants"
            message={`We had trouble fetching restaurants in ${city}. Please check your connection and retry.`}
            onRetry={refetch}
          />
        )}

        {!isError && (
          <>
            <RestaurantGrid
              restaurants={restaurants}
              isLoading={isLoading}
              onResetFilters={handleResetFilters}
            />

            {/* Pagination */}
            {totalPages > 1 && !isLoading && (
              <div className="pt-8 border-t border-neutralBorder flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-charcoal-muted">
                  Showing page <strong className="text-charcoal">{page}</strong> of{' '}
                  <strong className="text-charcoal">{totalPages}</strong> ({totalCount} total in {city})
                </span>

                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={(p) => {
                    setPage(p);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
