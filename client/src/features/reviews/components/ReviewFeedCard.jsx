import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Avatar } from '@/components/ui';
import RatingStars from '@/components/shared/RatingStars';
import { timeAgo, formatDateTime } from '@/lib/utils';

export default function ReviewFeedCard({
  review,
  onInspectOrder,
}) {
  return (
    <article className="bg-surface border border-neutralBorder rounded-2xl p-5 shadow-warm-xs hover:shadow-warm-sm transition-all space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar name={review.customer?.name || 'Diner'} size="md" />
          <div>
            <h4 className="font-semibold text-sm text-charcoal">
              {review.customer?.name || 'Anonymous Diner'}
            </h4>
            <div className="flex items-center gap-2 text-[11px] text-charcoal-muted mt-0.5">
              <span>{review.createdAt ? timeAgo(review.createdAt) : 'Recently'}</span>
              <span>•</span>
              <span title={formatDateTime(review.createdAt)}>
                Order #{review.order?._id ? review.order._id.slice(-6).toUpperCase() : (review.order?.slice?.(-6)?.toUpperCase() || 'VERIFIED')}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <RatingStars rating={review.rating} size="sm" />
          <span className="font-bold text-xs text-charcoal">{review.rating}.0</span>
        </div>
      </div>

      {review.comment ? (
        <p className="text-xs text-charcoal-secondary leading-relaxed bg-surface-subtle p-3.5 rounded-xl border border-neutralBorder-light">
          "{review.comment}"
        </p>
      ) : (
        <p className="text-xs text-charcoal-muted italic py-1">
          Customer left a {review.rating}-star rating without additional comments.
        </p>
      )}

      {onInspectOrder && review.order && (
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={() => onInspectOrder(review)}
            className="text-[11px] font-semibold text-terracotta-600 hover:text-terracotta-700 flex items-center gap-1 cursor-pointer"
          >
            <MessageSquare size={12} />
            <span>View Associated Order Details</span>
          </button>
        </div>
      )}
    </article>
  );
}

