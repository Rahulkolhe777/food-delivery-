import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const variantConfig = {
  success: {
    icon: CheckCircle2,
    borderClass: 'border-emerald-200',
    iconClass: 'text-culinary-veg',
    bgClass: 'bg-surface',
  },
  error: {
    icon: AlertCircle,
    borderClass: 'border-red-200',
    iconClass: 'text-culinary-nonveg',
    bgClass: 'bg-surface',
  },
  warning: {
    icon: AlertTriangle,
    borderClass: 'border-amber-200',
    iconClass: 'text-amber-600',
    bgClass: 'bg-surface',
  },
  info: {
    icon: Info,
    borderClass: 'border-terracotta-200',
    iconClass: 'text-terracotta-500',
    bgClass: 'bg-surface',
  },
};

export default function Toast({ id, type = 'info', title, message, onDismiss }) {
  const config = variantConfig[type] || variantConfig.info;
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'w-84 max-w-sm flex items-start gap-3 p-4 rounded-xl border shadow-warm-md',
        config.bgClass,
        config.borderClass
      )}
      role="alert"
    >
      <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', config.iconClass)} />
      <div className="flex-1 min-w-0">
        {title && <h5 className="text-xs font-bold text-charcoal tracking-tight">{title}</h5>}
        {message && <p className="text-xs text-charcoal-secondary mt-0.5 leading-snug">{message}</p>}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(id)}
        className="text-charcoal-muted hover:text-charcoal p-0.5 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

