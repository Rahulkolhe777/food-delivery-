/**
 * CheckoutPage — Customer cart review and order placement.
 * Decomposed into:
 *  - features/cart: CartReview
 *  - features/orders: OrderSummaryCard, OrderConfirmationView, createOrder
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ShoppingBag, AlertCircle } from 'lucide-react';

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { createOrder } from '@/features/orders';

import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';

// Decomposed Feature Components
import CartReview from '@/features/cart/components/CartReview';
import OrderSummaryCard from '@/features/orders/components/OrderSummaryCard';
import OrderConfirmationView from '@/features/orders/components/OrderConfirmationView';

export default function CheckoutPage() {
  const { user, isAuthenticated, isCustomer, isOwner } = useAuth();
  const { success, error: toastError } = useToast();

  const {
    items,
    totalAmount,
    totalItems,
    restaurantId,
    restaurantName,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const handlePlaceOrder = async (e) => {
    e?.preventDefault();
    setSubmitError(null);

    if (!isAuthenticated) {
      setSubmitError('Please sign in to place your order.');
      return;
    }

    if (!isCustomer) {
      setSubmitError(
        'Restaurant owner accounts cannot place customer food orders. Please sign in with a Customer account.'
      );
      return;
    }

    if (!restaurantId || items.length === 0) {
      setSubmitError('Your basket is empty. Please select items from a restaurant.');
      return;
    }

    for (const item of items) {
      if (item.quantity < 1 || item.quantity > 20) {
        setSubmitError(`Invalid quantity for "${item.name}". Must be between 1 and 20.`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const payload = {
        restaurantId,
        paymentMethod,
        items: items.map((i) => ({
          menuItemId: i.menuItemId,
          quantity: i.quantity,
        })),
      };

      const response = await createOrder(payload);
      const { order } = response;

      setConfirmedOrder({
        ...order,
        restaurantName: restaurantName || 'Restaurant',
        orderedItems: [...items],
      });

      clearCart();
      success('Order Placed!', `Your order #${order._id.slice(-6).toUpperCase()} has been sent to the kitchen.`);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Could not place your order. Please review your basket and try again.';
      setSubmitError(msg);
      toastError('Order Failed', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // View 1: Confirmed Order Receipt
  if (confirmedOrder) {
    return <OrderConfirmationView confirmedOrder={confirmedOrder} />;
  }

  // View 2: Empty Cart
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-canvas py-16 px-4 sm:px-6">
        <div className="max-w-md mx-auto">
          <EmptyState
            icon={ShoppingBag}
            title="Your Basket is Empty"
            description="You haven't added any dishes yet. Discover signature flavors from our dining venues."
            action={
              <Link to="/restaurants">
                <Button variant="primary">Explore Restaurants</Button>
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  // View 3: Checkout Form & Order Summary
  return (
    <div className="min-h-screen bg-canvas py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Link
          to={restaurantId ? `/restaurants/${restaurantId}` : '/restaurants'}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-secondary hover:text-terracotta-600 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Back to menu
        </Link>

        <h1 className="font-display text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
          Review & Place Your Order
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Review items & Delivery Address */}
          <div className="lg:col-span-7 space-y-6">
            <CartReview
              restaurantName={restaurantName}
              items={items}
              totalItems={totalItems}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
              onClearCart={clearCart}
            />

            {/* Diner Info & Address */}
            <div className="bg-surface border border-neutralBorder rounded-3xl p-5 sm:p-6 shadow-warm-xs space-y-4">
              <h2 className="font-display text-base font-bold text-charcoal border-b border-neutralBorder-light pb-3">
                2. Diner Information & Address
              </h2>

              {isAuthenticated ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-surface-subtle rounded-2xl border border-neutralBorder-light text-xs">
                    <div>
                      <span className="text-charcoal-muted block text-[10px] uppercase font-bold">Diner</span>
                      <span className="font-semibold text-charcoal truncate block mt-0.5">{user?.name}</span>
                    </div>
                    <div>
                      <span className="text-charcoal-muted block text-[10px] uppercase font-bold">Email</span>
                      <span className="font-semibold text-charcoal truncate block mt-0.5">{user?.email}</span>
                    </div>
                    <div>
                      <span className="text-charcoal-muted block text-[10px] uppercase font-bold">City</span>
                      <span className="font-semibold text-charcoal block mt-0.5">{user?.city || 'Default'}</span>
                    </div>
                  </div>

                  {isOwner && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold">Owner Account Detected:</strong>
                        <p className="mt-0.5">Please sign in with a Customer profile to place orders.</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-charcoal">
                      Delivery Address & Instructions
                    </label>
                    <input
                      type="text"
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      placeholder="e.g. Flat 402, Royal Palms, Landmark near Metro Gate 2"
                      className="w-full h-10 px-3 bg-surface border border-neutralBorder rounded-xl text-xs text-charcoal placeholder:text-charcoal-muted focus:outline-none focus:border-terracotta-400 focus:ring-1 focus:ring-terracotta-200 transition-colors shadow-warm-xs"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-center justify-between gap-3">
                  <span>Please sign in to confirm delivery address and complete checkout.</span>
                  <Link to="/login" state={{ from: { pathname: '/checkout' } }}>
                    <Button variant="primary" size="sm">Sign In</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="lg:col-span-5">
            <OrderSummaryCard
              totalAmount={totalAmount}
              paymentMethod={paymentMethod}
              onSelectPaymentMethod={setPaymentMethod}
              onPlaceOrder={handlePlaceOrder}
              isSubmitting={isSubmitting}
              submitError={submitError}
              isAuthenticated={isAuthenticated}
              isCustomer={isCustomer}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
