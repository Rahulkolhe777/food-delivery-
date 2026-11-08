import React from 'react';
import { Eye, XCircle } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Button,
} from '@/components/ui';
import OrderStatusBadge from '@/components/shared/OrderStatusBadge';
import { formatCurrency, timeAgo, getPaymentLabel, cn } from '@/lib/utils';

export default function OwnerOrdersTable({
  orders = [],
  onSelectDetails,
  onAdvanceToPreparing,
  onOpenDeliverModal,
  onOpenCancelModal,
  isMutating = false,
}) {
  return (
    <div className="bg-surface border border-neutralBorder rounded-2xl overflow-hidden shadow-warm-xs">
      <Table>
        <TableHeader>
          <TableRow className="bg-surface-subtle/80 text-[11px] uppercase tracking-wider text-charcoal-muted border-b border-neutralBorder">
            <TableHead className="w-36">Order Reference</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Ordered Dishes</TableHead>
            <TableHead className="text-right">Order Total</TableHead>
            <TableHead className="text-center">Payment</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-neutralBorder-light">
          {orders.map((order) => {
            const isPlaced = order.status === 'placed';
            const isPreparing = order.status === 'preparing';
            const isCancelled = order.status === 'cancelled';

            return (
              <TableRow
                key={order._id}
                className={cn(
                  'transition-colors',
                  isPlaced && 'bg-amber-50/20 font-medium',
                  isCancelled && 'opacity-65 bg-surface-subtle/50'
                )}
              >
                {/* Order Reference */}
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-mono text-xs font-bold text-charcoal">
                      #{order._id.slice(-6).toUpperCase()}
                    </span>
                    <span className="text-[11px] text-charcoal-muted">
                      {timeAgo(order.createdAt)}
                    </span>
                  </div>
                </TableCell>

                {/* Customer */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-surface-subtle border border-neutralBorder flex items-center justify-center font-bold text-xs text-charcoal shrink-0">
                      {order.customer?.name?.[0]?.toUpperCase() || 'C'}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-charcoal">
                        {order.customer?.name || 'Verified Customer'}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Dishes Summary */}
                <TableCell>
                  <div className="flex flex-col max-w-xs">
                    <span className="text-xs text-charcoal font-medium truncate">
                      {order.items?.map((i) => `${i.quantity}× ${i.name}`).join(', ')}
                    </span>
                    <span className="text-[10px] text-charcoal-muted">
                      {order.items?.length || 0} unique dish{order.items?.length === 1 ? '' : 'es'}
                    </span>
                  </div>
                </TableCell>

                {/* Total */}
                <TableCell className="text-right font-mono font-bold text-sm text-terracotta-600">
                  {formatCurrency(order.totalAmount)}
                </TableCell>

                {/* Payment */}
                <TableCell className="text-center">
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-surface-subtle border border-neutralBorder text-charcoal-secondary uppercase">
                    {getPaymentLabel(order.paymentMethod)}
                  </span>
                </TableCell>

                {/* Status */}
                <TableCell className="text-center">
                  <OrderStatusBadge status={order.status} />
                </TableCell>

                {/* Action State Machine */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {isPlaced && (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          disabled={isMutating}
                          onClick={() => onAdvanceToPreparing(order._id)}
                          className="text-xs px-2.5 py-1 h-7"
                          title="Start Cooking"
                        >
                          Accept & Prep
                        </Button>
                        <button
                          type="button"
                          onClick={() => onOpenCancelModal(order)}
                          className="p-1.5 text-culinary-nonveg hover:bg-culinary-nonvegBg rounded-lg transition-colors cursor-pointer"
                          title="Reject Order"
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
                          className="text-xs px-2.5 py-1 h-7 bg-emerald-700 hover:bg-emerald-800 border-none"
                          title="Mark Delivered"
                        >
                          Mark Delivered
                        </Button>
                        <button
                          type="button"
                          onClick={() => onOpenCancelModal(order)}
                          className="p-1.5 text-culinary-nonveg hover:bg-culinary-nonvegBg rounded-lg transition-colors cursor-pointer"
                          title="Cancel Order"
                        >
                          <XCircle size={16} />
                        </button>
                      </>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSelectDetails(order)}
                      className="p-1.5 h-7 w-7 text-charcoal-muted hover:text-charcoal"
                      title="View Details"
                    >
                      <Eye size={15} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

