import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, ChevronDown, CheckCircle2, Menu, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useOwnerRestaurant } from '@/context/OwnerRestaurantContext';
import { cn } from '@/lib/utils';

export default function OwnerHeader({ onOpenMobile }) {
  const { user, handleLogout } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  const {
    selectedId,
    setSelectedId,
    restaurants,
    activeRestaurant,
    toggleRestaurantOpen,
    isUpdatingStatus,
  } = useOwnerRestaurant();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  async function onLogout() {
    await handleLogout();
    success('Signed out', 'Owner session terminated.');
    navigate('/login');
  }

  const isOpen = activeRestaurant?.isOpen ?? true;

  return (
    <header className="h-16 border-b border-neutralBorder bg-surface/90 backdrop-blur-md flex items-center px-4 sm:px-6 justify-between gap-4 flex-shrink-0 sticky top-0 z-30">
      {/* Left: Mobile hamburger + Active Restaurant Picker */}
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden text-charcoal p-1.5 rounded-lg hover:bg-surface-subtle"
          onClick={onOpenMobile}
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

        {/* Restaurant Switcher Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen((o) => !o)}
            className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-neutralBorder rounded-xl hover:border-terracotta-300 transition-all shadow-warm-xs text-left"
          >
            <div className="w-6 h-6 rounded-lg bg-terracotta-50 text-terracotta-600 flex items-center justify-center shrink-0">
              <Store className="w-3.5 h-3.5" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xs font-bold text-charcoal block leading-tight truncate max-w-[150px]">
                {activeRestaurant?.name || 'Loading Kitchen...'}
              </span>
              <span className="text-[10px] text-charcoal-muted block leading-tight">
                {[activeRestaurant?.area, activeRestaurant?.city].filter(Boolean).join(', ') || 'Bhopal'}
              </span>
            </div>
            <ChevronDown
              size={14}
              className={cn('text-charcoal-muted transition-transform ml-1', isDropdownOpen && 'rotate-180')}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute left-0 top-full mt-2 w-64 bg-surface border border-neutralBorder rounded-2xl shadow-warm-lg p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-neutralBorder-light text-[10px] uppercase font-bold text-charcoal-muted">
                Switch Kitchen Location
              </div>
              <div className="max-h-56 overflow-y-auto space-y-0.5 pt-1">
                {restaurants.map((rest) => (
                  <button
                    key={rest._id}
                    type="button"
                    onClick={() => {
                      setSelectedId(rest._id);
                      setIsDropdownOpen(false);
                    }}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors',
                      rest._id === selectedId
                        ? 'bg-terracotta-50 text-terracotta-700 font-bold'
                        : 'text-charcoal hover:bg-surface-subtle'
                    )}
                  >
                    <div className="truncate pr-2">
                      <p className="truncate">{rest.name}</p>
                      <p className="text-[10px] text-charcoal-muted font-normal">
                        {[rest.area, rest.city].filter(Boolean).join(', ')}
                      </p>
                    </div>
                    {rest._id === selectedId && (
                      <CheckCircle2 size={14} className="text-terracotta-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Live Open/Close Toggle + User profile + Logout */}
      <div className="flex items-center gap-3">
        {/* Instant Open / Close Toggle Button */}
        <button
          type="button"
          onClick={toggleRestaurantOpen}
          disabled={isUpdatingStatus}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all shadow-warm-xs',
            isOpen
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
              : 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
          )}
          title="Toggle live ordering for this restaurant"
        >
          <span
            className={cn(
              'w-2 h-2 rounded-full animate-pulse',
              isOpen ? 'bg-emerald-500' : 'bg-amber-500'
            )}
          />
          <span className="hidden sm:inline">
            {isOpen ? 'Kitchen Open' : 'Kitchen Paused'}
          </span>
        </button>

        {/* User initials */}
        <div className="flex items-center gap-2 pl-2 border-l border-neutralBorder-light">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs font-bold text-charcoal truncate max-w-[140px]">
              {user?.name}
            </span>
            <span className="text-[10px] text-charcoal-muted">Merchant</span>
          </div>

          <div className="w-8 h-8 rounded-full bg-terracotta-50 border border-terracotta-200 text-terracotta-600 font-bold text-xs flex items-center justify-center">
            {user?.name?.[0]?.toUpperCase() || 'O'}
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="p-1.5 text-charcoal-muted hover:text-culinary-nonveg rounded-lg hover:bg-culinary-nonvegBg transition-colors"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}

