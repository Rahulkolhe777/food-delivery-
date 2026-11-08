import React from 'react';
import { Loader2 } from 'lucide-react';

export default function PageLoader({ message = 'Loading culinary experience...' }) {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center gap-3 p-8">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-terracotta-100 border-t-terracotta-500 animate-spin" />
        <Loader2 className="w-5 h-5 text-terracotta-500 absolute inset-0 m-auto animate-pulse" />
      </div>
      <p className="text-xs uppercase font-medium tracking-wider text-charcoal-muted font-sans">
        {message}
      </p>
    </div>
  );
}

