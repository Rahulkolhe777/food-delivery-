import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Table = forwardRef(({ className, ...props }, ref) => (
  <div className="w-full overflow-auto rounded-xl border border-neutralBorder bg-surface">
    <table
      ref={ref}
      className={cn('w-full caption-bottom text-sm text-left', className)}
      {...props}
    />
  </div>
));
Table.displayName = 'Table';

const TableHeader = forwardRef(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn('bg-surface-subtle border-b border-neutralBorder text-xs text-charcoal-muted uppercase tracking-wider', className)}
    {...props}
  />
));
TableHeader.displayName = 'TableHeader';

const TableBody = forwardRef(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('divide-y divide-neutralBorder-light', className)}
    {...props}
  />
));
TableBody.displayName = 'TableBody';

const TableRow = forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'transition-colors hover:bg-surface-hover/80 data-[state=selected]:bg-surface-subtle',
      className
    )}
    {...props}
  />
));
TableRow.displayName = 'TableRow';

const TableHead = forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-11 px-4 text-left align-middle font-semibold text-charcoal-secondary text-xs uppercase tracking-wider',
      className
    )}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

const TableCell = forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn('p-4 align-middle text-sm text-charcoal', className)}
    {...props}
  />
));
TableCell.displayName = 'TableCell';

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
export default Table;

