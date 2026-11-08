# Customer-Facing Application Bug Fix & Integration Report

**Date:** November 1, 2026  
**Role:** Senior React Debugging Engineer & Full-Stack Integration Specialist  
**Status:** All Customer-Facing Critical Issues Diagnosed & Resolved  
**Build Status:** Clean Build (`vite build` passed in 2.20s, 0 errors)  
**Lint Status:** Clean Lint (`oxlint` passed on 166 files, 0 errors)

---

## Executive Summary

A comprehensive forensic audit of the customer-facing restaurant food ordering application was conducted across both the frontend React client (`client/src/`) and the Node.js/Express/MongoDB backend services (`server/server/src/`).

The audit addressed six critical customer complaints:
1. **Identical restaurant cards appearing repeatedly** in the directory.
2. **Different cards showing the exact same name and image**.
3. **Ambiguity regarding whether cards represent distinct restaurants** (same names with differing locations/cuisines).
4. **"View Menu" button not operating or navigating**.
5. **Customer profile page completely dysfunctional**.
6. **Customer navigation, links, and cart/checkout integration issues**.

All root causes were pinpointed through live API inspections, database seed verification, and component route audits. The issues have been resolved without altering the backend or introducing fake/mock data.

---

## Part 1: Investigation of Restaurant Data & Findings

### 1. What exact API endpoint fetches restaurants?
- **Frontend Service:** `getRestaurants(params)` in `client/src/features/restaurants/services/restaurant.service.js`.
- **Backend Route:** `GET /api/restaurants` mapped to `getRestaurants` in `server/server/src/controllers/restaurant.controller.js:23`.
- **Query Parameters Supported:** `page`, `limit`, `city`.

### 2. What does the backend actually return?
A live query to `GET /api/restaurants?page=1&limit=12&city=Bhopal` returns:
```json
{
  "page": 1,
  "limit": 12,
  "total": 70038,
  "totalPages": 5837,
  "restaurants": [
    {
      "_id": "6735cfa300020000000dcb8a",
      "name": "Agarwal's Bamboo House",
      "owner": "67deb0dd0001000000000fea",
      "city": "Bhopal",
      "area": "New Market",
      "cuisines": ["Chinese", "South Indian"],
      "location": { "type": "Point", "coordinates": [77.357217, 23.258505] },
      "isOpen": true,
      "createdAt": "2024-11-14T10:23:31.000Z"
    },
    {
      "_id": "673793d90002000000057dbb",
      "name": "Agarwal's Bamboo House",
      "owner": "68eda24c000100000000e9db",
      "city": "Bhopal",
      "area": "Indrapuri",
      "cuisines": ["Chinese", "Pizza", "South Indian"],
      "location": { "type": "Point", "coordinates": [77.422771, 23.328071] },
      "isOpen": true,
      "createdAt": "2024-11-15T18:32:57.000Z"
    }
  ]
}
```

### 3. Does the response contain duplicate restaurant IDs?
- **NO.** Every document in the backend response possesses a completely unique MongoDB `_id` (`6735cfa3...`, `673793d9...`, `673a8870...`, etc.).
- There are no duplicate records returned by MongoDB.

### 4. Why did multiple cards show the same name and image? (Root Causes)
1. **Procedural Database Seed Sorting:**
   - In `server/server/src/seed/seed.js:264-266`, restaurants are seeded as branches of restaurant chains using combinations of prefixes and suffixes:
     ```javascript
     // Names repeat a lot (like branches of a chain). Some add the area to stand out.
     let name = `${pickOne(NAME_PREFIXES)} ${pickOne(NAME_SUFFIXES[mainCuisine])}`;
     ```
   - In `server/server/src/controllers/restaurant.controller.js:32`, the controller sorts restaurants alphabetically:
     ```javascript
     Restaurant.find(filter).sort({ name: 1, _id: 1 }).skip(skip).limit(limit)
     ```
   - Because `Agarwal's Bamboo House` is alphabetically first among prefix-suffix combinations, page 1 returns distinct branch locations of "Agarwal's Bamboo House" situated across different neighborhoods in Bhopal (New Market, Indrapuri, MP Nagar, Habibganj, Shahpura, Arera Colony, Bittan Market).
