import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function Dropdown({
  trigger,
  items = [], // [{ label, icon, onClick, danger, disabled, divider }]
  align = 'right',
  className,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen((prev) => !prev)} className="cursor-pointer">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            className={cn(
              'absolute z-50 mt-1.5 w-48 rounded-xl bg-surface border border-neutralBorder shadow-warm-md py-1.5 focus:outline-none',
              align === 'right' ? 'right-0' : 'left-0',
              className
            )}
          >
            {items.map((item, index) => {
              if (item.divider) {
                return <div key={index} className="h-px bg-neutralBorder-light my-1" />;
              }

              return (
                <button
                  key={index}
                  type="button"
                  disabled={item.disabled}
                  onClick={() => {
                    if (!item.disabled && item.onClick) {
                      item.onClick();
                      setIsOpen(false);
                    }
                  }}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-left transition-colors',
                    item.disabled
                      ? 'text-charcoal-subtle cursor-not-allowed'
                      : item.danger
                      ? 'text-culinary-nonveg hover:bg-culinary-nonvegBg'
                      : 'text-charcoal-secondary hover:text-charcoal hover:bg-surface-subtle'
                  )}
                >
                  {item.icon && <span className="w-4 h-4 flex-shrink-0">{item.icon}</span>}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

