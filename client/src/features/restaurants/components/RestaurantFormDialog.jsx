import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { INDIAN_CITIES, CUISINE_TYPES } from '@/lib/utils';
import { restaurantFormSchema } from '../validation/restaurant.schema';

const CITY_COORDINATES = {
  Bhopal: [77.4126, 23.2599],
  Indore: [75.8577, 22.7196],
  Delhi: [77.209, 28.6139],
  Mumbai: [72.8777, 19.076],
  Bengaluru: [77.5946, 12.9716],
  Pune: [73.8567, 18.5204],
  Hyderabad: [78.4867, 17.385],
  Jaipur: [75.7873, 26.9124],
};

export default function RestaurantFormDialog({
  isOpen,
  onClose,
  initialData = null,
  onSubmit,
  isSubmitting = false,
}) {
  const isEditing = Boolean(initialData);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(restaurantFormSchema),
    defaultValues: {
      name: '',
      city: 'Bhopal',
      area: '',
      cuisines: ['North Indian'],
      lng: 77.4126,
      lat: 23.2599,
      isOpen: true,
    },
  });

  const selectedCity = watch('city');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          name: initialData.name || '',
          city: initialData.city || 'Bhopal',
          area: initialData.area || '',
          cuisines: initialData.cuisines?.length ? initialData.cuisines : ['North Indian'],
          lng: initialData.location?.coordinates?.[0] ?? 77.4126,
          lat: initialData.location?.coordinates?.[1] ?? 23.2599,
          isOpen: initialData.isOpen !== false,
        });
      } else {
        reset({
          name: '',
          city: 'Bhopal',
          area: '',
          cuisines: ['North Indian'],
          lng: 77.4126,
          lat: 23.2599,
          isOpen: true,
        });
      }
    }
  }, [isOpen, initialData, reset]);

  // Auto-fill coordinates on city change if creating
  useEffect(() => {
    if (!isEditing && selectedCity && CITY_COORDINATES[selectedCity]) {
      const [lng, lat] = CITY_COORDINATES[selectedCity];
      setValue('lng', lng, { shouldValidate: true });
      setValue('lat', lat, { shouldValidate: true });
    }
  }, [selectedCity, isEditing, setValue]);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Restaurant Profile' : 'Establish New Restaurant'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-charcoal">
            Restaurant Brand Name *
          </label>
          <input
            type="text"
            {...register('name')}
            placeholder="e.g. Peshawari Dawat"
            className={cn(
              'w-full h-9 px-3 bg-surface border rounded-xl text-xs text-charcoal focus:outline-none focus:border-terracotta-400',
              errors.name ? 'border-red-400' : 'border-neutralBorder'
            )}
          />
          {errors.name && (
            <p className="text-[11px] text-red-600 font-medium">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* City & Area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-charcoal">City *</label>
            <select
              {...register('city')}
              className="w-full h-9 px-3 bg-surface border border-neutralBorder rounded-xl text-xs text-charcoal focus:outline-none focus:border-terracotta-400"
            >
              {INDIAN_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.city && (
              <p className="text-[11px] text-red-600 font-medium">
                {errors.city.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-charcoal">
              Area / Neighborhood *
            </label>
            <input
              type="text"
              {...register('area')}
              placeholder="e.g. Arera Colony Zone 1"
              className={cn(
                'w-full h-9 px-3 bg-surface border rounded-xl text-xs text-charcoal focus:outline-none focus:border-terracotta-400',
                errors.area ? 'border-red-400' : 'border-neutralBorder'
              )}
            />
            {errors.area && (
              <p className="text-[11px] text-red-600 font-medium">
                {errors.area.message}
              </p>
            )}
          </div>
        </div>

        {/* Cuisines Multi-Select */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-charcoal">
            Cuisines Served *
          </label>
          <Controller
            name="cuisines"
            control={control}
            render={({ field }) => (
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1.5 border border-neutralBorder-light rounded-xl bg-surface-subtle/50">
                {CUISINE_TYPES.map((c) => {
                  const selected = field.value?.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        const updated = selected
                          ? field.value.filter((item) => item !== c)
                          : [...(field.value || []), c];
                        field.onChange(updated);
                      }}
                      className={cn(
                        'text-xs px-2.5 py-1 rounded-full border transition-all',
                        selected
                          ? 'bg-terracotta-500 border-terracotta-500 text-white font-medium shadow-xs'
                          : 'bg-surface border-neutralBorder text-charcoal-secondary hover:border-terracotta-300'
                      )}
                    >
                      {c} {selected && '✓'}
                    </button>
                  );
                })}
              </div>
            )}
          />
          {errors.cuisines && (
            <p className="text-[11px] text-red-600 font-medium">
              {errors.cuisines.message}
            </p>
          )}
        </div>

        {/* Coordinates */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-charcoal">
              Longitude *
            </label>
            <input
              type="number"
              step="any"
              {...register('lng', { valueAsNumber: true })}
              className={cn(
                'w-full h-9 px-3 bg-surface border rounded-xl text-xs font-mono text-charcoal focus:outline-none focus:border-terracotta-400',
                errors.lng ? 'border-red-400' : 'border-neutralBorder'
              )}
            />
            {errors.lng && (
              <p className="text-[11px] text-red-600 font-medium">
                {errors.lng.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-charcoal">
              Latitude *
            </label>
            <input
              type="number"
              step="any"
              {...register('lat', { valueAsNumber: true })}
              className={cn(
                'w-full h-9 px-3 bg-surface border rounded-xl text-xs font-mono text-charcoal focus:outline-none focus:border-terracotta-400',
                errors.lat ? 'border-red-400' : 'border-neutralBorder'
              )}
            />
            {errors.lat && (
              <p className="text-[11px] text-red-600 font-medium">
                {errors.lat.message}
              </p>
            )}
          </div>
        </div>

        {/* Kitchen Status Toggle */}
        <div className="p-3 bg-surface-subtle border border-neutralBorder-light rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-charcoal block">
              Kitchen Operating Status
            </span>
            <span className="text-[11px] text-charcoal-muted">
              Controls whether customers can place active orders right now
            </span>
          </div>

          <Controller
            name="isOpen"
            control={control}
            render={({ field }) => (
              <button
                type="button"
                onClick={() => field.onChange(!field.value)}
                className={cn(
                  'text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all',
                  field.value
                    ? 'bg-culinary-vegBg text-culinary-veg border-culinary-veg/30'
                    : 'bg-surface border-neutralBorder text-charcoal-muted'
                )}
              >
                {field.value ? 'Open for Orders' : 'Kitchen Closed'}
              </button>
            )}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2.5 pt-3 border-t border-neutralBorder">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
          >
            {isEditing ? 'Save Changes' : 'Create Restaurant'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

