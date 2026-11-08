import React from 'react';
import { Eye, XCircle } from 'lucide-react';
import { Button } from '@/components/ui';
import OrderStatusBadge from '@/components/shared/OrderStatusBadge';
import { formatCurrency, formatDateTime, timeAgo, getPaymentLabel, cn } from '@/lib/utils';

export default function OwnerOrderCards({
  orders = [],
  onSelectDetails,
  onAdvanceToPreparing,
  onOpenDeliverModal,
  onOpenCancelModal,
  isMutating = false,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {orders.map((order) => {
        const isPlaced = order.status === 'placed';
        const isPreparing = order.status === 'preparing';

        return (
          <div
            key={order._id}
            className={cn(
              'bg-surface border rounded-2xl p-4 shadow-warm-xs flex flex-col justify-between gap-4 transition-all',
              isPlaced && 'border-amber-400 bg-amber-50/10 ring-1 ring-amber-300',
              isPreparing && 'border-terracotta-300'
            )}
          >
            {/* Card Header */}
            <div className="flex items-start justify-between gap-2 border-b border-neutralBorder-light pb-2.5">
              <div>
                <span className="font-mono text-xs font-bold text-charcoal">
                  #{order._id.slice(-6).toUpperCase()}
                </span>
                <span className="text-[10px] text-charcoal-muted block">
                  {timeAgo(order.createdAt)} • {formatDateTime(order.createdAt)}
                </span>
              </div>
              <OrderStatusBadge status={order.status} size="sm" />
            </div>

            {/* Customer & Dishes */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-charcoal-secondary">
                <span className="font-semibold text-charcoal">
                  {order.customer?.name || 'Customer'}
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-surface-subtle border border-neutralBorder-light">
                  {getPaymentLabel(order.paymentMethod)}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-surface-subtle border border-neutralBorder-light text-xs text-charcoal space-y-1">
                {order.items?.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[11px]">
                    <span className="truncate pr-2 font-medium">
                      {it.quantity}× {it.name}
                    </span>
                    <span className="text-charcoal-muted font-mono shrink-0">
                      {formatCurrency(it.price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total & Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-neutralBorder-light">
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-charcoal-muted block">
                  Total
                </span>
                <span className="font-mono font-bold text-sm text-terracotta-600">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {isPlaced && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={isMutating}
                      onClick={() => onAdvanceToPreparing(order._id)}
                      className="text-xs px-2.5 py-1 h-8"
                    >
                      Accept & Cook
                    </Button>
                    <button
                      type="button"
                      onClick={() => onOpenCancelModal(order)}
                      className="p-1.5 text-culinary-nonveg hover:bg-culinary-nonvegBg rounded-lg transition-colors cursor-pointer"
                      title="Reject"
                    >
                      <XCircle size={16} />
                    </button>
                  </>
                )}

                {isPreparing && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={isMutating}
                      onClick={() => onOpenDeliverModal(order)}
                      className="text-xs px-2.5 py-1 h-8 bg-emerald-700 hover:bg-emerald-800 border-none"
                    >
                      Mark Delivered
                    </Button>
                    <button
                      type="button"
                      onClick={() => onOpenCancelModal(order)}
                      className="p-1.5 text-culinary-nonveg hover:bg-culinary-nonvegBg rounded-lg transition-colors cursor-pointer"
                      title="Cancel"
                    >
                      <XCircle size={16} />
                    </button>
                  </>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSelectDetails(order)}
                  className="p-1.5 h-8 text-charcoal-muted hover:text-charcoal"
                >
                  <Eye size={15} />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

