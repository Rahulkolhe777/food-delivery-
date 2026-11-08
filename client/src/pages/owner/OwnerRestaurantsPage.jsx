/**
 * OwnerRestaurantsPage — Restaurant location portfolio manager.
 * Decomposed using:
 *  - features/restaurants: RestaurantManagementCard, RestaurantFormDialog, createRestaurant, updateRestaurant, deleteRestaurant
 */

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Store, Plus, MapPin } from 'lucide-react';

import { useOwnerRestaurant } from '@/context/OwnerRestaurantContext';
import { useToast } from '@/context/ToastContext';
import {
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from '@/features/restaurants';

// UI & Decomposed Feature Components
import {
  Button,
  Badge,
  Dialog,
  ConfirmDialog,
  EmptyState,
} from '@/components/ui';
import RestaurantManagementCard from '@/features/restaurants/components/RestaurantManagementCard';
import RestaurantFormDialog from '@/features/restaurants/components/RestaurantFormDialog';

export default function OwnerRestaurantsPage() {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();

  const {
    restaurants,
    selectedId,
    setSelectedId,
    addRestaurantToList,
    updateRestaurantInList,
    removeRestaurantFromList,
    refetchActive,
  } = useOwnerRestaurant();

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTarget, setEditingTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [detailsTarget, setDetailsTarget] = useState(null);

  // Mutations
  const createMutation = useMutation({
    mutationFn: createRestaurant,
    onSuccess: (data) => {
      success('Restaurant Created!', `"${data.restaurant.name}" is now registered.`);
      addRestaurantToList(data.restaurant);
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      setIsFormOpen(false);
    },
    onError: (err) => {
      toastError('Creation Failed', err.response?.data?.message || 'Could not register restaurant.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateRestaurant(id, payload),
    onSuccess: (data) => {
      success('Restaurant Updated', `"${data.restaurant.name}" updated successfully.`);
      updateRestaurantInList(data.restaurant);
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      setIsFormOpen(false);
      setEditingTarget(null);
    },
    onError: (err) => {
      toastError('Update Failed', err.response?.data?.message || 'Could not update restaurant.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRestaurant,
    onSuccess: () => {
      success('Restaurant Deleted', `Location was successfully removed.`);
      if (deleteTarget) removeRestaurantFromList(deleteTarget._id);
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      setDeleteTarget(null);
      refetchActive();
    },
    onError: (err) => {
      toastError('Deletion Failed', err.response?.data?.message || 'Could not delete restaurant.');
    },
  });

  const quickToggleMutation = useMutation({
    mutationFn: ({ id, currentStatus }) => updateRestaurant(id, { isOpen: !currentStatus }),
    onSuccess: (data, variables) => {
      const newStatus = !variables.currentStatus;
      success('Status Updated', `Kitchen is now ${newStatus ? 'OPEN for orders' : 'CLOSED / PAUSED'}.`);
      updateRestaurantInList(data.restaurant);
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    },
    onError: (err) => {
      toastError('Error', err.response?.data?.message || 'Failed to update status.');
    },
  });

  const handleFormSubmit = (values) => {
    if (editingTarget) {
      updateMutation.mutate({ id: editingTarget._id, payload: values });
    } else {
      createMutation.mutate(values);
    }
  };

  const openCount = restaurants.filter((r) => r.isOpen !== false).length;
  const closedCount = restaurants.length - openCount;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutralBorder pb-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-charcoal">
            My Restaurant Locations
          </h1>
          <p className="text-xs text-charcoal-secondary mt-1">
            Manage your culinary portfolio, launch new locations, and control real-time ordering.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setEditingTarget(null);
            setIsFormOpen(true);
          }}
          leftIcon={<Plus size={16} />}
        >
          Register New Location
        </Button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface border border-neutralBorder rounded-3xl p-4 shadow-warm-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-terracotta-50 text-terracotta-600 flex items-center justify-center shrink-0">
            <Store size={20} />
          </div>
          <div>
            <span className="text-xs text-charcoal-muted uppercase font-bold tracking-wider block">
              Total Locations
            </span>
            <span className="font-display text-xl font-bold text-charcoal">
              {restaurants.length} Registered
            </span>
          </div>
        </div>

        <div className="bg-surface border border-neutralBorder rounded-3xl p-4 shadow-warm-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div>
            <span className="text-xs text-charcoal-muted uppercase font-bold tracking-wider block">
              Open For Orders
            </span>
            <span className="font-display text-xl font-bold text-emerald-700">
              {openCount} Kitchens Live
            </span>
          </div>
        </div>

        <div className="bg-surface border border-neutralBorder rounded-3xl p-4 shadow-warm-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-surface-subtle text-charcoal-muted flex items-center justify-center shrink-0">
            <span className="w-3 h-3 rounded-full bg-charcoal-subtle" />
          </div>
          <div>
            <span className="text-xs text-charcoal-muted uppercase font-bold tracking-wider block">
              Paused / Closed
            </span>
            <span className="font-display text-xl font-bold text-charcoal-secondary">
              {closedCount} Kitchens
            </span>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {restaurants.length === 0 && (
        <EmptyState
          icon={Store}
          title="No restaurants registered yet"
          description="Register your first restaurant to start managing menus and accepting orders."
          action={
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setEditingTarget(null);
                setIsFormOpen(true);
              }}
              leftIcon={<Plus size={16} />}
            >
              Add First Location
            </Button>
          }
        />
      )}

      {/* Grid of Restaurant Management Cards */}
      {restaurants.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {restaurants.map((restaurant) => (
            <RestaurantManagementCard
              key={restaurant._id}
              restaurant={restaurant}
              isSelected={restaurant._id === selectedId}
              onSelect={setSelectedId}
              onOpenEdit={(r) => {
                setEditingTarget(r);
                setIsFormOpen(true);
              }}
              onOpenDelete={setDeleteTarget}
              onOpenDetails={setDetailsTarget}
              onToggleStatus={(id, currentStatus) =>
                quickToggleMutation.mutate({ id, currentStatus })
              }
              isToggling={quickToggleMutation.isLoading}
            />
          ))}
        </div>
      )}

      {/* Unified Create / Edit Form Dialog */}
      <RestaurantFormDialog
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTarget(null);
        }}
        initialData={editingTarget}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isLoading || updateMutation.isLoading}
      />

      {/* View Location Details Dialog */}
      <Dialog
        isOpen={Boolean(detailsTarget)}
        onClose={() => setDetailsTarget(null)}
        title="Restaurant Location Details"
        size="md"
      >
        {detailsTarget && (
          <div className="space-y-4 pt-1">
            <div className="p-4 bg-surface-subtle border border-neutralBorder-light rounded-2xl space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-bold text-charcoal">
                    {detailsTarget.name}
                  </h3>
                  <p className="text-xs text-charcoal-muted flex items-center gap-1 mt-0.5">
                    <MapPin size={12} className="text-terracotta-500" />
                    <span>{[detailsTarget.area, detailsTarget.city].filter(Boolean).join(', ')}</span>
                  </p>
                </div>
                <Badge variant={detailsTarget.isOpen !== false ? 'veg' : 'default'} size="md">
                  {detailsTarget.isOpen !== false ? 'Open Now' : 'Closed'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutralBorder-light text-xs text-charcoal-secondary">
                <div>
                  <span className="text-[10px] text-charcoal-muted uppercase block font-bold">
                    Location ID
                  </span>
                  <span className="font-mono text-charcoal">#{detailsTarget._id}</span>
                </div>
                <div>
                  <span className="text-[10px] text-charcoal-muted uppercase block font-bold">
                    Geo Coordinates
                  </span>
                  <span className="font-mono text-charcoal">
                    {detailsTarget.location?.coordinates?.[0] || 77.4126},{' '}
                    {detailsTarget.location?.coordinates?.[1] || 23.2599}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-charcoal uppercase tracking-wider block mb-2">
                Specialized Cuisines
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(detailsTarget.cuisines || []).map((c) => (
                  <Badge key={c} variant="terracotta" size="sm">
                    {c}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget._id)}
        title="Permanently Delete Restaurant Location"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? Deleting this restaurant location cascades and permanently removes all its associated menu items.`}
        confirmText="Yes, Delete Restaurant"
        isDestructive
      />
    </div>
  );
}
