/**
 * OwnerLayout — Restaurant-Owner SaaS Portal Layout.
 *
 * Provides:
 *  - Collapsible desktop sidebar with responsive mobile drawer.
 *  - Top bar featuring active restaurant selector and live Open/Closed kitchen toggle.
 *  - Context provider wrapping all owner views.
 */

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { OwnerRestaurantProvider } from '@/context/OwnerRestaurantContext';
import OwnerHeader from './components/OwnerHeader';
import OwnerSidebar from './components/OwnerSidebar';

function OwnerLayoutContent() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-canvas text-charcoal">
      <OwnerSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* ── Main View Content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        <OwnerHeader onOpenMobile={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function OwnerLayout() {
  return (
    <OwnerRestaurantProvider>
      <OwnerLayoutContent />
    </OwnerRestaurantProvider>
  );
}
