import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import Button from './Button';
import { cn } from '@/lib/utils';

export default function ErrorState({
  title = 'Something went wrong',
  message = 'We encountered an error while communicating with the kitchen server.',
  onRetry,
  compact = false,
  className,
}) {
  const displayMessage =
    typeof message === 'string'
      ? message
      : message?.response?.data?.message || message?.message || 'Unexpected service error.';

  if (compact) {
    return (
      <div
        className={cn(
          'flex items-center justify-between gap-3 p-3 bg-culinary-nonvegBg border border-red-200 rounded-xl text-xs text-culinary-nonveg',
          className
        )}
      >
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="font-medium">{displayMessage}</span>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="underline font-semibold hover:opacity-80 flex-shrink-0"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-surface border border-neutralBorder rounded-2xl shadow-warm-xs',
        className
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-culinary-nonvegBg border border-red-200 flex items-center justify-center text-culinary-nonveg mb-4 shadow-warm-xs">
        <AlertCircle className="w-6 h-6" />
      </div>

      <h4 className="font-display text-lg font-semibold text-charcoal">{title}</h4>
      <p className="text-sm text-charcoal-secondary max-w-sm mt-1.5 leading-relaxed">
        {displayMessage}
      </p>

      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          leftIcon={<RotateCcw className="w-4 h-4" />}
          className="mt-5"
        >
          Try Again
        </Button>
      )}
    </div>
  );
}

// Alias for ErrorMessage
export { ErrorState as ErrorMessage };

