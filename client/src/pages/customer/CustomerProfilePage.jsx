/**
 * CustomerProfilePage — Customer Profile & Account Management.
 * Displays authenticated user information, dining statistics, and account actions.
 * Integrates directly with:
 *  - GET /api/auth/me (real user identity & account metadata)
 *  - GET /api/orders/my (real order metrics and summary spend)
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  User,
  Mail,
  MapPin,
  Calendar,
  ShoppingBag,
  CheckCircle2,
  Clock,
  LogOut,
  ShieldCheck,
  ChevronRight,
  Receipt,
  UtensilsCrossed,
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getMe } from '@/services/auth.service';
import { getMyOrders } from '@/features/orders';
import { queryKeys } from '@/lib/queryKeys';
import { formatCurrency, formatDate, timeAgo, cn } from '@/lib/utils';
import { Button, Badge, Skeleton, ErrorState } from '@/components/ui';

export default function CustomerProfilePage() {
  const navigate = useNavigate();
  const { user: localUser, handleLogout } = useAuth();
  const { success } = useToast();

  // 1. Fetch live user data from GET /api/auth/me
  const {
    data: meData,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    refetch: refetchUser,
  } = useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: getMe,
    staleTime: 30_000,
  });

  // 2. Fetch customer's real orders for statistics
  const {
    data: ordersData,
    isLoading: isLoadingOrders,
  } = useQuery({
    queryKey: queryKeys.orders.my({ limit: 100 }),
    queryFn: () => getMyOrders({ limit: 100 }),
    staleTime: 60_000,
  });

  const currentUser = meData?.user || localUser;
  const orders = ordersData?.orders ?? [];
  const totalOrdersCount = ordersData?.total ?? orders.length;

  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;
  const activeCount = orders.filter(
    (o) => o.status === 'placed' || o.status === 'preparing'
  ).length;

  const totalSpent = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const recentOrders = orders.slice(0, 3);

  const onSignOut = async () => {
    await handleLogout();
    success('Signed out', 'You have been safely signed out.');
    navigate('/login');
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-canvas py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-44 w-full rounded-3xl" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
          </div>
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isErrorUser && !currentUser) {
    return (
      <div className="min-h-screen bg-canvas py-16 px-4 sm:px-6">
        <div className="max-w-md mx-auto">
          <ErrorState
            title="Profile Unavailable"
            message="We could not retrieve your account information at this moment."
            onRetry={refetchUser}
          />
        </div>
      </div>
    );
  }

  const initials = (currentUser?.name || 'Customer')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

  return (
    <div className="min-h-screen bg-canvas py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* ── Breadcrumb & Page Title ── */}
        <div>
          <div className="flex items-center gap-2 text-xs text-charcoal-muted mb-2">
            <Link to="/" className="hover:text-terracotta-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-charcoal font-semibold">Customer Profile</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-charcoal tracking-tight">
            My Account & Dining Profile
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-secondary mt-1">
            Manage your FoodHub customer profile, dining metrics, and account credentials.
          </p>
        </div>

        {/* ── Profile Identity Hero Card ── */}
        <section className="bg-surface rounded-3xl border border-neutralBorder p-6 sm:p-8 shadow-warm-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-terracotta-50/50 rounded-full blur-3xl -z-0 pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* Initials Avatar */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-terracotta-500 to-terracotta-700 text-white flex items-center justify-center font-display text-2xl font-bold shadow-warm-md shrink-0">
                {initials}
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="font-display text-2xl font-bold text-charcoal tracking-tight">
                    {currentUser?.name || 'Customer'}
                  </h2>
                  <Badge variant="terracotta" size="sm" className="font-semibold uppercase tracking-wider text-[10px]">
                    {currentUser?.role === 'customer' ? 'FoodHub Diner' : currentUser?.role}
                  </Badge>
                </div>

                <p className="text-xs text-charcoal-muted flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-charcoal-muted" />
                  <span>{currentUser?.email}</span>
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-charcoal-secondary pt-1">
                  {currentUser?.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-terracotta-500" />
                      <span>{currentUser.city}</span>
                    </span>
                  )}
                  {currentUser?.createdAt && (
                    <span className="flex items-center gap-1 text-charcoal-muted">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Member since {formatDate(currentUser.createdAt, { month: 'long', year: 'numeric' })}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Sign Out Button */}
            <div className="shrink-0 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={onSignOut}
                leftIcon={<LogOut className="w-3.5 h-3.5" />}
                className="w-full sm:w-auto text-culinary-nonveg border-culinary-nonveg/30 hover:bg-culinary-nonvegBg hover:border-culinary-nonveg transition-colors"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </section>

        {/* ── Real Customer Metrics Strip ── */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Total Orders */}
          <div className="bg-surface rounded-2xl border border-neutralBorder p-5 shadow-warm-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-terracotta-50 text-terracotta-600 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-charcoal-muted uppercase tracking-wider block">
                Total Orders Placed
              </span>
              <span className="font-display text-2xl font-bold text-charcoal">
                {isLoadingOrders ? '...' : totalOrdersCount}
              </span>
            </div>
          </div>

          {/* Card 2: Completed Deliveries */}
          <div className="bg-surface rounded-2xl border border-neutralBorder p-5 shadow-warm-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-culinary-vegBg text-culinary-veg flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-charcoal-muted uppercase tracking-wider block">
                Completed Deliveries
              </span>
              <span className="font-display text-2xl font-bold text-charcoal">
                {isLoadingOrders ? '...' : deliveredCount}
              </span>
              {activeCount > 0 && (
                <span className="text-[11px] text-amber-600 font-semibold block mt-0.5">
                  {activeCount} active now
                </span>
              )}
            </div>
          </div>

          {/* Card 3: Total Spent */}
          <div className="bg-surface rounded-2xl border border-neutralBorder p-5 shadow-warm-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-charcoal-muted uppercase tracking-wider block">
                Culinary Spend
              </span>
              <span className="font-display text-2xl font-bold text-charcoal tabular-nums">
                {isLoadingOrders ? '...' : formatCurrency(totalSpent)}
              </span>
            </div>
          </div>
        </section>

        {/* ── Account Details & Fast Navigation ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Account Details */}
          <section className="lg:col-span-7 bg-surface rounded-3xl border border-neutralBorder p-6 shadow-warm-xs space-y-6">
            <div className="border-b border-neutralBorder-light pb-3">
              <h3 className="font-display text-lg font-bold text-charcoal">
                Diner Profile Details
              </h3>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Verified account metadata retrieved directly from FoodHub security services.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-surface-subtle rounded-xl border border-neutralBorder-light space-y-1">
                <span className="text-[10px] uppercase font-bold text-charcoal-muted flex items-center gap-1">
                  <User className="w-3 h-3 text-terracotta-500" /> Full Name
                </span>
                <span className="font-semibold text-charcoal text-sm block">
                  {currentUser?.name}
                </span>
              </div>

              <div className="p-3.5 bg-surface-subtle rounded-xl border border-neutralBorder-light space-y-1">
                <span className="text-[10px] uppercase font-bold text-charcoal-muted flex items-center gap-1">
                  <Mail className="w-3 h-3 text-terracotta-500" /> Registered Email
                </span>
                <span className="font-semibold text-charcoal text-sm truncate block">
                  {currentUser?.email}
                </span>
              </div>

              <div className="p-3.5 bg-surface-subtle rounded-xl border border-neutralBorder-light space-y-1">
                <span className="text-[10px] uppercase font-bold text-charcoal-muted flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-terracotta-500" /> Primary Dining City
                </span>
                <span className="font-semibold text-charcoal text-sm block">
                  {currentUser?.city || 'Bhopal'}
                </span>
              </div>

              <div className="p-3.5 bg-surface-subtle rounded-xl border border-neutralBorder-light space-y-1">
                <span className="text-[10px] uppercase font-bold text-charcoal-muted flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-terracotta-500" /> Account Security
                </span>
                <span className="font-semibold text-charcoal text-sm block">
                  JWT HttpOnly Protected
                </span>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-xs text-charcoal-muted">
                Need to update your city or preferences? You can select any dining hub anytime directly from the restaurant directory.
              </p>
            </div>
          </section>

          {/* Right: Quick Action Hub */}
          <section className="lg:col-span-5 space-y-4">
            <div className="bg-surface rounded-3xl border border-neutralBorder p-6 shadow-warm-xs space-y-4">
              <h3 className="font-display text-base font-bold text-charcoal">
                Customer Portals
              </h3>

              <div className="space-y-3">
                <Link
                  to="/orders"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-subtle hover:bg-terracotta-50/60 border border-neutralBorder-light hover:border-terracotta-300 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-terracotta-100/70 text-terracotta-700 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-charcoal group-hover:text-terracotta-700 transition-colors">
                        My Order History
                      </h4>
                      <p className="text-[11px] text-charcoal-muted">
                        {totalOrdersCount} order{totalOrdersCount !== 1 ? 's' : ''} recorded
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-charcoal-muted group-hover:text-terracotta-600 transition-transform group-hover:translate-x-0.5" />
                </Link>

                <Link
                  to="/restaurants"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-subtle hover:bg-terracotta-50/60 border border-neutralBorder-light hover:border-terracotta-300 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-surface text-charcoal-secondary border border-neutralBorder flex items-center justify-center">
                      <UtensilsCrossed className="w-4 h-4 text-terracotta-500" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-charcoal group-hover:text-terracotta-700 transition-colors">
                        Explore Restaurants
                      </h4>
                      <p className="text-[11px] text-charcoal-muted">
                        Discover top dining establishments
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-charcoal-muted group-hover:text-terracotta-600 transition-transform group-hover:translate-x-0.5" />
                </Link>

                <Link
                  to="/checkout"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-subtle hover:bg-terracotta-50/60 border border-neutralBorder-light hover:border-terracotta-300 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-surface text-charcoal-secondary border border-neutralBorder flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4 text-terracotta-500" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-charcoal group-hover:text-terracotta-700 transition-colors">
                        Active Basket / Checkout
                      </h4>
                      <p className="text-[11px] text-charcoal-muted">
                        Review selected meal items
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-charcoal-muted group-hover:text-terracotta-600 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            {/* Recent Orders Snapshot if available */}
            {recentOrders.length > 0 && (
              <div className="bg-surface rounded-3xl border border-neutralBorder p-6 shadow-warm-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-display text-sm font-bold text-charcoal">
                    Recent Orders
                  </h4>
                  <Link to="/orders" className="text-xs font-semibold text-terracotta-600 hover:underline">
                    View all
                  </Link>
                </div>

                <div className="space-y-2.5">
                  {recentOrders.map((ord) => (
                    <div
                      key={ord._id}
                      className="p-3 bg-surface-subtle rounded-xl border border-neutralBorder-light flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-charcoal block truncate max-w-[170px]">
                          {ord.restaurant?.name || 'Restaurant'}
                        </span>
                        <span className="text-[10px] text-charcoal-muted">
                          {timeAgo(ord.createdAt)} • #{ord._id.slice(-6).toUpperCase()}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-charcoal tabular-nums block">
                          {formatCurrency(ord.totalAmount)}
                        </span>
                        <span
                          className={cn(
                            'text-[10px] font-semibold capitalize',
                            ord.status === 'delivered' ? 'text-culinary-veg' : 'text-amber-600'
                          )}
                        >
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
