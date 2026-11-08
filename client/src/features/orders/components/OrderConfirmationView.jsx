import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';
import OrderStatusBadge from '@/components/shared/OrderStatusBadge';
import OrderItemBill from '@/components/shared/OrderItemBill';
import { formatCurrency, getPaymentLabel } from '@/lib/utils';

export default function OrderConfirmationView({ confirmedOrder }) {
  if (!confirmedOrder) return null;

  return (
    <div className="min-h-screen bg-canvas py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="bg-surface border border-neutralBorder rounded-3xl p-6 sm:p-8 shadow-warm-md text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-warm-xs">
            <CheckCircle2 className="w-9 h-9 stroke-[2]" />
          </div>

          <div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
              Confirmed by Kitchen
            </span>
            <h1 className="font-display text-3xl font-bold text-charcoal mt-3">
              Order Placed Successfully!
            </h1>
            <p className="text-sm text-charcoal-secondary max-w-md mx-auto mt-1 leading-relaxed">
              Your order has been transmitted to{' '}
              <strong className="text-charcoal font-semibold">
                {confirmedOrder.restaurantName}
              </strong>
              . The kitchen is preparing your dishes.
            </p>
          </div>

          {/* Quick Reference Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-neutralBorder-light text-left text-xs">
            <div className="p-3 bg-surface-subtle rounded-xl border border-neutralBorder-light">
              <span className="text-charcoal-muted block text-[10px] uppercase font-bold">Order ID</span>
              <span className="font-mono font-semibold text-charcoal truncate block">
                #{confirmedOrder._id.slice(-6).toUpperCase()}
              </span>
            </div>

            <div className="p-3 bg-surface-subtle rounded-xl border border-neutralBorder-light">
              <span className="text-charcoal-muted block text-[10px] uppercase font-bold">Status</span>
              <div className="mt-0.5">
                <OrderStatusBadge status={confirmedOrder.status} />
              </div>
            </div>

            <div className="p-3 bg-surface-subtle rounded-xl border border-neutralBorder-light">
              <span className="text-charcoal-muted block text-[10px] uppercase font-bold">Payment</span>
              <span className="font-semibold text-charcoal capitalize block">
                {getPaymentLabel(confirmedOrder.paymentMethod)}
              </span>
            </div>

            <div className="p-3 bg-surface-subtle rounded-xl border border-neutralBorder-light">
              <span className="text-charcoal-muted block text-[10px] uppercase font-bold">Total Paid</span>
              <span className="font-bold text-terracotta-600 block">
                {formatCurrency(confirmedOrder.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Receipt Breakdown Card */}
        <div className="bg-surface border border-neutralBorder rounded-3xl p-6 shadow-warm-xs space-y-4">
          <h3 className="font-display text-base font-bold text-charcoal border-b border-neutralBorder-light pb-3">
            Order Receipt Summary
          </h3>
          <OrderItemBill
            items={confirmedOrder.orderedItems || confirmedOrder.items || []}
            totalAmount={confirmedOrder.totalAmount}
            deliveryFee={40}
          />
        </div>

        {/* Navigation CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link to="/orders" className="w-full sm:flex-1">
            <Button variant="primary" className="w-full justify-center">
              <span>View Live Delivery Progress</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/restaurants" className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full justify-center">
              Discover More Places
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

