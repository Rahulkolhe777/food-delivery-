import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const Select = forwardRef(
  (
    {
      label,
      error,
      hint,
      id,
      className,
      containerClassName,
      required,
      leftIcon,
      children,
      ...props
    },
    ref
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={cn('flex flex-col gap-1.5 w-full text-left', containerClassName)}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-semibold text-charcoal-secondary uppercase tracking-wider"
          >
            {label}
            {required && <span className="text-terracotta-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3.5 text-charcoal-muted pointer-events-none flex items-center z-10">
              {leftIcon}
            </span>
          )}

          <select
            ref={ref}
            id={selectId}
            aria-invalid={!!error}
            className={cn(
              'w-full appearance-none bg-surface text-charcoal text-sm cursor-pointer',
              'border border-neutralBorder rounded-xl px-3.5 py-2.5 pr-10 transition-all duration-150',
              'focus:outline-none focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-100',
              'hover:border-neutralBorder-strong',
              error && 'border-culinary-nonveg focus:border-culinary-nonveg focus:ring-red-100',
              leftIcon && 'pl-10',
              className
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown
            className="w-4 h-4 text-charcoal-muted absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          />
        </div>

        {error && <p className="text-xs text-culinary-nonveg font-medium mt-0.5">{error}</p>}
        {!error && hint && <p className="text-xs text-charcoal-muted mt-0.5">{hint}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
