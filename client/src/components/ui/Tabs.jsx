import React, { createContext, useContext, useState } from 'react';
import { cn } from '@/lib/utils';

const TabsContext = createContext(null);

export function Tabs({ defaultValue, value, onValueChange, children, className }) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  const currentTab = value !== undefined ? value : activeTab;

  const handleTabChange = (val) => {
    if (value === undefined) setActiveTab(val);
    if (onValueChange) onValueChange(val);
  };

  return (
    <TabsContext.Provider value={{ currentTab, changeTab: handleTabChange }}>
      <div className={cn('w-full flex flex-col', className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className }) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 p-1 bg-surface-subtle border border-neutralBorder rounded-xl select-none',
        className
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, className, icon }) {
  const { currentTab, changeTab } = useContext(TabsContext);
  const isActive = currentTab === value;

  return (
    <button
      type="button"
      onClick={() => changeTab(value)}
      className={cn(
        'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all duration-150',
        isActive
          ? 'bg-surface text-charcoal shadow-warm-xs border border-neutralBorder/50'
          : 'text-charcoal-muted hover:text-charcoal hover:bg-surface/50 border border-transparent',
        className
      )}
    >
      {icon && <span className="w-3.5 h-3.5">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

export function TabsContent({ value, children, className }) {
  const { currentTab } = useContext(TabsContext);
  if (currentTab !== value) return null;

  return (
    <div className={cn('mt-4 focus-visible:outline-none animate-fadeIn', className)}>
      {children}
    </div>
  );
}

