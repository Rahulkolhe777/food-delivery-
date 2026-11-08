import React from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Utensils, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/lib/utils';

const CURRENT_YEAR = new Date().getFullYear();

export default function CustomerLayout() {
  const { user, isAuthenticated, isCustomer, handleLogout } = useAuth();
  const { totalItems } = useCart();
  const { success } = useToast();
  const navigate = useNavigate();

  async function onLogout() {
    await handleLogout();
    success('Signed out', 'See you next time!');
    navigate('/login');
  }

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-charcoal">
      {/* ── Top Navigation ── */}
      <header className="sticky top-0 z-40 border-b border-neutralBorder bg-surface/90 backdrop-blur-md">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-terracotta-500 flex items-center justify-center text-white shadow-sm shadow-terracotta/20 group-hover:bg-terracotta-600 transition-colors">
              <Utensils className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-charcoal">
              FoodHub<span className="text-terracotta-500">.</span>
            </span>
          </Link>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-charcoal-secondary">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? 'text-terracotta-600 font-bold' : 'hover:text-charcoal transition-colors'
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/restaurants"
              className={({ isActive }) =>
                isActive ? 'text-terracotta-600 font-bold' : 'hover:text-charcoal transition-colors'
              }
            >
              Restaurants
            </NavLink>
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-3">
            {/* Cart Preview */}
            <Link
              to="/checkout"
              className="relative p-2 rounded-xl text-charcoal-secondary hover:text-charcoal hover:bg-surface-subtle transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-terracotta-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {/* Auth Buttons / Profile */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {isCustomer && (
                  <NavLink
                    to="/orders"
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors shadow-warm-xs',
                        isActive
                          ? 'bg-terracotta-50 border-terracotta-300 text-terracotta-700'
                          : 'bg-surface border-neutralBorder text-charcoal hover:border-terracotta-300'
                      )
                    }
                  >
                    <Clock className="w-3.5 h-3.5 text-terracotta-500" />
                    <span className="hidden sm:inline">My Orders</span>
                  </NavLink>
                )}

                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors shadow-warm-xs',
                      isActive
                        ? 'bg-terracotta-50 border-terracotta-300 text-terracotta-700'
                        : 'bg-surface border-neutralBorder text-charcoal hover:border-terracotta-300'
                    )
                  }
                >
                  <User className="w-3.5 h-3.5 text-terracotta-500" />
                  <span className="max-w-[120px] truncate">{user?.name?.split(' ')[0]}</span>
                </NavLink>

                <button
                  type="button"
                  onClick={onLogout}
                  className="p-2 text-charcoal-muted hover:text-culinary-nonveg rounded-xl hover:bg-culinary-nonvegBg transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-charcoal-secondary hover:text-charcoal px-3 py-2 rounded-xl transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-semibold bg-terracotta-500 hover:bg-terracotta-600 text-white px-4 py-2 rounded-xl shadow-sm shadow-terracotta/20 transition-all"
                >
                  Join
                </Link>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* ── Main View ── */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-neutralBorder bg-surface py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-muted">
          <div className="flex items-center gap-2">
            <span className="font-display text-sm font-bold text-charcoal">FoodHub</span>
            <span>• Artisanal Restaurant Platform</span>
          </div>
          <p>© {CURRENT_YEAR} FoodHub Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
