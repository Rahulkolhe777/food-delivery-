/**
 * Centralized Cuisine Photography & Atmospheric Imagery Maps
 * Single source of truth for Unsplash cuisine visuals across customer & owner views.
 */

export const HERO_IMAGE =
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1920&q=90';

export const CUISINE_META = [
  {
    label: 'North Indian',
    emoji: '🍛',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400&q=75',
  },
  {
    label: 'South Indian',
    emoji: '🥘',
    image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=400&q=75',
  },
  {
    label: 'Biryani',
    emoji: '🍚',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=75',
  },
  {
    label: 'Chinese',
    emoji: '🍜',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=400&q=75',
  },
  {
    label: 'Mughlai',
    emoji: '🫕',
    image: 'https://images.unsplash.com/photo-1631515242808-497c3fbd3972?auto=format&fit=crop&w=400&q=75',
  },
  {
    label: 'Street Food',
    emoji: '🌮',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=75',
  },
  {
    label: 'Fast Food',
    emoji: '🍔',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=75',
  },
  {
    label: 'Desserts',
    emoji: '🧁',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=400&q=75',
  },
];

// Multi-image galleries per cuisine so different restaurants with the same cuisine
// get varied, authentic photography rather than identical duplicate images.
export const CUISINE_CARD_GALLERY = {
  'North Indian': [
    'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=700&q=80',
  ],
  Biryani: [
    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=700&q=80',
  ],
  Chinese: [
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=700&q=80',
  ],
  'South Indian': [
    'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=700&q=80',
  ],
  Mughlai: [
    'https://images.unsplash.com/photo-1631515242808-497c3fbd3972?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80',
  ],
  'Street Food': [
    'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=700&q=80',
  ],
  'Fast Food': [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=700&q=80',
  ],
  Pizza: [
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=700&q=80',
  ],
  Desserts: [
    'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=700&q=80',
  ],
  default: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=700&q=80',
  ],
};

export const CUISINE_CARD_IMAGE = {
  'North Indian': CUISINE_CARD_GALLERY['North Indian'][0],
  Biryani: CUISINE_CARD_GALLERY.Biryani[0],
  Chinese: CUISINE_CARD_GALLERY.Chinese[0],
  'South Indian': CUISINE_CARD_GALLERY['South Indian'][0],
  Mughlai: CUISINE_CARD_GALLERY.Mughlai[0],
  'Street Food': CUISINE_CARD_GALLERY['Street Food'][0],
  'Fast Food': CUISINE_CARD_GALLERY['Fast Food'][0],
  Pizza: CUISINE_CARD_GALLERY.Pizza[0],
  Desserts: CUISINE_CARD_GALLERY.Desserts[0],
  default: CUISINE_CARD_GALLERY.default[0],
};

export const CUISINE_HERO_IMAGES = {
  Biryani: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1600&q=85',
  'North Indian': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1600&q=85',
  Chinese: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1600&q=85',
  'South Indian': 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=1600&q=85',
  Mughlai: 'https://images.unsplash.com/photo-1631515242808-497c3fbd3972?auto=format&fit=crop&w=1600&q=85',
  'Street Food': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1600&q=85',
  'Fast Food': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1600&q=85',
  Desserts: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1600&q=85',
  default: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=85',
};

// Generates a stable integer hash from a string
function getDeterministicHash(str = '') {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/**
 * Returns a card image chosen deterministically based on cuisine and restaurant identity.
 */
export function getCardImage(cuisines = [], idOrName = '') {
  const hash = getDeterministicHash(String(idOrName));
  if (Array.isArray(cuisines) && cuisines.length > 0) {
    for (const c of cuisines) {
      const gallery = CUISINE_CARD_GALLERY[c];
      if (gallery && gallery.length > 0) {
        return gallery[hash % gallery.length];
      }
    }
  }
  const defaultGallery = CUISINE_CARD_GALLERY.default;
  return defaultGallery[hash % defaultGallery.length];
}

/**
 * Returns the card image for a restaurant object, respecting restaurant.image first.
 */
export function getRestaurantCardImage(restaurant) {
  if (restaurant?.image) return restaurant.image;
  if (restaurant?.imageUrl) return restaurant.imageUrl;
  return getCardImage(restaurant?.cuisines, restaurant?._id || restaurant?.name || '');
}

export function getRestaurantCover(cuisines = [], idOrName = '') {
  const hash = getDeterministicHash(String(idOrName));
  if (Array.isArray(cuisines) && cuisines.length > 0) {
    for (const c of cuisines) {
      if (CUISINE_HERO_IMAGES[c]) return CUISINE_HERO_IMAGES[c];
    }
  }
  const defaultList = CUISINE_CARD_GALLERY.default;
  return defaultList[hash % defaultList.length];
}

export function getMenuItemImage(item) {
  const name = (item?.name || '').toLowerCase();
  const cat = (item?.category || '').toLowerCase();

  if (name.includes('biryani') || cat.includes('biryani')) {
    return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80';
  }
  if (name.includes('tikka') || name.includes('kebab') || name.includes('tandoori') || name.includes('chilli chicken')) {
    return 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=400&q=80';
  }
  if (name.includes('paneer') || name.includes('manchurian') || name.includes('potato') || name.includes('spring roll')) {
    return 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=400&q=80';
  }
  if (name.includes('momo') || cat.includes('momo')) {
    return 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&w=400&q=80';
  }
  if (name.includes('naan') || name.includes('roti') || name.includes('paratha')) {
    return 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=400&q=80';
  }
  if (name.includes('dal') || name.includes('curry') || cat.includes('curry')) {
    return 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80';
  }
  if (name.includes('rice') || name.includes('fried rice') || name.includes('pulao')) {
    return 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=400&q=80';
  }
  if (name.includes('noodle') || name.includes('chow mein')) {
    return 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80';
  }
  if (name.includes('pizza') || name.includes('burger') || name.includes('fries') || name.includes('sandwich')) {
    return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80';
  }
  if (name.includes('dosa') || name.includes('idli') || name.includes('vada') || name.includes('sambar')) {
    return 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=400&q=80';
  }
  if (name.includes('gulab') || name.includes('ice cream') || name.includes('cake') || cat.includes('dessert')) {
    return 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=400&q=80';
  }
  if (name.includes('shake') || name.includes('lassi') || name.includes('coffee') || cat.includes('beverage')) {
    return 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=400&q=80';
  }

  // Fallback
  return item?.isVeg
    ? 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80'
    : 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80';
}