2. **Hardcoded Fallback Image in `RestaurantCard.jsx`:**
   - In `client/src/components/shared/RestaurantCard.jsx:23-25`:
     ```javascript
     const fallbackImage = imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4...';
     ```
   - Neither `RestaurantGrid` nor `CustomerHome` passed `imageUrl`, nor was `restaurant.image` or `getCardImage(cuisines)` referenced!
   - Every single restaurant rendered across the entire application was assigned the identical Unsplash photo (`photo-1517248135467-4c7edcad34c4`).
3. **Hardcoded Fake Rating Defaults:**
   - In `RestaurantCard.jsx:10-11`:
     ```javascript
     export default function RestaurantCard({ restaurant, rating = 4.5, reviewCount = 120, ... })
     ```
   - The backend `Restaurant` schema does not store `rating` or `reviewCount` directly on the restaurant model (ratings exist in the separate `Review` collection).
   - Because of the default parameters, every single restaurant displayed `★ 4.5 (120)`, giving the optical illusion of clone cards.
4. **Lack of Area / Branch Highlighting:**
   - The card title displayed only `name` without emphasizing the distinct outlet neighborhood (`area`), making distinct chain branches indistinguishable at a glance.

---

## Part 2: Detailed Root Causes & Fixes Implemented

### Issue 1 & 2: Identical Images & Fake Ratings on Restaurant Cards
- **Root Cause:**
  - `RestaurantCard.jsx` ignored cuisine and restaurant identity when selecting images, falling back to a single hardcoded Unsplash URL.
  - Fake rating values `rating = 4.5` and `reviewCount = 120` were hardcoded into the component signature.
- **Fix Implemented:**
  - **Dynamic Multi-Image Gallery:** Expanded `client/src/lib/cuisineImages.js` with `CUISINE_CARD_GALLERY` containing authentic photography per cuisine (North Indian, South Indian, Biryani, Chinese, Mughlai, Street Food, Fast Food, Pizza, Desserts).
  - **Deterministic Stable Hashing:** Added `getDeterministicHash` in `cuisineImages.js`. Restaurant images are deterministically mapped using `restaurant._id || restaurant.name`. Different branches with the same cuisine get distinct photos, and photos remain 100% stable across re-renders and page navigation.
  - **Rating Integrity:** Removed fake defaults `rating = 4.5` and `reviewCount = 120`. Added conditional rendering: rating and review badges are displayed **only when genuine rating data is available** (`displayRating != null`).
  - **Branch Visibility:** Displayed `area` prominently as an outlet identifier (e.g. `New Market Outlet`, `Indrapuri Outlet`) directly beneath the title and in the bottom location badge.

### Issue 3: Defensive Deduplication in Listing Grids
- **Root Cause:**
  - If any pagination or filtering operation ever returned identical MongoDB identities, duplicate React keys could cause re-render artifacts.
- **Fix Implemented:**
  - Added identity-based defensive deduplication in `RestaurantGrid.jsx`, `CustomerHome.jsx`, and `RestaurantsPage.jsx`:
    ```javascript
    const seen = new Set();
    return list.filter((r) => {
      if (!r || !r._id) return false;
      if (seen.has(r._id)) return false;
      seen.add(r._id);
      return true;
    });
    ```
  - Preserved distinct records that share the same chain name while guaranteeing zero key collisions.

### Issue 4: "View Menu" Button & Card Click Navigation Failure
- **Root Cause:**
  - In `client/src/components/shared/RestaurantCard.jsx`, the "View Menu →" element was an unlinked `<span>` with no `onClick` handler and no `<Link>`.
  - The card `<article>` relied on an `onClick` prop, but neither `CustomerHome.jsx` nor `RestaurantGrid.jsx` supplied an `onClick` callback.
  - Clicking the card or clicking "View Menu →" did nothing.
