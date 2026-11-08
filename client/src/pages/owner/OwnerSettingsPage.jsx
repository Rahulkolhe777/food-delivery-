/**
 * OwnerSettingsPage — Restaurant profile settings, location, and operational controls.
 *
 * Backend endpoint:
 *   PATCH /api/restaurants/:id
 *   DELETE /api/restaurants/:id
 */

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Trash2, AlertTriangle } from 'lucide-react';

import { useOwnerRestaurant } from '@/context/OwnerRestaurantContext';
import { updateRestaurant, deleteRestaurant } from '@/services/restaurant.service';
import { useToast } from '@/context/ToastContext';
import { INDIAN_CITIES, CUISINE_TYPES } from '@/lib/utils';

import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

function RestaurantSettingsForm({ restaurant, onSave, isSaving }) {
  const coords = restaurant?.location?.coordinates || [77.4126, 23.2599];
  const [name, setName] = useState(restaurant?.name || '');
  const [city, setCity] = useState(restaurant?.city || 'Bhopal');
  const [area, setArea] = useState(restaurant?.area || '');
  const [cuisines, setCuisines] = useState(restaurant?.cuisines || []);
  const isOpen = restaurant?.isOpen ?? true;
  const [lng, setLng] = useState(String(coords[0]));
  const [lat, setLat] = useState(String(coords[1]));

  const handleToggleCuisine = (item) => {
    setCuisines((prev) =>
      prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name: name.trim(),
      city,
      area: area.trim(),
      cuisines,
      isOpen,
      lng: parseFloat(lng),
      lat: parseFloat(lat),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Card 1: Basic Identity */}
      <div className="bg-surface border border-neutralBorder rounded-3xl p-6 shadow-warm-xs space-y-4">
        <h2 className="font-display text-base font-bold text-charcoal border-b border-neutralBorder-light pb-3">
          Restaurant Profile
        </h2>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-charcoal">
              Restaurant Brand Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full h-10 px-3.5 bg-surface-subtle border border-neutralBorder rounded-xl text-xs text-charcoal focus:outline-none focus:border-terracotta-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-charcoal">
                Operating City
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-10 px-3.5 bg-surface-subtle border border-neutralBorder rounded-xl text-xs text-charcoal focus:outline-none focus:border-terracotta-400"
              >
                {INDIAN_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-charcoal">
                Neighborhood / Area
              </label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                required
                className="w-full h-10 px-3.5 bg-surface-subtle border border-neutralBorder rounded-xl text-xs text-charcoal focus:outline-none focus:border-terracotta-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Cuisines */}
      <div className="bg-surface border border-neutralBorder rounded-3xl p-6 shadow-warm-xs space-y-4">
        <h2 className="font-display text-base font-bold text-charcoal border-b border-neutralBorder-light pb-3">
          Culinary Specialties
        </h2>
        <div className="flex flex-wrap gap-2">
          {CUISINE_TYPES.filter((c) => c !== 'All').map((type) => {
            const isSelected = cuisines.includes(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleToggleCuisine(type)}
                className={`text-xs px-3.5 py-1.5 rounded-full border transition-all ${
                  isSelected
                    ? 'bg-terracotta-500 border-terracotta-500 text-white font-semibold'
                    : 'bg-surface border-neutralBorder text-charcoal-secondary hover:border-terracotta-300'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Card 3: Location Coordinates */}
      <div className="bg-surface border border-neutralBorder rounded-3xl p-6 shadow-warm-xs space-y-4">
        <h2 className="font-display text-base font-bold text-charcoal border-b border-neutralBorder-light pb-3">
          Coordinates (GeoJSON)
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-charcoal">Longitude</label>
            <input
              type="number"
              step="any"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              required
              className="w-full h-10 px-3.5 bg-surface-subtle border border-neutralBorder rounded-xl text-xs text-charcoal focus:outline-none focus:border-terracotta-400"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-charcoal">Latitude</label>
            <input
              type="number"
              step="any"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              required
              className="w-full h-10 px-3.5 bg-surface-subtle border border-neutralBorder rounded-xl text-xs text-charcoal focus:outline-none focus:border-terracotta-400"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          variant="primary"
          isLoading={isSaving}
          leftIcon={<Save size={16} />}
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
}

export default function OwnerSettingsPage() {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();
  const { selectedId, activeRestaurant, refetchActive } = useOwnerRestaurant();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // ── Mutation: Save Settings ─────────────────────────────────────────────────
  const saveMutation = useMutation({
    mutationFn: (payload) => updateRestaurant(selectedId, payload),
    onSuccess: () => {
      success('Settings Saved', 'Restaurant profile updated successfully.');
      queryClient.invalidateQueries({ queryKey: ['owner', 'restaurant', selectedId] });
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      refetchActive();
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Could not save restaurant settings.';
      toastError('Update Failed', msg);
    },
  });

  // ── Mutation: Delete Restaurant ─────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: () => deleteRestaurant(selectedId),
    onSuccess: () => {
      success('Restaurant Deleted', 'The restaurant has been permanently removed.');
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      window.location.href = '/owner';
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Could not delete restaurant.';
      toastError('Delete Failed', msg);
    },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-neutralBorder pb-4">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-charcoal">
          Location Settings
        </h1>
        <p className="text-xs text-charcoal-secondary mt-1">
          Update business identity, delivery coordinates, and cuisines for{' '}
          <strong className="text-charcoal font-semibold">{activeRestaurant?.name}</strong>.
        </p>
      </div>

      <RestaurantSettingsForm
        key={activeRestaurant?._id || selectedId}
        restaurant={activeRestaurant}
        onSave={(data) => saveMutation.mutate(data)}
        isSaving={saveMutation.isLoading}
      />

      {/* Danger Zone: Deletion */}
      <div className="bg-red-50/50 border border-red-200 rounded-3xl p-6 shadow-warm-xs space-y-4">
        <div className="flex items-center gap-2 text-red-800">
          <AlertTriangle size={18} />
          <h2 className="font-display text-base font-bold">Danger Zone</h2>
        </div>
        <p className="text-xs text-red-700 leading-relaxed">
          Permanently delete this restaurant location, associated menu items, and dining records.
          This operation is irreversible.
        </p>
        <div className="pt-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsDeleteOpen(true)}
            leftIcon={<Trash2 size={16} />}
          >
            Delete Restaurant Permanently
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => deleteMutation.mutate()}
        title="Delete Restaurant Permanently?"
        description={`Are you completely sure you want to delete "${activeRestaurant?.name}"? All associated menu items and operational records will be deleted.`}
        confirmText="Yes, Permanently Delete"
        isDestructive
      />
    </div>
  );
}
