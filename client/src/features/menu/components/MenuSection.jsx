import React from 'react';
import FoodCard from '@/components/shared/FoodCard';
import { getMenuItemImage } from '@/lib/cuisineImages';

export default function MenuSection({
  categoryName,
  dishes = [],
  getItemQuantity,
  onAdd,
  onRemove,
  isOpen = true,
}) {
  if (!dishes || dishes.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b border-neutralBorder pb-2">
        <h2 className="font-display text-xl font-bold text-charcoal">
          {categoryName}
        </h2>
        <span className="text-xs font-semibold text-charcoal-muted">
          {dishes.length} item{dishes.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {dishes.map((dish) => {
          const quantity = getItemQuantity ? getItemQuantity(dish._id) : 0;
          const dishImage = getMenuItemImage(dish);

          return (
            <FoodCard
              key={dish._id}
              item={dish}
              quantity={quantity}
              imageUrl={dishImage}
              onAdd={() => onAdd(dish)}
              onRemove={() => onRemove(dish)}
              disabled={!isOpen || dish.isAvailable === false}
            />
          );
        })}
      </div>
    </section>
  );
}

