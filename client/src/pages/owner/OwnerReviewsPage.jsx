/**
 * OwnerReviewsPage — Customer Feedback & Reputation Intelligence Dashboard.
 *
 * Backend endpoint:
 *   GET /api/restaurants/:id/reviews?page=&limit=
 */

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Star, RefreshCcw } from 'lucide-react';

import { useOwnerRestaurant } from '@/context/OwnerRestaurantContext';
import { getRestaurantReviews } from '@/services/restaurant.service';

import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import Pagination from '@/components/ui/Pagination';
import Skeleton from '@/components/ui/Skeleton';

import OwnerRatingDistribution from '@/features/reviews/components/OwnerRatingDistribution';
import ReviewFilterToolbar from '@/features/reviews/components/ReviewFilterToolbar';
import ReviewItemCard from '@/features/reviews/components/ReviewItemCard';
import ReviewInspectorModal from '@/features/reviews/components/ReviewInspectorModal';

export default function OwnerReviewsPage() {
  const { selectedId, activeRestaurant } = useOwnerRestaurant();

  const [page, setPage] = useState(1);
  const [ratingFilter, setRatingFilter] = useState(0); // 0 = all, 1-5 = stars
  const [onlyWithComments, setOnlyWithComments] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectingReview, setInspectingReview] = useState(null);

  // ── Query: Paginated Reviews from Backend ──────────────────────────────────
  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['owner', 'reviews', selectedId, { page }],
    queryFn: () => getRestaurantReviews(selectedId, { page, limit: 10 }),
    enabled: Boolean(selectedId),
    keepPreviousData: true,
    staleTime: 30_000,
  });

  const reviews = data?.reviews ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  // ── Query: Broader sample to compute the Rating Distribution ──────────────
  const { data: sampleData } = useQuery({
    queryKey: ['owner', 'reviews', selectedId, 'distribution-sample'],
    queryFn: () => getRestaurantReviews(selectedId, { page: 1, limit: 50 }),
    enabled: Boolean(selectedId),
    staleTime: 60_000,
  });

  const sampleReviews = sampleData?.reviews ?? reviews;

  // ── Compute Real Rating Distribution from Sample ───────────────────────────
  const distribution = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;
    const n = sampleReviews.length;

    sampleReviews.forEach((r) => {
      const star = Math.min(Math.max(Math.round(r.rating || 5), 1), 5);
      counts[star] += 1;
      sum += r.rating || 5;
    });

    const avgRating = n > 0 ? (sum / n).toFixed(1) : '5.0';
    const positiveReviews = counts[5] + counts[4];
    const satisfactionRate = n > 0 ? Math.round((positiveReviews / n) * 100) : 100;

    return { counts, avgRating, satisfactionRate, sampleSize: n };
  }, [sampleReviews]);

  const rawReviews = data?.reviews;

  // ── Client-side Filter within the Current Page ──────────────────────────────
  const displayedReviews = useMemo(() => {
    let list = rawReviews ? [...rawReviews] : [];

    if (ratingFilter > 0) {
      list = list.filter((r) => Math.round(r.rating) === ratingFilter);
    }

    if (onlyWithComments) {
      list = list.filter((r) => r.comment && r.comment.trim().length > 0);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (r) =>
          (r.customer?.name && r.customer.name.toLowerCase().includes(q)) ||
          (r.comment && r.comment.toLowerCase().includes(q))
      );
    }

    return list;
  }, [rawReviews, ratingFilter, onlyWithComments, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto space-y-7">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutralBorder pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
              Customer Reviews & Reputation
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-terracotta-50 text-terracotta-700 border border-terracotta-200">
              Live Diner Sentiment
            </span>
          </div>
          <p className="text-xs text-charcoal-secondary mt-1">
            Real customer feedback, star ratings, and review distribution for{' '}
            <strong className="text-charcoal font-semibold">{activeRestaurant?.name}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            leftIcon={<RefreshCcw size={14} className={isFetching ? 'animate-spin' : ''} />}
          >
            Refresh Feed
          </Button>
        </div>
      </div>

      {/* ── Rating Score & Distribution Banner ── */}
      <OwnerRatingDistribution
        distribution={distribution}
        total={total}
        ratingFilter={ratingFilter}
        onSelectRatingFilter={setRatingFilter}
      />

      {/* ── Search, Filter & Tabs Toolbar ── */}
      <ReviewFilterToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onlyWithComments={onlyWithComments}
        setOnlyWithComments={setOnlyWithComments}
        ratingFilter={ratingFilter}
        setRatingFilter={setRatingFilter}
        total={total}
      />

      {/* ── Content View: Loading, Error, Empty, or Reviews ── */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {isError && !isLoading && (
        <ErrorState
          title="Could not load customer reviews"
          message="Failed to retrieve review feedback for this restaurant location from the backend API."
          onRetry={refetch}
        />
      )}

      {!isLoading && !isError && displayedReviews.length === 0 && (
        <EmptyState
          icon={Star}
          title={
            ratingFilter > 0 || searchQuery || onlyWithComments
              ? 'No reviews match active filters'
              : 'No reviews written yet'
          }
          description={
            ratingFilter > 0 || searchQuery || onlyWithComments
              ? 'Try resetting the star rating pill or clearing the search box.'
              : 'Customer ratings and feedback left on completed orders will appear here automatically.'
          }
        />
      )}

      {/* ── Reviews Cards Feed ── */}
      {!isLoading && !isError && displayedReviews.length > 0 && (
        <div className="space-y-4">
          {displayedReviews.map((rev) => (
            <ReviewItemCard
              key={rev._id}
              review={rev}
              onInspect={setInspectingReview}
            />
          ))}

          {/* Pagination Controls */}
          {totalPages > 1 && ratingFilter === 0 && !onlyWithComments && (
            <div className="p-3 border border-neutralBorder rounded-xl bg-surface flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-charcoal-secondary">
              <span>
                Showing page <strong className="text-charcoal">{page}</strong> of{' '}
                <strong className="text-charcoal">{totalPages}</strong> ({total} total reviews)
              </span>
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </div>
      )}

      {/* ── Review Inspection Dialog ── */}
      <ReviewInspectorModal
        isOpen={Boolean(inspectingReview)}
        onClose={() => setInspectingReview(null)}
        review={inspectingReview}
      />
    </div>
  );
}
