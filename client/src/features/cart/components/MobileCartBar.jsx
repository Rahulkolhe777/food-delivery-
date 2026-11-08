import React, { useState } from 'react';
import { Button, Dialog } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';

export default function MobileCartBar({
  items = [],
  totalAmount = 0,
  totalItems = 0,
  isCurrentRestaurantCart = false,
  restaurantIsOpen = true,
  onCheckout,
}) {
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  if (!isCurrentRestaurantCart || items.length === 0) return null;

  return (
    <>
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
        <div className="bg-charcoal text-white rounded-2xl p-3 shadow-warm-lg flex items-center justify-between gap-4 border border-charcoal/80">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-terracotta-500 text-white font-bold text-xs flex items-center justify-center">
              {totalItems}
            </span>
            <div>
              <p className="text-xs font-bold">{formatCurrency(totalAmount)}</p>
              <p className="text-[10px] text-white/70">Extra charges may apply</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMobileCartOpen(true)}
              className="text-xs font-semibold px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              View
            </button>
            <button
              type="button"
              disabled={!restaurantIsOpen}
              onClick={onCheckout}
              className="text-xs font-bold px-4 py-2 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 transition-colors disabled:opacity-50"
            >
              Checkout →
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Cart Modal */}
      <Dialog
        isOpen={isMobileCartOpen}
        onClose={() => setIsMobileCartOpen(false)}
        size="sm"
        title="Your Basket"
      >
        <div className="space-y-4">
          <div className="max-h-64 overflow-y-auto divide-y divide-neutralBorder-light">
            {items.map((cartItem) => (
              <div
                key={cartItem.menuItemId}
                className="py-2.5 flex items-center justify-between text-xs"
              >
                <span className="font-medium text-charcoal">{cartItem.name}</span>
                <span className="font-bold text-charcoal">
                  {cartItem.quantity} × {formatCurrency(cartItem.price)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-neutralBorder pt-2 text-xs flex justify-between font-bold text-charcoal">
            <span>Total Payable</span>
            <span className="text-terracotta-600">{formatCurrency(totalAmount)}</span>
          </div>

          <Button
            variant="primary"
            className="w-full"
            disabled={!restaurantIsOpen}
            onClick={() => {
              setIsMobileCartOpen(false);
              onCheckout();
            }}
          >
            Proceed to Checkout
          </Button>
        </div>
      </Dialog>
    </>
  );
}

