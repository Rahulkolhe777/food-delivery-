import React from 'react';
import { ShieldCheck, Banknote, QrCode, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui';
import { formatCurrency, cn } from '@/lib/utils';

const PAYMENT_OPTIONS = [
  {
    id: 'cod',
    label: 'Cash on Delivery',
    description: 'Pay via cash or UPI directly to the delivery partner at your doorstep.',
    icon: Banknote,
    badge: 'Popular',
  },
  {
    id: 'upi',
    label: 'UPI on Delivery',
    description: 'Scan the courier QR code or pay using Google Pay, PhonePe, or Paytm.',
    icon: QrCode,
  },
  {
    id: 'card',
    label: 'Card on Delivery',
    description: 'Pay via credit or debit card using the mobile card machine upon arrival.',
    icon: CreditCard,
  },
];

export default function OrderSummaryCard({
  totalAmount = 0,
  paymentMethod = 'cod',
  onSelectPaymentMethod,
  onPlaceOrder,
  isSubmitting = false,
  submitError = null,
  isAuthenticated = true,
  isCustomer = true,
}) {
  const deliveryFee = 40;
  const taxes = Math.round(totalAmount * 0.05);
  const finalTotal = totalAmount + deliveryFee + taxes;

  return (
    <div className="bg-surface border border-neutralBorder rounded-3xl p-5 sm:p-6 shadow-warm-sm space-y-5 sticky top-24">
      {/* Payment Method Selector */}
      <div className="space-y-3">
        <h3 className="font-display text-base font-bold text-charcoal border-b border-neutralBorder-light pb-2">
          Payment Method
        </h3>
        <div className="space-y-2">
          {PAYMENT_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isSelected = paymentMethod === opt.id;

            return (
              <label
                key={opt.id}
                onClick={() => onSelectPaymentMethod(opt.id)}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all',
                  isSelected
                    ? 'border-terracotta-500 bg-terracotta-50/40 ring-1 ring-terracotta-400'
                    : 'border-neutralBorder hover:border-neutralBorder-strong bg-surface'
                )}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={opt.id}
                  checked={isSelected}
                  onChange={() => onSelectPaymentMethod(opt.id)}
                  className="mt-1 accent-terracotta-500"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <Icon className="w-4 h-4 text-terracotta-600" />
                    <span className="font-semibold text-xs text-charcoal">
                      {opt.label}
                    </span>
                    {opt.badge && (
                      <span className="text-[10px] bg-terracotta-100 text-terracotta-700 px-1.5 py-0.2 rounded font-bold">
                        {opt.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-charcoal-muted mt-0.5 leading-snug">
                    {opt.description}
                  </p>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Pricing Summary */}
      <div className="border-t border-neutralBorder pt-4 space-y-2 text-xs">
        <div className="flex justify-between text-charcoal-secondary">
          <span>Items Subtotal</span>
          <span className="font-semibold text-charcoal tabular-nums">
            {formatCurrency(totalAmount)}
          </span>
        </div>
        <div className="flex justify-between text-charcoal-secondary">
          <span>Delivery Partner Fee</span>
          <span className="font-semibold text-charcoal tabular-nums">
            {formatCurrency(deliveryFee)}
          </span>
        </div>
        <div className="flex justify-between text-charcoal-secondary">
          <span>Taxes & Restaurant Charges (5%)</span>
          <span className="font-semibold text-charcoal tabular-nums">
            {formatCurrency(taxes)}
          </span>
        </div>
        <div className="flex justify-between text-base font-bold text-charcoal pt-2 border-t border-neutralBorder-light">
          <span>Total Amount</span>
          <span className="text-terracotta-600 tabular-nums">
            {formatCurrency(finalTotal)}
          </span>
        </div>
      </div>

      {/* Error Callout */}
      {submitError && (
        <div className="p-3 bg-culinary-nonvegBg border border-red-200 rounded-xl text-xs text-culinary-nonveg font-medium">
          {submitError}
        </div>
      )}

      {/* CTA Button */}
      <Button
        variant="primary"
        className="w-full justify-center py-3 text-sm font-bold shadow-terracotta"
        onClick={onPlaceOrder}
        isLoading={isSubmitting}
        disabled={!isAuthenticated || !isCustomer || totalAmount <= 0}
      >
        <span>Place Order ({formatCurrency(finalTotal)})</span>
      </Button>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-charcoal-muted">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Verified restaurant order • Direct kitchen dispatch</span>
      </div>
    </div>
  );
}

