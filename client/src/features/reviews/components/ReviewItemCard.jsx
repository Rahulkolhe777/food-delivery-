import React from 'react';
import { Quote, Eye } from 'lucide-react';
import RatingStars from '@/components/food/RatingStars';
import { timeAgo } from '@/lib/utils';

export default function ReviewItemCard({ review, onInspect }) {
  return (
    <article className="bg-surface border border-neutralBorder rounded-3xl p-5 sm:p-6 shadow-warm-xs hover:border-neutralBorder-strong transition-all space-y-4">
      {/* Header: Diner Profile + Rating + Time */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-neutralBorder-light pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-subtle border border-neutralBorder flex items-center justify-center font-bold text-xs text-charcoal shrink-0">
            {review.customer?.name?.[0]?.toUpperCase() || 'D'}
          </div>
          <div>
            <h4 className="font-bold text-sm text-charcoal">
              {review.customer?.name || 'Verified Diner'}
            </h4>
            <p className="text-[11px] text-charcoal-muted flex items-center gap-2">
              <span className="font-mono">Review ID: #{review._id?.slice(-6).toUpperCase()}</span>
              <span>•</span>
              <span>{review.createdAt ? timeAgo(review.createdAt) : 'Recently'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <RatingStars rating={review.rating} size="sm" />
          <span className="font-bold text-xs text-charcoal bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
            {review.rating}.0
          </span>
        </div>
      </div>

      {/* Review Comment Body */}
      {review.comment ? (
        <div className="relative pl-6 pr-4 py-3 bg-surface-subtle rounded-2xl border border-neutralBorder-light">
          <Quote size={16} className="absolute left-2.5 top-3 text-terracotta-400 rotate-180" />
          <p className="text-xs text-charcoal leading-relaxed font-normal">
            {review.comment}
          </p>
        </div>
      ) : (
        <p className="text-xs text-charcoal-muted italic px-2">
          Rated {review.rating} stars without additional written comments.
        </p>
      )}

      {/* Footer Meta */}
      <div className="flex items-center justify-between text-[11px] text-charcoal-muted pt-1">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
            Verified Order
          </span>
          <span>Order Ref: {review.order ? String(review.order).slice(-8) : 'N/A'}</span>
        </div>

        <button
          type="button"
          onClick={() => onInspect(review)}
          className="text-xs text-terracotta-600 hover:text-terracotta-700 font-semibold flex items-center gap-1 cursor-pointer"
        >
          <span>Details</span>
          <Eye size={13} />
        </button>
      </div>
    </article>
  );
}

