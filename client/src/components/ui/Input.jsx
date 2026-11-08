import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Input = forwardRef(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightElement,
      id,
      className,
      containerClassName,
      required,
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

        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3.5 text-charcoal-muted pointer-events-none flex items-center">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            className={cn(
              'w-full bg-surface text-charcoal text-sm placeholder:text-charcoal-subtle',
              'border border-neutralBorder rounded-xl px-3.5 py-2.5 transition-all duration-150',
              'focus:outline-none focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-100',
              'hover:border-neutralBorder-strong',
              error && 'border-culinary-nonveg focus:border-culinary-nonveg focus:ring-red-100',
              leftIcon && 'pl-10',
              rightElement && 'pr-10',
              className
            )}
            {...props}
          />

          {rightElement && (
            <span className="absolute right-3.5 flex items-center text-charcoal-muted">
              {rightElement}
            </span>
          )}
        </div>

        {error && <p className="text-xs text-culinary-nonveg font-medium mt-0.5">{error}</p>}
        {!error && hint && <p className="text-xs text-charcoal-muted mt-0.5">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
