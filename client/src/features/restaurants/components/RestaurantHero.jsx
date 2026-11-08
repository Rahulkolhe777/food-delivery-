import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Utensils, Clock, ChevronLeft } from 'lucide-react';
import { Badge } from '@/components/ui';
import { getRestaurantAddress } from '@/lib/utils';
import { getRestaurantCover } from '@/lib/cuisineImages';

export default function RestaurantHero({
  restaurant,
  averageRating = 0,
  reviewsTotal = 0,
}) {
  if (!restaurant) return null;

  const coverUrl = getRestaurantCover(restaurant.cuisines, restaurant._id);

  return (
    <>
      {/* Top Breadcrumb Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-2">
        <Link
          to="/restaurants"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-secondary hover:text-terracotta-600 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Back to all restaurants
        </Link>
      </div>

      {/* Atmospheric Hero Header */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 pt-2 pb-6">
        <div className="relative rounded-3xl overflow-hidden shadow-warm-md border border-neutralBorder bg-surface">
          {/* Visual Backdrop */}
          <div className="relative h-60 sm:h-80 w-full overflow-hidden">
            <img
              src={coverUrl}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-transparent" />

            {/* Status Chip */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <Badge
                variant={restaurant.isOpen ? 'veg' : 'default'}
                size="md"
                className="shadow-sm backdrop-blur-md bg-white/95 font-semibold"
              >
                {restaurant.isOpen ? 'Open Now' : 'Closed'}
              </Badge>
              {restaurant.area && (
                <span className="backdrop-blur-md bg-charcoal/60 text-white text-xs px-3 py-1 rounded-full font-medium">
                  {restaurant.area}
                </span>
              )}
            </div>

            {/* Rating Chip */}
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-xl px-3 py-1.5 flex items-center gap-1.5 shadow-sm border border-neutralBorder-light">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span className="text-sm font-bold text-charcoal">{averageRating}</span>
              <span className="text-xs text-charcoal-muted">
                ({reviewsTotal} reviews)
              </span>
            </div>

            {/* Header Content Overlay */}
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-sm">
                {restaurant.name}
              </h1>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-2 text-xs sm:text-sm text-white/90">
                {/* Cuisines */}
                {restaurant.cuisines?.length > 0 && (
                  <div className="flex items-center gap-1.5 font-medium">
                    <Utensils className="w-3.5 h-3.5 text-terracotta-300" />
                    <span>{restaurant.cuisines.join(' • ')}</span>
                  </div>
                )}

                {/* Location with Proper Full Address */}
                <div className="flex items-center gap-1.5" title={getRestaurantAddress(restaurant, { format: 'full' })}>
                  <MapPin className="w-3.5 h-3.5 text-terracotta-300 shrink-0" />
                  <span className="truncate max-w-md">{getRestaurantAddress(restaurant, { format: 'full' })}</span>
                </div>

                {/* Opening Hours hint */}
                <div className="flex items-center gap-1.5 text-white/80">
                  <Clock className="w-3.5 h-3.5 text-terracotta-300" />
                  <span>Fresh orders welcome daily</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

