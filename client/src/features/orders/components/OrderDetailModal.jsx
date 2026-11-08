import React from 'react';
import { Link } from 'react-router-dom';
import { Dialog, Button } from '@/components/ui';
import OrderStatusBadge from '@/components/shared/OrderStatusBadge';
import OrderItemBill from '@/components/shared/OrderItemBill';
import { formatDateTime, getPaymentLabel, getRestaurantAddress } from '@/lib/utils';
import { MapPin, Calendar, CreditCard } from 'lucide-react';

export default function OrderDetailModal({
  isOpen,
  onClose,
  order,
}) {
  if (!order) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={`Order #${order._id.slice(-6).toUpperCase()} Details`}
      size="md"
    >
      <div className="space-y-5 pt-1">
        {/* Top summary card */}
        <div className="p-3.5 bg-surface-subtle border border-neutralBorder-light rounded-2xl flex items-center justify-between">
          <div>
            {order.restaurant?._id || typeof order.restaurant === 'string' ? (
              <Link
                to={`/restaurants/${order.restaurant?._id || order.restaurant}`}
                onClick={onClose}
                className="font-display text-base font-bold text-charcoal hover:text-terracotta-600 transition-colors hover:underline block"
              >
                {order.restaurant?.name || 'Restaurant'}
              </Link>
            ) : (
              <h4 className="font-display text-base font-bold text-charcoal">
                {order.restaurant?.name || 'Restaurant'}
              </h4>
            )}
            <p className="text-xs text-charcoal-muted flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-terracotta-500 shrink-0" />
              <span>{getRestaurantAddress(order.restaurant, { format: 'full' })}</span>
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        {/* Order Meta details */}
        <div className="grid grid-cols-2 gap-3 text-xs bg-surface p-3 border border-neutralBorder rounded-xl">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-charcoal-muted flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Placed At
            </span>
            <span className="font-medium text-charcoal">{formatDateTime(order.createdAt)}</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-charcoal-muted flex items-center gap-1">
              <CreditCard className="w-3 h-3" /> Payment
            </span>
            <span className="font-medium text-charcoal capitalize">
              {getPaymentLabel(order.paymentMethod)}
            </span>
          </div>
        </div>

        {/* Itemized Bill Component */}
        <div>
          <h5 className="text-xs uppercase font-bold text-charcoal tracking-wider mb-2">
            Itemized Bill & Receipt
          </h5>
          <OrderItemBill
            items={order.items || []}
            totalAmount={order.totalAmount}
            deliveryFee={40}
          />
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-3 border-t border-neutralBorder">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close Receipt
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

