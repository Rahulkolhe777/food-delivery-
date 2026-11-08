import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  Settings,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  X,
  Utensils,
  Sparkles,
  Store,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { to: '/owner', icon: LayoutDashboard, label: 'Overview', end: true },
  { to: '/owner/restaurants', icon: Store, label: 'My Restaurants' },
  { to: '/owner/menu', icon: UtensilsCrossed, label: 'Menu Management' },
  { to: '/owner/orders', icon: ClipboardList, label: 'Orders' },
  { to: '/owner/reviews', icon: Star, label: 'Reviews' },
  { to: '/owner/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/owner/settings', icon: Settings, label: 'Settings' },
];

export default function OwnerSidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside
        className={cn(
          'hidden lg:flex flex-col border-r border-neutralBorder bg-surface transition-all duration-300 flex-shrink-0 z-20',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        {/* Brand Bar */}
        <div className="h-16 flex items-center px-4 border-b border-neutralBorder flex-shrink-0 justify-between">
          <Link to="/owner" className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-terracotta-500 flex items-center justify-center text-white flex-shrink-0 shadow-sm shadow-terracotta/20">
              <Utensils className="w-4 h-4 stroke-[2.2]" />
            </div>
            {!collapsed && (
              <span className="font-display font-bold text-lg text-charcoal truncate">
                FoodHub<span className="text-terracotta-500">.</span>
              </span>
            )}
          </Link>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="text-charcoal-muted hover:text-charcoal p-1 rounded-lg hover:bg-surface-subtle transition-colors ml-auto"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 space-y-1 px-3 overflow-y-auto">
          {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all',
                  isActive
                    ? 'bg-terracotta-50 text-terracotta-600 border border-terracotta-200 shadow-warm-xs'
                    : 'text-charcoal-secondary hover:text-charcoal hover:bg-surface-subtle border border-transparent'
                )
              }
              title={collapsed ? label : undefined}
            >
              <Icon size={16} className="flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom utility links */}
        <div className="p-3 border-t border-neutralBorder space-y-1">
          <Link
            to="/showcase"
            className="flex items-center gap-3 px-3 py-2 w-full rounded-xl text-xs font-semibold text-charcoal-secondary hover:text-charcoal hover:bg-surface-subtle transition-colors"
            title={collapsed ? 'Design Showcase' : undefined}
          >
            <Sparkles size={16} className="text-terracotta-500 flex-shrink-0" />
            {!collapsed && <span>Design Showcase</span>}
          </Link>
        </div>
      </aside>

      {/* ── Mobile Sidebar Drawer (Overlay) ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-64 max-w-[80%] bg-surface h-full flex flex-col border-r border-neutralBorder shadow-warm-xl z-10 animate-in slide-in-from-left duration-200">
            <div className="h-16 flex items-center justify-between px-4 border-b border-neutralBorder">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-terracotta-500 flex items-center justify-center text-white">
                  <Utensils className="w-4 h-4" />
                </div>
                <span className="font-display font-bold text-lg text-charcoal">
                  FoodHub<span className="text-terracotta-500">.</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-1.5 text-charcoal-muted hover:text-charcoal rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 py-4 space-y-1 px-3 overflow-y-auto">
              {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all',
                      isActive
                        ? 'bg-terracotta-50 text-terracotta-600 border border-terracotta-200'
                        : 'text-charcoal-secondary hover:text-charcoal hover:bg-surface-subtle'
                    )
                  }
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

