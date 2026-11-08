import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Clock, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import OrderStatusBadge from '@/components/food/OrderStatusBadge';
import { formatCurrency, timeAgo } from '@/lib/utils';

export default function DashboardRecentOrders({
  isLoadingOrders,
  recentOrders = [],
  onUpdateStatus,
  isUpdatingStatus,
}) {
  return (
    <div className="bg-surface border border-neutralBorder rounded-3xl p-6 shadow-warm-xs space-y-4">
      <div className="flex items-center justify-between border-b border-neutralBorder-light pb-3">
        <div>
          <h2 className="font-display text-base font-bold text-charcoal">
            Recent Incoming Orders
          </h2>
          <p className="text-xs text-charcoal-secondary">
            Latest orders received in this kitchen
          </p>
        </div>
        <Link
          to="/owner/orders"
          className="text-xs font-semibold text-terracotta-600 hover:text-terracotta-700 flex items-center gap-1"
        >
          <span>Manage Queue</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      {isLoadingOrders ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      ) : recentOrders.length === 0 ? (
        <div className="p-8 text-center text-charcoal-muted space-y-2">
          <ShoppingBag className="w-8 h-8 mx-auto stroke-[1.5]" />
          <p className="text-xs">No recent orders yet for this location.</p>
        </div>
      ) : (
        <div className="divide-y divide-neutralBorder-light">
          {recentOrders.map((order) => {
            const canAccept = order.status === 'placed';
            const canDeliver = order.status === 'preparing';

            return (
              <div
                key={order._id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-charcoal">
                      {order.customer?.name || 'Customer'}
                    </span>
                    <span className="font-mono text-[10px] text-charcoal-muted">
                      #{order._id.slice(-6).toUpperCase()}
                    </span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="text-charcoal-secondary truncate max-w-sm">
                    {order.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}
                  </p>
                  <p className="text-[10px] text-charcoal-muted flex items-center gap-1">
                    <Clock size={11} />
                    <span>{timeAgo(order.createdAt)}</span>
                    <span>•</span>
                    <span>{formatCurrency(order.totalAmount)}</span>
                  </p>
                </div>

                {/* Quick status transition CTA */}
                <div className="flex items-center gap-2 shrink-0">
                  {canAccept && (
                    <Button
                      variant="primary"
                      size="sm"
                      isLoading={isUpdatingStatus}
                      onClick={() => onUpdateStatus(order._id, 'preparing')}
                      className="h-7 text-xs px-2.5"
                    >
                      Accept
                    </Button>
                  )}

                  {canDeliver && (
                    <Button
                      variant="secondary"
                      size="sm"
                      isLoading={isUpdatingStatus}
                      onClick={() => onUpdateStatus(order._id, 'delivered')}
                      className="h-7 text-xs px-2.5 text-emerald-700 border-emerald-300"
                    >
                      Dispatch
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

