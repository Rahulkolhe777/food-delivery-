import React from 'react';
import { Clock, Utensils, CheckCircle2, XCircle } from 'lucide-react';
import Badge from '@/components/ui/Badge';

const statusConfig = {
  placed: {
    label: 'Order Placed',
    variant: 'placed',
    icon: <Clock className="w-3 h-3 text-amber-600" />,
  },
  preparing: {
    label: 'Preparing in Kitchen',
    variant: 'preparing',
    icon: <Utensils className="w-3 h-3 text-terracotta-600" />,
  },
  delivered: {
    label: 'Delivered',
    variant: 'delivered',
    icon: <CheckCircle2 className="w-3 h-3 text-culinary-veg" />,
  },
  cancelled: {
    label: 'Cancelled',
    variant: 'cancelled',
    icon: <XCircle className="w-3 h-3 text-culinary-nonveg" />,
  },
};

export default function OrderStatusBadge({ status, className }) {
  const normalized = (status || '').toLowerCase();
  const config = statusConfig[normalized] || {
    label: status || 'Unknown',
    variant: 'default',
    icon: null,
  };

  return (
    <Badge variant={config.variant} icon={config.icon} className={className}>
      {config.label}
    </Badge>
  );
}

