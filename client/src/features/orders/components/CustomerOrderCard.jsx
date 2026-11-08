import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Calendar, CreditCard, Eye } from 'lucide-react';
import { Button } from '@/components/ui';
import OrderStatusBadge from '@/components/shared/OrderStatusBadge';
import DietaryIndicator from '@/components/shared/DietaryIndicator';
import RatingStars from '@/components/shared/RatingStars';
import { formatCurrency, formatDateTime, timeAgo, getPaymentLabel, getRestaurantAddress } from '@/lib/utils';

export default function CustomerOrderCard({
  order,
  existingReview,
  onViewDetails,
  onOpenReview,
}) {
  const isDelivered = order.status === 'delivered';

  return (
    <div className="bg-surface rounded-2xl border border-neutralBorder shadow-warm-xs p-5 space-y-4 hover:shadow-warm-md transition-shadow">
      {/* Top Strip: Restaurant & Status */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-neutralBorder-light pb-3">
        <div>
          {order.restaurant?._id || typeof order.restaurant === 'string' ? (
            <Link
              to={`/restaurants/${order.restaurant?._id || order.restaurant}`}
              className="font-display text-lg font-bold text-charcoal hover:text-terracotta-600 transition-colors hover:underline inline-block"
            >
              {order.restaurant?.name || 'Restaurant'}
            </Link>
          ) : (
            <h3 className="font-display text-lg font-bold text-charcoal">
              {order.restaurant?.name || 'Restaurant'}
            </h3>
          )}
          <p className="text-xs text-charcoal-muted flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-terracotta-500 shrink-0" />
            <span className="truncate max-w-[280px]">
              {getRestaurantAddress(order.restaurant, { format: 'short' })}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-charcoal-muted bg-surface-subtle px-2 py-0.5 rounded-lg border border-neutralBorder-light">
            #{order._id.slice(-6).toUpperCase()}
          </span>
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      {/* Items Preview */}
      <div className="space-y-1.5 text-xs">
        {order.items?.map((item, idx) => (
          <div key={item._id || idx} className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2 min-w-0 pr-2">
              <DietaryIndicator isVeg={item.isVeg ?? item.menuItem?.isVeg ?? true} size="sm" />
              <span className="text-charcoal-muted font-mono">{item.quantity}×</span>
              <span className="font-medium text-charcoal truncate">{item.name}</span>
            </div>
            <span className="font-semibold text-charcoal shrink-0 tabular-nums">
              {formatCurrency(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Existing Review Snapshot if reviewed */}
      {existingReview && (
        <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
          <Star className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold">Your Review:</span>
              <RatingStars rating={existingReview.rating} size="sm" />
            </div>
            {existingReview.comment && (
              <p className="text-[11px] text-amber-800 mt-1 italic">
                "{existingReview.comment}"
              </p>
            )}
          </div>
        </div>
      )}

      {/* Bottom Strip: Metadata + Actions */}
      <div className="border-t border-neutralBorder-light pt-3 flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Timestamp & Payment method */}
        <div className="flex items-center gap-3 text-charcoal-muted">
          <span className="flex items-center gap-1.5" title={formatDateTime(order.createdAt)}>
            <Calendar className="w-3.5 h-3.5 text-charcoal-muted" />
            <span>{timeAgo(order.createdAt)}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5 capitalize">
            <CreditCard className="w-3.5 h-3.5 text-charcoal-muted" />
            <span>{getPaymentLabel(order.paymentMethod)}</span>
          </span>
        </div>

        {/* Total & Action Buttons */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-charcoal-muted uppercase block leading-none">
              Total
            </span>
            <span className="font-bold text-sm text-terracotta-600 tabular-nums">
              {formatCurrency(order.totalAmount)}
            </span>
          </div>

          {/* View Details Button */}
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Eye className="w-3.5 h-3.5" />}
            onClick={() => onViewDetails(order)}
          >
            Details
          </Button>

          {/* Review Meal Button (Delivered orders only) */}
          {isDelivered && !existingReview && (
            <Button
              variant="outline"
              size="sm"
              className="text-amber-700 border-amber-300 hover:bg-amber-50"
              leftIcon={<Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />}
              onClick={() => onOpenReview(order)}
            >
              Review
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

