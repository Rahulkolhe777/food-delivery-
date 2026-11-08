import React from 'react';
import { cn } from '@/lib/utils';

const sizeMap = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-11 h-11 text-base',
  xl: 'w-14 h-14 text-lg',
};

export default function Avatar({
  src,
  name = '',
  size = 'md',
  className,
  alt = 'Avatar',
}) {
  const [imageError, setImageError] = React.useState(false);

  const getInitials = (text) => {
    if (!text) return 'U';
    const parts = text.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return text.slice(0, 2).toUpperCase();
  };

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full overflow-hidden flex-shrink-0 select-none border border-neutralBorder',
        'bg-terracotta-50 text-terracotta-600 font-semibold',
        sizeMap[size] || sizeMap.md,
        className
      )}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
}

