import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const variantClasses = {
  primary:
    'bg-terracotta-500 text-white hover:bg-terracotta-600 active:bg-terracotta-700 shadow-sm shadow-terracotta/20 border border-transparent',
  secondary:
    'bg-surface text-charcoal hover:bg-surface-hover active:bg-surface-subtle border border-neutralBorder shadow-warm-xs',
  outline:
    'bg-transparent text-terracotta-500 border border-terracotta-400 hover:bg-terracotta-50 active:bg-terracotta-100',
  ghost:
    'bg-transparent text-charcoal-secondary hover:text-charcoal hover:bg-surface-subtle active:bg-surface-muted',
  danger:
    'bg-culinary-nonveg text-white hover:opacity-90 active:opacity-95 shadow-sm border border-transparent',
};

const sizeClasses = {
  sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5 font-medium',
  md: 'text-sm px-4 py-2.5 rounded-xl gap-2 font-medium',
  lg: 'text-base px-5 py-3 rounded-xl gap-2.5 font-semibold',
};

const Button = forwardRef(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center transition-all duration-150 select-none cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-400/50 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          variantClasses[variant] || variantClasses.primary,
          sizeClasses[size] || sizeClasses.md,
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
