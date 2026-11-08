import React, { useState } from 'react';
import { Dialog, Button } from '@/components/ui';
import RatingStars from '@/components/shared/RatingStars';

export default function ReviewSubmissionModal({
  isOpen,
  onClose,
  order,
  onSubmit,
  isSubmitting = false,
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  if (!order) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      orderId: order._id,
      rating,
      comment: comment.trim(),
    });
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Review Your Culinary Meal"
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        <div className="p-3 bg-surface-subtle rounded-xl border border-neutralBorder-light text-xs">
          <span className="text-charcoal-muted block text-[10px] uppercase font-bold">
            Restaurant
          </span>
          <span className="font-semibold text-charcoal">
            {order.restaurant?.name || 'Restaurant'}
          </span>
          <p className="text-[11px] text-charcoal-muted mt-0.5">
            Order #{order._id.slice(-6).toUpperCase()}
          </p>
        </div>

        {/* Rating Stars Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-charcoal">
            Rating (1 to 5 Stars) <span className="text-terracotta-500">*</span>
          </label>
          <div className="p-3 bg-surface border border-neutralBorder rounded-xl flex items-center justify-between">
            <RatingStars
              rating={rating}
              isInteractive={true}
              onChange={setRating}
              size="md"
            />
            <span className="text-xs font-bold text-charcoal">
              {rating} of 5 Stars
            </span>
          </div>
        </div>

        {/* Comment */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-charcoal">
            Your Feedback (Optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="How was the flavor, warmth, and culinary quality of your order?"
            className="w-full p-3 bg-surface border border-neutralBorder rounded-xl text-xs text-charcoal placeholder:text-charcoal-muted focus:outline-none focus:border-terracotta-400 focus:ring-1 focus:ring-terracotta-200 transition-colors shadow-warm-xs resize-none"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            isLoading={isSubmitting}
          >
            Post Review
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

