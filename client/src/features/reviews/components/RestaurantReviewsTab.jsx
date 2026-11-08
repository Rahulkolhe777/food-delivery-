import React from 'react';
import { Star } from 'lucide-react';
import { EmptyState, Pagination } from '@/components/ui';
import ReviewFeedCard from '@/features/reviews/components/ReviewFeedCard';

export default function RestaurantReviewsTab({
  reviews = [],
  isLoading = false,
  page = 1,
  totalPages = 1,
  onPageChange,
}) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-28 bg-surface rounded-2xl border border-neutralBorder animate-pulse p-4"
          />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <EmptyState
        icon={Star}
        title="No reviews yet"
        description="Be one of the first diners to place an order and review this kitchen!"
      />
    );
  }

  return (
    <div className="space-y-3.5">
      {reviews.map((rev) => (
        <ReviewFeedCard key={rev._id} review={rev} />
      ))}

      {totalPages > 1 && (
        <div className="pt-4 flex justify-center">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}

