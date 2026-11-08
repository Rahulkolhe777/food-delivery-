/**
 * OwnerMenuPage — Restaurant menu management dashboard.
 * Decomposed using:
 *  - features/menu: MenuKpiBar, OwnerMenuFilterBar, OwnerMenuTable, OwnerMenuGrid, DishFormDialog, useMenuMutations
 */

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, RefreshCcw } from 'lucide-react';

import { useOwnerRestaurant } from '@/context/OwnerRestaurantContext';
import { getMenu } from '@/features/menu';
import { useMenuMutations } from '@/features/menu/hooks/useMenuMutations';
import { queryKeys } from '@/lib/queryKeys';

// UI & Decomposed Components
import {
  Button,
  Pagination,
  EmptyState,
  ErrorState,
  ConfirmDialog,
  Skeleton,
} from '@/components/ui';
import MenuKpiBar from '@/features/menu/components/MenuKpiBar';
import OwnerMenuFilterBar from '@/features/menu/components/OwnerMenuFilterBar';
import OwnerMenuTable from '@/features/menu/components/OwnerMenuTable';
import OwnerMenuGrid from '@/features/menu/components/OwnerMenuGrid';
import DishFormDialog from '@/features/menu/components/DishFormDialog';

export default function OwnerMenuPage() {
  const { activeRestaurant, selectedId } = useOwnerRestaurant();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dietaryFilter, setDietaryFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Dialog states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTargetItem, setDeleteTargetItem] = useState(null);

  // Query: Menu Items
  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: queryKeys.menu.all(selectedId),
    queryFn: () => getMenu(selectedId),
    enabled: Boolean(selectedId),
  });

  const dishes = data?.menuItems || [];

  // Custom hook for mutations
  const {
    createMutation,
    updateMutation,
    deleteMutation,
    toggleStockMutation,
  } = useMenuMutations(selectedId, {
    onSuccessCreate: () => setIsFormModalOpen(false),
    onSuccessUpdate: () => {
      setIsFormModalOpen(false);
      setEditingItem(null);
    },
    onSuccessDelete: () => setDeleteTargetItem(null),
  });

  // Categories
  const categories = useMemo(() => {
    const set = new Set();
    const list = data?.menuItems ?? [];
    list.forEach((d) => {
      if (d.category) set.add(d.category);
    });
    return ['All', ...Array.from(set).sort()];
  }, [data?.menuItems]);

  // Client-side filtering & search
  const filteredDishes = useMemo(() => {
    const list = data?.menuItems ?? [];
    return list.filter((dish) => {
      if (selectedCategory !== 'All' && dish.category !== selectedCategory) return false;
      if (dietaryFilter === 'veg' && !dish.isVeg) return false;
      if (dietaryFilter === 'nonveg' && dish.isVeg) return false;
      if (availabilityFilter === 'instock' && !dish.isAvailable) return false;
      if (availabilityFilter === 'soldout' && dish.isAvailable) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = dish.name?.toLowerCase().includes(q);
        const matchesCat = dish.category?.toLowerCase().includes(q);
        if (!matchesName && !matchesCat) return false;
      }
      return true;
    });
  }, [data?.menuItems, selectedCategory, dietaryFilter, availabilityFilter, searchQuery]);

  // Pagination
  const totalFiltered = filteredDishes.length;
  const totalPages = Math.ceil(totalFiltered / pageSize) || 1;
  const paginatedDishes = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredDishes.slice(start, start + pageSize);
  }, [filteredDishes, page, pageSize]);

  // Form Submit Handler
  const handleFormSubmit = (values) => {
    if (editingItem) {
      updateMutation.mutate({ itemId: editingItem._id, payload: values });
    } else {
      createMutation.mutate(values);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutralBorder pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
              Restaurant Menu Catalog
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-terracotta-50 text-terracotta-700 border border-terracotta-200">
              Kitchen Catalog
            </span>
          </div>
          <p className="text-xs text-charcoal-secondary mt-1">
            Manage live dishes, prices, culinary categories, and dietary tags for{' '}
            <strong className="text-charcoal font-semibold">{activeRestaurant?.name}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            leftIcon={<RefreshCcw size={14} className={isFetching ? 'animate-spin' : ''} />}
          >
            Refresh Menu
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setEditingItem(null);
              setIsFormModalOpen(true);
            }}
            leftIcon={<Plus size={16} />}
          >
            Add New Dish
          </Button>
        </div>
      </div>

      {/* KPI Bar */}
      <MenuKpiBar
        totalItems={dishes.length}
        inStockCount={dishes.filter((d) => d.isAvailable).length}
        vegCount={dishes.filter((d) => d.isVeg).length}
        nonVegCount={dishes.filter((d) => !d.isVeg).length}
      />

      {/* Category Pills & Filters */}
      <OwnerMenuFilterBar
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        dishes={dishes}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        dietaryFilter={dietaryFilter}
        setDietaryFilter={setDietaryFilter}
        availabilityFilter={availabilityFilter}
        setAvailabilityFilter={setAvailabilityFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onResetPage={() => setPage(1)}
      />

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      )}

      {/* Error State */}
      {isError && !isLoading && (
        <ErrorState
          title="Unable to load menu"
          message="Could not retrieve dishes for this restaurant location from the backend API."
          onRetry={refetch}
        />
      )}

      {/* Empty State */}
      {!isLoading && !isError && paginatedDishes.length === 0 && (
        <EmptyState
          title={searchQuery || selectedCategory !== 'All' ? 'No matching dishes' : 'Your menu is empty'}
          description={
            searchQuery || selectedCategory !== 'All'
              ? 'Try relaxing your search terms or clearing active filters.'
              : 'Start building your culinary catalog by adding signature dishes.'
          }
          action={
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setEditingItem(null);
                setIsFormModalOpen(true);
              }}
              leftIcon={<Plus size={16} />}
            >
              Add First Dish
            </Button>
          }
        />
      )}

      {/* Table View */}
      {!isLoading && !isError && paginatedDishes.length > 0 && viewMode === 'table' && (
        <OwnerMenuTable
          dishes={paginatedDishes}
          onEditDish={(dish) => {
            setEditingItem(dish);
            setIsFormModalOpen(true);
          }}
          onDeleteDish={setDeleteTargetItem}
          onToggleStock={(id, isAvail) => toggleStockMutation.mutate({ itemId: id, isAvailable: isAvail })}
          isToggling={toggleStockMutation.isLoading}
        />
      )}

      {/* Grid View */}
      {!isLoading && !isError && paginatedDishes.length > 0 && viewMode === 'grid' && (
        <OwnerMenuGrid
          dishes={paginatedDishes}
          onEditDish={(dish) => {
            setEditingItem(dish);
            setIsFormModalOpen(true);
          }}
          onDeleteDish={setDeleteTargetItem}
          onToggleStock={(id, isAvail) => toggleStockMutation.mutate({ itemId: id, isAvailable: isAvail })}
          isToggling={toggleStockMutation.isLoading}
        />
      )}

      {/* Pagination */}
      {!isLoading && !isError && paginatedDishes.length > 0 && totalPages > 1 && (
        <div className="p-3.5 border border-neutralBorder rounded-xl bg-surface flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-charcoal-secondary">
          <span>
            Showing <strong className="text-charcoal font-semibold">{paginatedDishes.length}</strong> of{' '}
            <strong className="text-charcoal font-semibold">{totalFiltered}</strong> filtered dishes
          </span>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      {/* Dish Form Dialog */}
      <DishFormDialog
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingItem(null);
        }}
        initialData={editingItem}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isLoading || updateMutation.isLoading}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetItem)}
        onClose={() => setDeleteTargetItem(null)}
        onConfirm={() => deleteTargetItem && deleteMutation.mutate(deleteTargetItem._id)}
        title="Delete Menu Item"
        description={`Are you sure you want to remove "${deleteTargetItem?.name}" from your restaurant menu? This action cannot be undone.`}
        confirmText="Yes, Delete Dish"
        isDestructive
      />
    </div>
  );
}
