import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';
import { cn } from '@/lib/utils';

export default function Pagination({ page = 1, totalPages = 1, onPageChange, className }) {
  if (totalPages <= 1) return null;

  return (
    <div className={cn('flex items-center justify-center gap-2 select-none py-2', className)}>
      <Button
        variant="secondary"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        leftIcon={<ChevronLeft className="w-4 h-4" />}
        aria-label="Previous Page"
      >
        Previous
      </Button>

      <span className="text-xs font-semibold text-charcoal-secondary px-3 py-1 bg-surface border border-neutralBorder rounded-lg">
        {page} of {totalPages}
      </span>

      <Button
        variant="secondary"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        rightIcon={<ChevronRight className="w-4 h-4" />}
        aria-label="Next Page"
      >
        Next
      </Button>
    </div>
  );
}
