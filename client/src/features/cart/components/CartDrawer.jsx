import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, AlertCircle, Plus, Minus } from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import DietaryIndicator from '@/components/shared/DietaryIndicator';

export default function CartDrawer({
  restaurant,
  cartItems = [],
  totalAmount = 0,
  totalItems = 0,
  isCurrentRestaurantCart = true,
  cartRestaurantName = '',
  onUpdateQuantity,
  onClearCart,
  onStartNewBasket,
}) {
  const navigate = useNavigate();

  return (
    <aside className="hidden lg:block lg:col-span-4 sticky top-28">
      <div className="bg-surface border border-neutralBorder rounded-3xl p-5 shadow-warm-sm space-y-4">
        <div className="flex items-center justify-between border-b border-neutralBorder-light pb-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-terracotta-500" />
            <h3 className="font-display text-base font-bold text-charcoal">
              Your Basket
            </h3>
          </div>
          {isCurrentRestaurantCart && cartItems.length > 0 && (
            <Badge variant="terracotta" size="sm">
              {totalItems} item{totalItems !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        {/* Basket Content */}
        {isCurrentRestaurantCart && cartItems.length > 0 ? (
          <div className="space-y-4">
            <div className="max-h-72 overflow-y-auto divide-y divide-neutralBorder-light pr-1">
              {cartItems.map((cartItem) => (
                <div key={cartItem.menuItemId} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <DietaryIndicator isVeg={cartItem.isVeg ?? true} size="sm" />
                    <span className="font-medium text-charcoal truncate">
                      {cartItem.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <div className="flex items-center border border-neutralBorder rounded-lg bg-surface-subtle overflow-hidden">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(cartItem.menuItemId, cartItem.quantity - 1)}
                        className="p-1 hover:bg-neutralBorder text-charcoal-muted hover:text-charcoal transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 font-bold text-charcoal text-xs">
                        {cartItem.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(cartItem.menuItemId, cartItem.quantity + 1)}
                        className="p-1 hover:bg-neutralBorder text-charcoal-muted hover:text-charcoal transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-bold text-charcoal w-12 text-right tabular-nums">
                      {formatCurrency(cartItem.price * cartItem.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Breakdown */}
            <div className="border-t border-neutralBorder pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-charcoal-secondary">
                <span>Item Subtotal</span>
                <span className="font-semibold text-charcoal">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
              <div className="flex justify-between text-charcoal-muted text-[11px]">
                <span>Taxes & Restaurant Charges</span>
                <span>Calculated at checkout</span>
              </div>

              <div className="flex justify-between text-sm font-bold text-charcoal pt-2 border-t border-neutralBorder-light">
                <span>Total Payable</span>
                <span className="text-terracotta-600 text-base">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <Button
                variant="primary"
                className="w-full justify-between"
                disabled={!restaurant?.isOpen}
                onClick={() => navigate('/checkout')}
              >
                <span>Proceed to Checkout</span>
                <span>{formatCurrency(totalAmount)} →</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs text-charcoal-muted hover:text-culinary-nonveg"
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                onClick={onClearCart}
              >
                Clear Basket
              </Button>
            </div>
          </div>
        ) : cartItems.length > 0 && !isCurrentRestaurantCart ? (
          /* Cart belongs to another restaurant */
          <div className="text-center py-6 px-2 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-charcoal">
                Active basket in "{cartRestaurantName}"
              </h4>
              <p className="text-[11px] text-charcoal-secondary mt-1">
                Your basket holds {totalItems} item{totalItems !== 1 ? 's' : ''} from another restaurant. Adding an item here will start a new basket.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-xs w-full"
              onClick={onStartNewBasket}
            >
              Start New Basket Here
            </Button>
          </div>
        ) : (
          /* Empty Basket State */
          <div className="text-center py-10 px-2 space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-surface-subtle flex items-center justify-center text-charcoal-muted">
              <ShoppingBag className="w-5 h-5 text-charcoal-muted stroke-[1.8]" />
            </div>
            <p className="text-xs font-semibold text-charcoal">Your basket is empty</p>
            <p className="text-[11px] text-charcoal-muted">
              Add signature culinary dishes from the menu to place an order.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}

