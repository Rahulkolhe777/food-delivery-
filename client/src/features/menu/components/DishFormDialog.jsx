import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { menuItemFormSchema } from '../validation/menuItem.schema';

const SUGGESTED_CATEGORIES = [
  'Main Course',
  'Starters',
  'Breads',
  'Biryani',
  'Desserts',
  'Beverages',
  'Combos',
  'Snacks',
];

export default function DishFormDialog({
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
    resolver: zodResolver(menuItemFormSchema),
    defaultValues: {
      name: '',
      category: '',
      price: '',
      isVeg: true,
      isAvailable: true,
    },
  });

  const watchCategory = watch('category');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          name: initialData.name || '',
          category: initialData.category || '',
          price: initialData.price ?? '',
          isVeg: initialData.isVeg ?? true,
          isAvailable: initialData.isAvailable ?? true,
        });
      } else {
        reset({
          name: '',
          category: '',
          price: '',
          isVeg: true,
          isAvailable: true,
        });
      }
    }
  }, [isOpen, initialData, reset]);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Menu Item' : 'Add New Dish to Menu'}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
        {/* Dish Name */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider">
            Dish Name <span className="text-terracotta-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Malai Kofta Curry"
            {...register('name')}
            className={cn(
              'w-full h-10 px-3 bg-surface border rounded-xl text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-terracotta-100 transition-all',
              errors.name ? 'border-culinary-nonveg' : 'border-neutralBorder focus:border-terracotta-400'
            )}
          />
          {errors.name && (
            <p className="text-[11px] text-culinary-nonveg font-medium mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Category with Quick Suggestions */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider">
              Category <span className="text-terracotta-500">*</span>
            </label>
            <span className="text-[11px] text-charcoal-muted">Type or pick from below</span>
          </div>
          <input
            type="text"
            placeholder="e.g. Main Course, Starters, Breads"
            {...register('category')}
            className={cn(
              'w-full h-10 px-3 bg-surface border rounded-xl text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-terracotta-100 transition-all',
              errors.category ? 'border-culinary-nonveg' : 'border-neutralBorder focus:border-terracotta-400'
            )}
          />
          {errors.category && (
            <p className="text-[11px] text-culinary-nonveg font-medium mt-1">
              {errors.category.message}
            </p>
          )}

          {/* Quick Suggestions Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {SUGGESTED_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setValue('category', cat, { shouldValidate: true })}
                className={cn(
                  'text-[10px] px-2 py-0.5 rounded-md border transition-all cursor-pointer',
                  watchCategory === cat
                    ? 'bg-charcoal text-white border-charcoal font-semibold'
                    : 'bg-surface-subtle text-charcoal-secondary border-neutralBorder hover:border-terracotta-300'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Price in INR */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider">
            Price (INR ₹) <span className="text-terracotta-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-muted text-xs font-bold">
              ₹
            </span>
            <input
              type="number"
              step="1"
              min="0"
              placeholder="280"
              {...register('price')}
              className={cn(
                'w-full h-10 pl-7 pr-3 bg-surface border rounded-xl text-xs font-mono text-charcoal focus:outline-none focus:ring-2 focus:ring-terracotta-100 transition-all',
                errors.price ? 'border-culinary-nonveg' : 'border-neutralBorder focus:border-terracotta-400'
              )}
            />
          </div>
          {errors.price && (
            <p className="text-[11px] text-culinary-nonveg font-medium mt-1">
              {errors.price.message}
            </p>
          )}
        </div>

        {/* Dietary Tag (Veg vs Non-Veg) */}
        <div className="space-y-1.5 pt-1">
          <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider">
            Dietary Classification
          </label>
          <Controller
            name="isVeg"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => field.onChange(true)}
                  className={cn(
                    'flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer',
                    field.value === true
                      ? 'bg-culinary-vegBg border-culinary-veg text-culinary-veg shadow-xs'
                      : 'bg-surface border-neutralBorder text-charcoal-muted hover:border-neutralBorder-strong'
                  )}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-culinary-veg" />
                  <span>Vegetarian (Pure Veg)</span>
                </button>

                <button
                  type="button"
                  onClick={() => field.onChange(false)}
                  className={cn(
                    'flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer',
                    field.value === false
                      ? 'bg-culinary-nonvegBg border-culinary-nonveg text-culinary-nonveg shadow-xs'
                      : 'bg-surface border-neutralBorder text-charcoal-muted hover:border-neutralBorder-strong'
                  )}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-culinary-nonveg" />
                  <span>Non-Vegetarian</span>
                </button>
              </div>
            )}
          />
        </div>

        {/* Availability Toggle */}
        <div className="space-y-1.5 pt-1">
          <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider">
            Live Menu Availability
          </label>
          <Controller
            name="isAvailable"
            control={control}
            render={({ field }) => (
              <div className="p-3 bg-surface-subtle border border-neutralBorder-light rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-charcoal block">
                    {field.value ? 'In Stock (Available)' : 'Sold Out (Temporarily Unavailable)'}
                  </span>
                  <span className="text-[11px] text-charcoal-muted">
                    {field.value
                      ? 'Customers can add this dish to cart'
                      : 'Dish appears dimmed and cannot be ordered'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => field.onChange(!field.value)}
                  className={cn(
                    'text-xs font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer',
                    field.value
                      ? 'bg-culinary-vegBg text-culinary-veg border-culinary-veg/40'
                      : 'bg-surface border-neutralBorder text-charcoal-muted'
                  )}
                >
                  {field.value ? 'In Stock' : 'Sold Out'}
                </button>
              </div>
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
            {isEditing ? 'Save Changes' : 'Add to Menu'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

