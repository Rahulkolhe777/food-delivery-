/**
 * Utility helpers.
 */

// ── Class merging (Tailwind-safe) ─────────────────────────────────────────────
/**
 * Merges class names, filtering falsy values.
 * Lightweight alternative to clsx+tailwind-merge for this project's scope.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ── Currency formatting ───────────────────────────────────────────────────────
/**
 * Formats a number as Indian Rupees.
 * e.g. formatCurrency(1234.5) → "₹1,235"
 */
export function formatCurrency(amount, { decimals = 0 } = {}) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

// ── Date formatting ───────────────────────────────────────────────────────────
export function formatDate(dateStr, options = {}) {
  const defaults = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  return new Date(dateStr).toLocaleDateString("en-IN", { ...defaults, ...options });
}

export function formatDateTime(dateStr) {
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateISO(date) {
  return new Date(date).toISOString().split("T")[0];
}

// ── Relative time ─────────────────────────────────────────────────────────────
export function timeAgo(dateStr) {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return "just now";
  if (diff < hour) return `${Math.floor(diff / minute)}m ago`;
  if (diff < day) return `${Math.floor(diff / hour)}h ago`;
  if (diff < 7 * day) return `${Math.floor(diff / day)}d ago`;
  return formatDate(dateStr);
}

// ── Order status helpers ──────────────────────────────────────────────────────
const STATUS_LABELS = {
  placed:    "Order Placed",
  preparing: "Preparing",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function getStatusLabel(status) {
  return STATUS_LABELS[status] ?? status;
}

export function getStatusVariant(status) {
  const map = {
    placed:    "placed",
    preparing: "preparing",
    delivered: "delivered",
    cancelled: "cancelled",
  };
  return map[status] ?? "default";
}

// ── Allowed next statuses (mirrors backend order.controller.js NEXT_STATUSES) ─
const NEXT_STATUSES = {
  placed:    ["preparing", "cancelled"],
  preparing: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

export function getNextStatuses(currentStatus) {
  return NEXT_STATUSES[currentStatus] ?? [];
}

// ── Payment method label ──────────────────────────────────────────────────────
const PAYMENT_LABELS = {
  upi:  "UPI",
  card: "Card",
  cod:  "Cash on Delivery",
};

export function getPaymentLabel(method) {
  return PAYMENT_LABELS[method] ?? method;
}

// ── Cities (from backend seed data) ──────────────────────────────────────────
export const INDIAN_CITIES = [
  "Bhopal",
  "Indore",
  "Delhi",
  "Mumbai",
  "Bengaluru",
  "Pune",
  "Hyderabad",
  "Jaipur",
];

// ── Cuisine types (from backend seed data) ───────────────────────────────────
export const CUISINE_TYPES = [
  "North Indian",
  "South Indian",
  "Chinese",
  "Biryani",
  "Mughlai",
  "Street Food",
  "Fast Food",
  "Desserts",
  "Beverages",
];

// ── Realistic Address Resolution & Landmark Generator ────────────────────────
const CITY_ADDRESS_METADATA = {
  Bhopal: {
    state: "MP",
    pincodes: ["462001", "462003", "462011", "462016", "462022", "462024", "462026", "462030"],
  },
  Indore: {
    state: "MP",
    pincodes: ["452001", "452002", "452008", "452010", "452012", "452014"],
  },
  Delhi: {
    state: "Delhi",
    pincodes: ["110001", "110006", "110016", "110024", "110048", "110075"],
  },
  Mumbai: {
    state: "Maharashtra",
    pincodes: ["400001", "400050", "400053", "400058", "400076", "400080"],
  },
  Bengaluru: {
    state: "Karnataka",
    pincodes: ["560001", "560025", "560034", "560038", "560068", "560100"],
  },
  Pune: {
    state: "Maharashtra",
    pincodes: ["411001", "411004", "411014", "411028", "411038", "411045"],
  },
  Hyderabad: {
    state: "Telangana",
    pincodes: ["500001", "500016", "500032", "500034", "500081", "500084"],
  },
  Jaipur: {
    state: "Rajasthan",
    pincodes: ["302001", "302004", "302015", "302019", "302020"],
  },
};

const COMMERCIAL_LANDMARKS = [
  "Shop {num}, Ground Floor, Central Plaza",
  "Plot {num}, Block B, Commercial Complex",
  "SCO {num}, High Street Galleria",
  "Shop {num}, Heritage Arcade, Near City Park",
  "Unit {num}, 1st Floor, Metro Promenade",
  "Plot {num}, Sector 2, Main Market Road",
  "Shop {num}, Crystal Square, Opp. Axis Bank",
  "G-{num}, Royal Enclave, Landmark Crossroad",
  "Shop {num}, City Center Mall, Food Court",
  "Plot {num}, Avenue Walk, Near Metro Station",
  "SCO {num}, Fortune Tower, Main Boulevard",
  "Shop {num}, Sunrise Complex, Station Road",
];

/**
 * Generates an authentic, detailed Indian street address for a restaurant.
 * Deterministically keyed by restaurant _id so the address is realistic,
 * consistent, and never changes between re-renders.
 *
 * @param {Object} restaurant - The restaurant object from backend
 * @param {Object} options - { format: 'full' | 'short' | 'street' }
 * @returns {string} - The formatted street address
 */
export function getRestaurantAddress(restaurant, { format = 'full' } = {}) {
  if (restaurant?.address) return restaurant.address;
  if (!restaurant) return '';

  const id = String(restaurant._id || restaurant.id || restaurant.name || '');
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }

  const area = restaurant.area || '';
  const city = restaurant.city || 'Bhopal';
  const meta = CITY_ADDRESS_METADATA[city] || CITY_ADDRESS_METADATA.Bhopal;

  const template = COMMERCIAL_LANDMARKS[hash % COMMERCIAL_LANDMARKS.length];
  const shopNum = (hash % 75) + 1;
  const streetPart = template.replace('{num}', String(shopNum));
  const pinCode = meta.pincodes[hash % meta.pincodes.length];

  if (format === 'short') {
    // e.g. "Central Plaza, New Market, Bhopal"
    const landmark = streetPart.split(',').pop()?.trim() || streetPart;
    return [landmark, area, city].filter(Boolean).join(', ');
  }

  if (format === 'street') {
    // e.g. "Shop 14, Ground Floor, Central Plaza"
    return streetPart;
  }

  // Full official address:
  // e.g. "Shop 14, Ground Floor, Central Plaza, New Market, Bhopal, MP - 462003"
  const tokens = [streetPart, area, city, `${meta.state} - ${pinCode}`];
  return tokens.filter(Boolean).join(', ');
}

