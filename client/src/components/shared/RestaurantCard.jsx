import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Star, Utensils, ArrowRight } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { cn, getRestaurantAddress } from '@/lib/utils';
import { getRestaurantCardImage, CUISINE_CARD_GALLERY } from '@/lib/cuisineImages';

export default function RestaurantCard({
  restaurant,
  onClick,
  imageUrl,
  rating,
  reviewCount,
  className,
}) {
  const navigate = useNavigate();

  const {
    _id,
    name = 'Unnamed Restaurant',
    cuisines = [],
    isOpen = true,
  } = restaurant || {};

  const cardImage = imageUrl || getRestaurantCardImage(restaurant);
  const displayRating = restaurant?.rating ?? rating;
  const displayReviews = restaurant?.reviewCount ?? reviewCount;

  const fullAddress = getRestaurantAddress(restaurant, { format: 'full' });
  const shortAddress = getRestaurantAddress(restaurant, { format: 'short' });

  const handleCardClick = (e) => {
    if (onClick) {
      onClick(e);
    } else if (_id) {
      navigate(`/restaurants/${_id}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick(e);
    }
  };

  return (
    <article
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View menu and details for ${name}, located at ${fullAddress}`}
      className={cn(
        'group bg-surface border border-neutralBorder rounded-2xl overflow-hidden shadow-warm-xs',
        'hover:shadow-warm-md hover:border-neutralBorder-strong transition-all duration-200 cursor-pointer flex flex-col',
        'focus:outline-none focus:ring-2 focus:ring-terracotta-500/40 focus:border-terracotta-500',
        className
      )}
    >
      {/* Visual Header / Cover Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-subtle">
        <img
          src={cardImage}
          alt={`${name} - ${shortAddress}`}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = CUISINE_CARD_GALLERY.default[0];
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/65 via-transparent to-transparent opacity-70" />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge
            variant={isOpen ? 'veg' : 'default'}
            size="sm"
            className="shadow-sm font-semibold backdrop-blur-sm bg-white/95"
          >
            {isOpen ? 'Open Now' : 'Closed'}
          </Badge>
        </div>

        {/* Short Location chip on visual header */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[11px] font-medium text-white/90 drop-shadow-sm max-w-[85%]">
          <MapPin className="w-3 h-3 text-terracotta-300 shrink-0" />
          <span className="truncate">
            {shortAddress}
          </span>
        </div>

        {/* Real Rating chip — rendered only when genuine rating data is available */}
        {displayRating != null && (
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg px-2 py-0.5 flex items-center gap-1 shadow-sm border border-neutralBorder-light">
            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
            <span className="text-xs font-bold text-charcoal">{displayRating}</span>
            {displayReviews != null && (
              <span className="text-[10px] text-charcoal-muted">({displayReviews})</span>
            )}
          </div>
        )}
      </div>

      {/* Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link
              to={_id ? `/restaurants/${_id}` : '/restaurants'}
              onClick={(e) => e.stopPropagation()}
              className="font-display text-base font-semibold text-charcoal tracking-tight group-hover:text-terracotta-600 transition-colors line-clamp-1 hover:underline"
            >
              {name}
            </Link>
          </div>

          {/* Proper Full Street Address */}
          <p
            className="text-xs text-charcoal-muted flex items-start gap-1.5 mt-1 line-clamp-2 leading-snug"
            title={fullAddress}
          >
            <MapPin className="w-3.5 h-3.5 text-terracotta-500 shrink-0 mt-0.5" />
            <span className="font-medium text-charcoal-secondary">
              {fullAddress}
            </span>
          </p>

          {/* Cuisines */}
          {cuisines.length > 0 && (
            <p className="text-xs text-charcoal-secondary mt-2 line-clamp-1">
              {cuisines.join(' • ')}
            </p>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-neutralBorder-light flex items-center justify-between text-xs text-charcoal-muted">
          <span className="flex items-center gap-1.5">
            <Utensils className="w-3.5 h-3.5 text-terracotta-400" />
            <span>Artisanal Kitchen</span>
          </span>
          <Link
            to={_id ? `/restaurants/${_id}` : '/restaurants'}
            onClick={(e) => e.stopPropagation()}
            className="text-terracotta-600 hover:text-terracotta-700 font-semibold text-xs inline-flex items-center gap-1 group-hover:underline focus:outline-none"
            aria-label={`View menu for ${name}`}
          >
            <span>View Menu</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
