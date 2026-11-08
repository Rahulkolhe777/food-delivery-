import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Textarea = forwardRef(
  (
    {
      label,
      error,
      hint,
      id,
      className,
      containerClassName,
      required,
      rows = 3,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={cn('flex flex-col gap-1.5 w-full text-left', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-charcoal-secondary uppercase tracking-wider"
          >
            {label}
            {required && <span className="text-terracotta-500 ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          aria-invalid={!!error}
          className={cn(
            'w-full bg-surface text-charcoal text-sm placeholder:text-charcoal-subtle',
            'border border-neutralBorder rounded-xl px-3.5 py-2.5 transition-all duration-150 resize-y',
            'focus:outline-none focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-100',
            'hover:border-neutralBorder-strong',
            error && 'border-culinary-nonveg focus:border-culinary-nonveg focus:ring-red-100',
            className
          )}
          {...props}
        />

        {error && <p className="text-xs text-culinary-nonveg font-medium mt-0.5">{error}</p>}
        {!error && hint && <p className="text-xs text-charcoal-muted mt-0.5">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
export default Textarea;

