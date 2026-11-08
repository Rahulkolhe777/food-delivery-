import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PageLoader from '@/components/common/PageLoader';

// Layouts & Route Guards
import CustomerLayout from '@/layouts/CustomerLayout';
import OwnerLayout from '@/layouts/OwnerLayout';
import ProtectedRoute from '@/components/routing/ProtectedRoute';
import GuestRoute from '@/components/routing/GuestRoute';

// Route-level code splitting via React.lazy
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const CustomerHome = lazy(() => import('@/pages/customer/CustomerHome'));
const RestaurantsPage = lazy(() => import('@/pages/customer/RestaurantsPage'));
const RestaurantDetailPage = lazy(() => import('@/pages/customer/RestaurantDetailPage'));
const CheckoutPage = lazy(() => import('@/pages/customer/CheckoutPage'));
const CustomerOrdersPage = lazy(() => import('@/pages/customer/CustomerOrdersPage'));
const CustomerProfilePage = lazy(() => import('@/pages/customer/CustomerProfilePage'));

const OwnerDashboard = lazy(() => import('@/pages/owner/OwnerDashboard'));
const OwnerRestaurantsPage = lazy(() => import('@/pages/owner/OwnerRestaurantsPage'));
const OwnerMenuPage = lazy(() => import('@/pages/owner/OwnerMenuPage'));
const OwnerOrdersPage = lazy(() => import('@/pages/owner/OwnerOrdersPage'));
const OwnerReviewsPage = lazy(() => import('@/pages/owner/OwnerReviewsPage'));
const OwnerAnalyticsPage = lazy(() => import('@/pages/owner/OwnerAnalyticsPage'));
const OwnerSettingsPage = lazy(() => import('@/pages/owner/OwnerSettingsPage'));

export default function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ── Guest Only Authentication Routes ── */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />

        {/* ── Customer Experience (Default Portal) ── */}
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<CustomerHome />} />
          <Route path="restaurants" element={<RestaurantsPage />} />
          <Route path="restaurants/:id" element={<RestaurantDetailPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route
            path="orders"
            element={
              <ProtectedRoute requiredRole="customer">
                <CustomerOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute requiredRole="customer">
                <CustomerProfilePage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ── Restaurant Owner Portal (Protected) ── */}
        <Route
          path="/owner"
          element={
            <ProtectedRoute requiredRole="owner">
              <OwnerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<OwnerDashboard />} />
          <Route path="restaurants" element={<OwnerRestaurantsPage />} />
          <Route path="menu" element={<OwnerMenuPage />} />
          <Route path="orders" element={<OwnerOrdersPage />} />
          <Route path="reviews" element={<OwnerReviewsPage />} />
          <Route path="analytics" element={<OwnerAnalyticsPage />} />
          <Route path="settings" element={<OwnerSettingsPage />} />
        </Route>

        {/* ── Wildcard Redirect ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