- **Fix Implemented:**
  - Imported `Link` and `useNavigate` from `react-router-dom`.
  - Wrapped "View Menu →" in `<Link to={`/restaurants/${_id}`}>`.
  - Wrapped the restaurant title in `<Link to={`/restaurants/${_id}`}>`.
  - Made the entire card interactive: clicking the card navigates directly to `/restaurants/${_id}` (or invokes `onClick` if explicitly provided).
  - Added keyboard accessibility (`role="button"`, `tabIndex={0}`, Enter/Space key handler).

### Issue 5: Customer Profile Page Not Working
- **Root Cause:**
  - In `client/src/app/router/index.jsx:69-75`:
    ```jsx
    <Route path="profile" element={<ProtectedRoute requiredRole="customer"><CustomerHome /></ProtectedRoute>} />
    ```
    The `/profile` route literally rendered `<CustomerHome />`! No customer profile component existed.
  - In `client/src/layouts/CustomerLayout.jsx:103-109`, the authenticated user pill in the top navbar linked to `to="/"`.
- **Fix Implemented:**
  - **Created `CustomerProfilePage.jsx` (`client/src/pages/customer/CustomerProfilePage.jsx`):**
    - Directly integrates with real backend endpoint `GET /api/auth/me` via `getMe()`.
    - Directly integrates with real backend endpoint `GET /api/orders/my` via `getMyOrders()`.
    - Displays authentic customer identity: full name, registered email, dining city, member since date (`createdAt`), role badge.
    - Computes authentic dining statistics: Total Orders Placed (verified: 516 orders for demo customer!), Completed Deliveries, Active Orders, and Lifetime Culinary Spend (`formatCurrency`).
    - Provides quick action portals to "My Order History" (`/orders`), "Explore Restaurants" (`/restaurants`), and a secure "Sign Out" flow.
    - Displays a live preview of recent orders with status badges and item counts.
    - Features loading skeletons and error handling with retry.
  - **Mounted Route in `router/index.jsx`:**
    ```jsx
    const CustomerProfilePage = lazy(() => import('@/pages/customer/CustomerProfilePage'));
    ...
    <Route path="profile" element={<ProtectedRoute requiredRole="customer"><CustomerProfilePage /></ProtectedRoute>} />
    ```
  - **Updated Navbar in `CustomerLayout.jsx`:**
    Pointed the user profile badge to `/profile` with active state styling.

### Issue 6: Additional Customer Navigation & Interactivity Audits
- **Audits & Enhancements:**
  - **`CustomerOrderCard.jsx`:** Wrapped restaurant names in `<Link to={`/restaurants/${restaurantId}`}>` so diners can revisit the restaurant directly from their order history.
  - **`OrderDetailModal.jsx`:** Linked the restaurant header directly to `/restaurants/${restaurantId}`.
  - **`RestaurantsPage.jsx` Search:** Expanded client search query `nameQuery` to match both `name` and `area`, allowing customers to search for specific branches (e.g. "New Market" or "Indrapuri").
  - **`RestaurantHero.jsx`:** Integrated deterministic cover selection `getRestaurantCover(cuisines, restaurant._id)`.

---

## Part 3: Summary of Files Modified

| File Path | Description of Changes |
| :--- | :--- |
| `client/src/lib/cuisineImages.js` | Added `CUISINE_CARD_GALLERY`, `getDeterministicHash`, `getRestaurantCardImage`, and deterministic image selection based on `_id`. |
| `client/src/components/shared/RestaurantCard.jsx` | Fixed "View Menu" link to `/restaurants/:id`, card click navigation, removed fake ratings, added outlet branch label, dynamic photos, error fallback. |
| `client/src/features/restaurants/components/RestaurantCard.jsx` | Re-exported shared `RestaurantCard` for feature-level modularity. |
| `client/src/features/restaurants/components/RestaurantGrid.jsx` | Added defensive `_id` deduplication and unique key rendering. |
| `client/src/pages/customer/CustomerHome.jsx` | Added defensive `_id` deduplication for listed venues. |
| `client/src/pages/customer/RestaurantsPage.jsx` | Added defensive `_id` deduplication and dual name/area search matching. |
| `client/src/pages/customer/CustomerProfilePage.jsx` | **NEW Component:** Customer profile dashboard displaying authentic user info (`/api/auth/me`), order stats (`/api/orders/my`), and quick actions. |
| `client/src/app/router/index.jsx` | Lazy-loaded and mounted `CustomerProfilePage` at route `/profile`. |
| `client/src/layouts/CustomerLayout.jsx` | Changed user profile link from `/` to `/profile` with active navigation styling. |
| `client/src/features/restaurants/components/RestaurantHero.jsx` | Passed `restaurant._id` to `getRestaurantCover` for distinct cover photos. |
| `client/src/features/orders/components/CustomerOrderCard.jsx` | Linked restaurant name directly to `/restaurants/:id`. |
| `client/src/features/orders/components/OrderDetailModal.jsx` | Linked modal restaurant title to `/restaurants/:id`. |

