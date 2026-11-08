import React from 'react';
import Dialog from '@/components/ui/Dialog';
import Button from '@/components/ui/Button';
import RatingStars from '@/components/food/RatingStars';
import { formatDateTime, timeAgo } from '@/lib/utils';

export default function ReviewInspectorModal({
  isOpen,
  onClose,
  review,
}) {
  if (!review) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Diner Review Inspection"
      size="md"
    >
      <div className="space-y-4 pt-1 text-charcoal">
        <div className="p-4 bg-surface-subtle border border-neutralBorder rounded-xl space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface border border-neutralBorder flex items-center justify-center font-bold text-sm text-charcoal">
                {review.customer?.name?.[0]?.toUpperCase() || 'D'}
              </div>
              <div>
                <h3 className="font-bold text-sm text-charcoal">
                  {review.customer?.name || 'Verified Customer'}
                </h3>
                <p className="text-xs text-charcoal-muted font-mono">
                  Cust ID: {review.customer?._id || review.customer || 'N/A'}
                </p>
              </div>
            </div>

            <div className="text-right">
              <RatingStars rating={review.rating} size="md" />
              <span className="text-xs text-charcoal-muted mt-1 block">
                {review.rating} of 5 Stars
              </span>
            </div>
          </div>
        </div>

        {/* Review Comment Full */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
            Customer Written Commentary
          </span>
          <div className="p-4 rounded-xl bg-surface border border-neutralBorder text-xs text-charcoal leading-relaxed">
            {review.comment ? (
              `"${review.comment}"`
            ) : (
              <span className="text-charcoal-muted italic">
                The diner did not leave written text with their {review.rating}-star review.
              </span>
            )}
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-surface-subtle border border-neutralBorder space-y-1">
            <span className="text-[10px] font-semibold text-charcoal-muted uppercase">
              Submission Date
            </span>
            <p className="font-semibold text-charcoal">
              {formatDateTime(review.createdAt)}
            </p>
            <p className="text-[10px] text-charcoal-muted">
              {timeAgo(review.createdAt)}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-surface-subtle border border-neutralBorder space-y-1">
            <span className="text-[10px] font-semibold text-charcoal-muted uppercase">
              Linked Order ID
            </span>
            <p className="font-mono text-xs font-semibold text-charcoal truncate">
              {review.order || 'N/A'}
            </p>
            <p className="text-[10px] text-emerald-600 font-medium">
              Delivered Order Receipt
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-neutralBorder flex justify-end">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close Inspector
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

