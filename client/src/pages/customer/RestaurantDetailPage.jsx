/**
 * RestaurantDetailPage — Decomposed orchestrator page.
 * Uses:
 *  - features/restaurants: RestaurantHero, RestaurantMenuNav, getRestaurantById
 *  - features/menu: MenuSection, getMenu
 *  - features/cart: CartDrawer, MobileCartBar, useRestaurantCartSync
 *  - features/reviews: RestaurantReviewsTab, getRestaurantReviews
 */

import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Utensils } from 'lucide-react';

import { getRestaurantById } from '@/features/restaurants';
import { getMenu } from '@/features/menu';
import { getRestaurantReviews } from '@/features/reviews';
import { useRestaurantCartSync } from '@/features/cart/hooks/useRestaurantCartSync';
import { queryKeys } from '@/lib/queryKeys';
import {
  Button,
  EmptyState,
  ErrorState,
  ConfirmDialog,
} from '@/components/ui';
import { FoodCardSkeleton } from '@/components/ui/Skeleton';

// Feature Components
import RestaurantHero from '@/features/restaurants/components/RestaurantHero';
import RestaurantMenuNav from '@/features/restaurants/components/RestaurantMenuNav';
import MenuSection from '@/features/menu/components/MenuSection';
import RestaurantReviewsTab from '@/features/reviews/components/RestaurantReviewsTab';
import CartDrawer from '@/features/cart/components/CartDrawer';
import MobileCartBar from '@/features/cart/components/MobileCartBar';

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Tab & Filters state
  const [activeTab, setActiveTab] = useState('menu');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [menuSearchQuery, setMenuSearchQuery] = useState('');
  const [reviewsPage, setReviewsPage] = useState(1);

  // 1. Fetch Restaurant Profile
  const {
    data: restaurantData,
    isLoading: isLoadingRestaurant,
    isError: isErrorRestaurant,
    refetch: refetchRestaurant,
  } = useQuery({
    queryKey: queryKeys.restaurants.detail(id),
    queryFn: () => getRestaurantById(id),
    enabled: Boolean(id),
  });
  const restaurant = restaurantData?.restaurant;

  // Cart Context & Sync Hook
  const {
    items,
    isCurrentRestaurantCart,
    cartRestaurantName,
    totalAmount,
    totalItems,
    getItemQuantity,
    handleIncrease,
    handleDecrease,
    updateQuantity,
    clearCart,
    pendingItem,
    confirmReplace,
    cancelReplace,
  } = useRestaurantCartSync(restaurant);

  // 2. Fetch Menu
  const {
    data: menuData,
    isLoading: isLoadingMenu,
    isError: isErrorMenu,
    refetch: refetchMenu,
  } = useQuery({
    queryKey: queryKeys.menu.all(id, { isVeg: isVegOnly ? true : undefined }),
    queryFn: () => getMenu(id, { isVeg: isVegOnly ? true : undefined }),
    enabled: Boolean(id),
  });
  const rawMenuItems = menuData?.menuItems ?? [];

  // 3. Fetch Reviews
  const {
    data: reviewsData,
    isLoading: isLoadingReviews,
  } = useQuery({
    queryKey: queryKeys.reviews.restaurant(id, { page: reviewsPage, limit: 10 }),
    queryFn: () => getRestaurantReviews(id, { page: reviewsPage, limit: 10 }),
    enabled: Boolean(id),
  });
  const reviews = reviewsData?.reviews ?? [];
  const reviewsTotal = reviewsData?.total ?? 0;
  const reviewsTotalPages = reviewsData?.totalPages ?? 1;

  // Average Rating
  const averageRating = useMemo(() => {
    const list = reviewsData?.reviews;
    if (!list || list.length === 0) return '4.5';
    const sum = list.reduce((acc, r) => acc + (r.rating || 0), 0);
    return (sum / list.length).toFixed(1);
  }, [reviewsData?.reviews]);

  // Extract Categories
  const categories = useMemo(() => {
    const set = new Set();
    const list = menuData?.menuItems ?? [];
    list.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return ['All', ...Array.from(set).sort()];
  }, [menuData?.menuItems]);

  // Filtered menu items
  const filteredMenuItems = useMemo(() => {
    const list = menuData?.menuItems ?? [];
    return list.filter((item) => {
      const matchCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchQuery =
        !menuSearchQuery.trim() ||
        item.name.toLowerCase().includes(menuSearchQuery.trim().toLowerCase());
      return matchCategory && matchQuery;
    });
  }, [menuData?.menuItems, selectedCategory, menuSearchQuery]);

  // Group items by category
  const groupedMenuItems = useMemo(() => {
    const groups = {};
    filteredMenuItems.forEach((item) => {
      const cat = item.category || 'Other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return groups;
  }, [filteredMenuItems]);

  if (isLoadingRestaurant) {
    return (
      <div className="min-h-screen bg-canvas py-10 px-4 sm:px-6 max-w-7xl mx-auto space-y-6">
        <div className="h-6 w-32 bg-surface-muted/60 animate-pulse rounded-md" />
        <div className="h-72 w-full bg-surface-muted/60 animate-pulse rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="md:col-span-2 space-y-4">
            <div className="h-10 w-48 bg-surface-muted/60 animate-pulse rounded-xl" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <FoodCardSkeleton key={i} />
              ))}
            </div>
          </div>
          <div className="hidden md:block">
            <div className="h-96 w-full bg-surface-muted/60 animate-pulse rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isErrorRestaurant || !restaurant) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
        <ErrorState
          title="Restaurant not found"
          message="We couldn't retrieve this dining location. It may have been closed or relocated."
          onRetry={refetchRestaurant}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas pb-24 md:pb-16">
      {/* ── Atmospheric Hero Header ── */}
      <RestaurantHero
        restaurant={restaurant}
        averageRating={averageRating}
        reviewsTotal={reviewsTotal}
      />

      {/* ── Navigation Strip (Menu vs Reviews) ── */}
      <RestaurantMenuNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        reviewsTotal={reviewsTotal}
        isVegOnly={isVegOnly}
        setIsVegOnly={setIsVegOnly}
        menuSearchQuery={menuSearchQuery}
        setMenuSearchQuery={setMenuSearchQuery}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        rawMenuItems={rawMenuItems}
      />

      {/* ── Main Content Grid ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-8">
            {activeTab === 'menu' && (
              <>
                {isLoadingMenu && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <FoodCardSkeleton key={i} />
                    ))}
                  </div>
                )}

                {isErrorMenu && !isLoadingMenu && (
                  <ErrorState
                    title="Could not load menu"
                    message="We couldn't retrieve the dishes for this restaurant. Please try again."
                    onRetry={refetchMenu}
                  />
                )}

                {!isLoadingMenu && !isErrorMenu && filteredMenuItems.length === 0 && (
                  <EmptyState
                    icon={Utensils}
                    title="No dishes found"
                    description={
                      isVegOnly
                        ? 'No vegetarian dishes match your search or filter.'
                        : 'No dishes found in this category or search query.'
                    }
                    action={
                      isVegOnly || menuSearchQuery || selectedCategory !== 'All' ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setIsVegOnly(false);
                            setMenuSearchQuery('');
                            setSelectedCategory('All');
                          }}
                        >
                          Clear Filters
                        </Button>
                      ) : undefined
                    }
                  />
                )}

                {!isLoadingMenu &&
                  !isErrorMenu &&
                  Object.entries(groupedMenuItems).map(([catName, dishList]) => (
                    <MenuSection
                      key={catName}
                      categoryName={catName}
                      dishes={dishList}
                      getItemQuantity={getItemQuantity}
                      onAdd={handleIncrease}
                      onRemove={handleDecrease}
                      isOpen={restaurant.isOpen}
                    />
                  ))}
              </>
            )}

            {activeTab === 'reviews' && (
              <RestaurantReviewsTab
                reviews={reviews}
                isLoading={isLoadingReviews}
                page={reviewsPage}
                totalPages={reviewsTotalPages}
                onPageChange={setReviewsPage}
              />
            )}
          </div>

          {/* Right Column: Sticky Cart Drawer */}
          <CartDrawer
            restaurant={restaurant}
            cartItems={items}
            totalAmount={totalAmount}
            totalItems={totalItems}
            isCurrentRestaurantCart={isCurrentRestaurantCart}
            cartRestaurantName={cartRestaurantName}
            onUpdateQuantity={updateQuantity}
            onClearCart={clearCart}
            onStartNewBasket={() => clearCart()}
          />
        </div>
      </main>

      {/* ── Mobile Floating Cart Bar & Modal ── */}
      <MobileCartBar
        items={items}
        totalAmount={totalAmount}
        totalItems={totalItems}
        isCurrentRestaurantCart={isCurrentRestaurantCart}
        restaurantIsOpen={restaurant.isOpen}
        onCheckout={() => navigate('/checkout')}
      />

      {/* ── Cross-Restaurant Conflict Dialog ── */}
      <ConfirmDialog
        isOpen={Boolean(pendingItem)}
        onClose={cancelReplace}
        onConfirm={confirmReplace}
        title="Replace basket items?"
        description={`Your basket already contains items from "${cartRestaurantName}". Starting an order from "${restaurant?.name}" will clear those items. Would you like to proceed?`}
        confirmText="Start Fresh Basket"
        cancelText="Keep Existing"
        isDestructive
      />
    </div>
  );
}