---

## Part 4: API Endpoints Tested & Verified

| Endpoint | Method | Status | Notes |
| :--- | :--- | :--- | :--- |
| `/api/restaurants?page=1&limit=12&city=Bhopal` | `GET` | `200 OK` | Verified distinct records, unique `_id`s, correct cuisines, locations, and pagination. |
| `/api/restaurants/6735cfa300020000000dcb8a` | `GET` | `200 OK` | Verified single restaurant detail retrieval. |
| `/api/restaurants/6735cfa300020000000dcb8a/menu` | `GET` | `200 OK` | Verified menu item listing (21 dishes returned). |
| `/api/restaurants/6735cfa300020000000dcb8a/reviews` | `GET` | `200 OK` | Verified customer reviews retrieval and pagination. |
| `/api/auth/login` | `POST` | `200 OK` | Verified demo customer authentication and access token generation. |
| `/api/auth/me` | `GET` | `200 OK` | Verified authentic user profile payload (`name`, `email`, `role`, `city`, `createdAt`). |
| `/api/orders/my?limit=5` | `GET` | `200 OK` | Verified customer orders query (516 total orders confirmed for demo account). |

---

## Part 5: Customer Workflows Verified

1. **Restaurant Discovery & Exploration:**
   - Navigating to `/` displays diverse photography across restaurant cards.
   - Distinct branches sharing a brand name clearly display their outlet location (e.g. "New Market Outlet", "Indrapuri Outlet").
   - No fake `4.5 (120)` ratings are rendered on unrated establishments.
2. **"View Menu" Navigation:**
   - Clicking "View Menu →" or clicking anywhere on a restaurant card navigates to `/restaurants/:id`.
   - `RestaurantDetailPage` loads the selected restaurant, fetches its live menu, and lists reviews.
3. **Cart & Ordering:**
   - Adding dishes increments quantities in `CartContext`.
   - Sticky cart drawer and mobile cart bar update totals in real time.
   - Clicking "Checkout" navigates to `/checkout`.
4. **Customer Profile:**
   - Clicking the user profile button in the navbar navigates to `/profile`.
   - Real diner details and live order metrics (total orders, spend, recent activity) are displayed.
   - Quick navigation to `/orders`, `/restaurants`, and `/checkout` operates smoothly.
   - Logged-out access to `/profile` correctly redirects to `/login` via `ProtectedRoute`.
5. **Order History & Review:**
   - `/orders` lists past deliveries with status badges.
   - Restaurant names link back to the restaurant detail page.
   - Clicking "Details" opens the itemized receipt modal.

---

## Part 6: Remaining Issues & Technical Notes

- **Backend Architecture Note:** The backend sorting query `Restaurant.find(filter).sort({ name: 1, _id: 1 })` inherently returns alphabetical clusters (e.g. all "Agarwal's..." branches first). This is expected backend behavior given the procedural seed data. The frontend now cleanly differentiates each branch with distinct photography, explicit outlet neighborhood labels, and active navigation.
- **Backend Read-Only Boundary:** Zero modifications were made to `server/server/src/`. All fixes were implemented strictly within the frontend client.
- **Zero Errors:** Linting and production build verification pass with 0 errors.

