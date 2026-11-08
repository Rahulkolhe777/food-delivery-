# Architecture Audit & Refactoring Blueprint
**Project:** FoodHub Food-Ordering Platform (Frontend)  
**Author:** Principal Frontend Architect  
**Date:** November 2026  
**Target:** `client/`  
**Status:** Audit Complete — Pending Approval Before Code Changes  

---

## 1. Executive Summary

A comprehensive architectural inspection of the entire `client/` codebase was conducted. The application is built on **React 19**, **Vite 8**, **Tailwind CSS 3**, and **TanStack Query 5**, backed by an Express/MongoDB REST API.

While the user-facing functionality and visual design (editorial culinary theme) are complete and operational, the internal codebase suffers from severe **architectural debt**, **monolithic page components**, **mixed responsibilities**, **service layer fragmentation**, and **zero code-splitting**.

### Key High-Level Findings:
1. **13 files exceed 300 lines**, with 4 monolithic pages approaching 1,000 lines each (`OwnerOrdersPage` 981L, `OwnerMenuPage` 977L, `OwnerRestaurantsPage` 947L, `RestaurantDetailPage` 935L).
2. **Bundle Bloat:** All 14 pages are statically imported into `App.jsx`, compiling into a single monolithic **1,340 kB** JavaScript bundle. Visiting `/` or `/login` downloads the entirety of Recharts, owner dashboard tables, analytics pipelines, and modals.
3. **"God Service" Anti-Pattern:** [`src/services/restaurant.service.js`](file:///c:/Users/Rahul/OneDrive/Desktop/cohort3.0/Backend%F0%9F%A5%B3/DB-optimization(Zomato)/client/src/services/restaurant.service.js) has become a 137-line catch-all containing restaurant CRUD, menu item CRUD, customer reviews, owner orders, revenue analytics, customer lifetime value, and top dishes.
4. **Bypassed Query Key Factories:** [`src/lib/queryKeys.js`](file:///c:/Users/Rahul/OneDrive/Desktop/cohort3.0/Backend%F0%9F%A5%B3/DB-optimization(Zomato)/client/src/lib/queryKeys.js) defines a centralized query key factory, but almost every page creates ad-hoc, hardcoded string arrays (e.g. `['owner', 'orders', selectedId, ...]`), resulting in cache invalidation drift and lack of type safety.
5. **Significant Code Duplication:**
   - Unsplash cuisine image maps are copy-pasted across 3 separate files (`CustomerHome.jsx`, `RestaurantsPage.jsx`, `RestaurantDetailPage.jsx`).
   - `CreateRestaurantModal` and `EditRestaurantModal` in `OwnerRestaurantsPage.jsx` copy-paste 150+ lines of identical form markup.
   - Dual-view rendering (Table vs Cards) in `OwnerOrdersPage.jsx` and `OwnerMenuPage.jsx` duplicates business logic, formatting, and action triggers.
6. **Dead Code & Leftover Templates:** [`src/App.css`](file:///c:/Users/Rahul/OneDrive/Desktop/cohort3.0/Backend%F0%9F%A5%B3/DB-optimization(Zomato)/client/src/App.css) (184 lines of Vite starter CSS) and [`src/tokens/index.js`](file:///c:/Users/Rahul/OneDrive/Desktop/cohort3.0/Backend%F0%9F%A5%B3/DB-optimization(Zomato)/client/src/tokens/index.js) (83 lines) are completely unreferenced.

---

## 2. Oversized Files Audit (> 300 Lines)

The following table details all 13 oversized files, their exact line counts, and the specific anti-patterns identified:

| Rank | File Path | Line Count | Primary Anti-Patterns & Mixed Responsibilities |
|---|---|:---:|---|
| 1 | `src/pages/owner/OwnerOrdersPage.jsx` | **981** | Merges 8 responsibilities: KPI metrics calculation, tab count filtering, data table view, kitchen cards view, order details modal, itemized bill calculation, status state-machine action buttons, and 2 confirmation dialogs. |
| 2 | `src/pages/owner/OwnerMenuPage.jsx` | **977** | Merges catalog KPI metrics, live category extractions, horizontal category pill navigation, dense data table view, visual card grid view, full React Hook Form + Zod creation/editing modal, and cascading delete confirmation. |
| 3 | `src/pages/owner/OwnerRestaurantsPage.jsx` | **947** | Contains inline sub-component `RestaurantManagementCard` performing independent queries per card; copy-pastes 150 lines of duplicate form JSX between Create and Edit modals; embeds full location inspector and delete confirmation. |
| 4 | `src/pages/customer/RestaurantDetailPage.jsx` | **935** | Hardcodes atmospheric photo resolvers; mixes restaurant hero display, sticky category navigation, menu search/dietary filter, category dish listing, floating cart sidebar, cart conflict replacement dialog, and customer review list with pagination. |
| 5 | `src/pages/owner/OwnerAnalyticsPage.jsx` | **680** | Combines custom date range picker controls, 5 KPI summaries, Recharts Area & Bar daily revenue trends, Recharts Donut order distribution, VIP customer LTV table, and 501 stub inspection callout. |
| 6 | `src/pages/customer/CustomerOrdersPage.jsx` | **678** | Mixes customer order timeline cards, order details inspector, review submission modal (with star selector & comment textarea), and order receipt preview in a single file. |
| 7 | `src/pages/customer/CheckoutPage.jsx` | **637** | Bundles cart item list with quantity controls, fee calculations (subtotal, delivery fee, taxes), delivery address form with plain `useState` validation, payment method selector, order submission mutation, and post-order confirmation view. |
| 8 | `src/pages/owner/OwnerDashboard.jsx` | **620** | Executive dashboard that independently queries revenue, orders, and top customers; renders 4 KPI cards, Recharts 7-day revenue area chart, Recharts donut status breakdown, kitchen order queue table, and VIP diner leaderboard. |
| 9 | `src/showcase/DesignShowcase.jsx` | **593** | Monolithic design system gallery demonstrating typography, buttons, inputs, dialogs, cards, and states. (Low refactoring priority, but can be lazy loaded). |
| 10 | `src/pages/customer/RestaurantsPage.jsx` | **490** | Contains city selector dropdown, duplicate cuisine image map, client-side cuisine/status filtering on paginated data, responsive restaurant grid, and pagination controls. |
| 11 | `src/pages/owner/OwnerReviewsPage.jsx` | **461** | Merges customer review feed cards, rating distribution bar charts calculation (5-star down to 1-star), star filter pills, review comment search, review inspector dialog, and pagination. |
| 12 | `src/pages/customer/CustomerHome.jsx` | **399** | Hero banner with search, location dropdown, category horizontal carousel with hardcoded Unsplash images, featured restaurant list, and promotional banners. |
| 13 | `src/layouts/OwnerLayout.jsx` | **317** | Layout component that also defines `OwnerHeader`, desktop collapsible sidebar, mobile drawer, restaurant switcher dropdown, and live kitchen pause/open toggle button. |

---

## 3. API Integration & Service Layer Audit

### 3.1 Backend Controller vs. Frontend Service Mapping

A line-by-line audit comparing backend controllers against frontend API services:

```
┌───────────────────────────────────────────────┬────────────────────────────────────────────┬─────────────────────────────┐
│ Backend Endpoint (Route & Controller)         │ Frontend Service Function                  │ Audit Status & Defect       │
├───────────────────────────────────────────────┼────────────────────────────────────────────┼─────────────────────────────┤
│ POST   /api/auth/register                     │ auth.service.js -> register                │ Clean                       │
│ POST   /api/auth/login                        │ auth.service.js -> login                   │ Clean                       │
│ POST   /api/auth/refresh                      │ auth.service.js -> refreshToken            │ Clean                       │
│ POST   /api/auth/logout                       │ auth.service.js -> logout                  │ Clean                       │
│ GET    /api/auth/me                           │ auth.service.js -> getMe                   │ Clean (rarely used)         │
│ GET    /api/restaurants?city=&page=&limit=    │ restaurant.service.js -> getRestaurants    │ Clean                       │
│ GET    /api/restaurants/:id                   │ restaurant.service.js -> getRestaurantById │ Clean                       │
│ POST   /api/restaurants                       │ restaurant.service.js -> createRestaurant  │ Clean                       │
│ PATCH  /api/restaurants/:id                   │ restaurant.service.js -> updateRestaurant  │ Clean                       │
│ DELETE /api/restaurants/:id                   │ restaurant.service.js -> deleteRestaurant  │ Clean                       │
│ GET    /api/restaurants/:id/menu              │ restaurant.service.js -> getMenu           │ MISPLACED: Belongs in Menu  │
│ POST   /api/restaurants/:id/menu              │ restaurant.service.js -> createMenuItem    │ MISPLACED: Belongs in Menu  │
│ PATCH  /api/restaurants/:id/menu/:itemId      │ restaurant.service.js -> updateMenuItem    │ MISPLACED: Belongs in Menu  │
│ DELETE /api/restaurants/:id/menu/:itemId      │ restaurant.service.js -> deleteMenuItem    │ MISPLACED: Belongs in Menu  │
│ POST   /api/orders                            │ order.service.js -> createOrder            │ Clean                       │
│ GET    /api/orders/my?page=&limit=            │ order.service.js -> getMyOrders            │ Clean                       │
│ PATCH  /api/orders/:id/status                 │ order.service.js -> updateOrderStatus      │ Clean                       │
│ GET    /api/restaurants/:id/orders            │ restaurant.service.js -> getRestaurantOrders│ MISPLACED: Belongs in Order │
│ POST   /api/reviews                           │ review.service.js -> createReview          │ Clean                       │
│ GET    /api/restaurants/:id/reviews           │ restaurant.service.js -> getRestaurantReviews│ MISPLACED: Belongs in Review│
│ GET    /api/restaurants/:id/revenue           │ restaurant.service.js -> getRestaurantRevenue│ MISPLACED: Belongs in Analytics│
│ GET    /api/restaurants/:id/top-customers     │ restaurant.service.js -> getTopCustomers   │ MISPLACED: Belongs in Analytics│
│ GET    /api/analytics/restaurants/:id/top-dishes│ restaurant.service.js -> getTopDishes    │ MISPLACED: Belongs in Analytics│
└───────────────────────────────────────────────┴────────────────────────────────────────────┴─────────────────────────────┘
```

### 3.2 Key Service Layer Deficiencies:
1. **Service Fragmentation & Misplacement:**
   - Review functions are split: `createReview` is in `review.service.js`, but `getRestaurantReviews` is inside `restaurant.service.js`.
   - Order functions are split: Customer operations and mutations are in `order.service.js`, but owner order queue retrieval is inside `restaurant.service.js`.
   - Menu item operations are entirely absent from their own domain, buried in `restaurant.service.js`.
   - Analytics aggregations are mixed into `restaurant.service.js` instead of a dedicated `analytics.service.js`.
2. **TanStack Query Key Disconnect:**
   - Centralized factory [`queryKeys.js`](file:///c:/Users/Rahul/OneDrive/Desktop/cohort3.0/Backend%F0%9F%A5%B3/DB-optimization(Zomato)/client/src/lib/queryKeys.js) is ignored by almost every page.
   - Example from `OwnerMenuPage.jsx`:
     ```javascript
     // Current ad-hoc key:
     queryKey: ['owner', 'menu', selectedId]
     // Defined factory key in queryKeys.js:
     queryKeys.menu.all(selectedId) // -> ['menu', selectedId, {}]
     ```
     Because keys differ, invalidations like `queryClient.invalidateQueries({ queryKey: queryKeys.menu.all(id) })` fail to trigger re-fetches on components using the ad-hoc key.
3. **Backend 501 Stubs Transparency:**
   - Endpoints `/api/analytics/restaurants/:id/top-dishes`, `/api/restaurants/search`, and `/api/restaurants/nearby` return `501 Not Implemented Yet`.
   - Components must never attempt to mock these with fake data; the service layer should explicitly document and gracefully type these stub endpoints.

---

## 4. State Management Audit

### 4.1 State Categorization & Boundary Matrix

The application handles 5 distinct types of state. The audit evaluated whether the proper tool is being used for each:

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┬────────────────────────────────────────────────────────┐
│ State Category   │ Current Implementation   │ Evaluated Boundary          │ Audit Recommendation                                   │
├──────────────────┼──────────────────────────┼─────────────────────────────┼────────────────────────────────────────────────────────┤
│ Server State     │ TanStack Query           │ Correct tool chosen         │ Retain TanStack Query. Standardize all query keys via   │
│                  │                          │                             │ unified queryKeys factory.                             │
├──────────────────┼──────────────────────────┼─────────────────────────────┼────────────────────────────────────────────────────────┤
│ Auth State       │ authStore.js (in-memory) │ In-memory token + session   │ Retain separation for XSS protection. Eliminate the     │
│                  │ + AuthContext.jsx        │ storage + React Context     │ dual user-profile storage sync drift.                  │
├──────────────────┼──────────────────────────┼─────────────────────────────┼────────────────────────────────────────────────────────┤
│ Cart State       │ CartContext.jsx          │ useReducer in React Context │ Missing persistence. Wrap reducer in a lightweight     │
│                  │                          │                             │ sessionStorage sync so page refreshes don't wipe cart. │
├──────────────────┼──────────────────────────┼─────────────────────────────┼────────────────────────────────────────────────────────┤
│ Owner Context    │ OwnerRestaurantContext   │ Context + useState +        │ Correctly scoped to OwnerLayout. Keep seeded defaults  │
│                  │                          │ localStorage                │ fallback since backend lacks GET /restaurants?owner=me.│
├──────────────────┼──────────────────────────┼─────────────────────────────┼────────────────────────────────────────────────────────┤
│ UI & Toast State │ ToastContext.jsx + local │ Context for global toasts,  │ Clean and decoupled. Keep component-local states for   │
│                  │ useState                 │ local useState for modals   │ modals, tabs, and filters.                             │
├──────────────────┼──────────────────────────┼─────────────────────────────┼────────────────────────────────────────────────────────┤
│ Form State       │ Mixed (RHF + Zod vs      │ Inconsistent                │ Standardize Checkout and Reviews to React Hook Form    │
│                  │ plain useState)          │                             │ + Zod schemas for parity with Auth & Menu.             │
└──────────────────┴──────────────────────────┴─────────────────────────────┴────────────────────────────────────────────────────────┘
```

### 4.2 State Management Detailed Findings:
1. **Cart Volatility:** In [`CartContext.jsx`](file:///c:/Users/Rahul/OneDrive/Desktop/cohort3.0/Backend%F0%9F%A5%B3/DB-optimization(Zomato)/client/src/context/CartContext.jsx), cart items are held purely in React `useReducer` memory. If a customer adds dishes on `RestaurantDetailPage` and presses browser refresh or navigates to `/checkout`, the cart is completely lost. Initializing `cartReducer` from `sessionStorage` fixes this without adding external dependencies.
2. **Auth Token & User Redundancy:**
   - [`src/store/authStore.js`](file:///c:/Users/Rahul/OneDrive/Desktop/cohort3.0/Backend%F0%9F%A5%B3/DB-optimization(Zomato)/client/src/store/authStore.js) holds `_accessToken` in memory (essential for security).
   - Both `authStore.js` and `AuthContext.jsx` manage copies of `user`. Calling `storeUser(profile)` in `authStore.js` and `setUser(profile)` in `AuthContext.jsx` is duplicative. A clean single source of truth in `AuthContext` referencing `authStore` getters/setters should be enforced.
3. **No External State Library Needed:** The combination of **TanStack Query** (server cache) + **React Context** (Cart, Auth, Owner Selection, Toasts) is well suited for this application. Introducing Zustand or Redux would add unnecessary overhead and risk breaking existing working flows.

---

## 5. Component Duplication & Code Smells

### 5.1 Duplicated Cuisine Photography Mapping
The exact same mapping of cuisine names to Unsplash imagery appears in three places:
- [`src/pages/customer/CustomerHome.jsx`](file:///c:/Users/Rahul/OneDrive/Desktop/cohort3.0/Backend%F0%9F%A5%B3/DB-optimization(Zomato)/client/src/pages/customer/CustomerHome.jsx) (lines 14–38)
- [`src/pages/customer/RestaurantsPage.jsx`](file:///c:/Users/Rahul/OneDrive/Desktop/cohort3.0/Backend%F0%9F%A5%B3/DB-optimization(Zomato)/client/src/pages/customer/RestaurantsPage.jsx) (lines 51–72)
- [`src/pages/customer/RestaurantDetailPage.jsx`](file:///c:/Users/Rahul/OneDrive/Desktop/cohort3.0/Backend%F0%9F%A5%B3/DB-optimization(Zomato)/client/src/pages/customer/RestaurantDetailPage.jsx) (lines 48–78)

**Solution:** Consolidate into a single utility module: `src/lib/cuisineImages.js`.

### 5.2 Duplicated Restaurant Form Dialogs
In [`src/pages/owner/OwnerRestaurantsPage.jsx`](file:///c:/Users/Rahul/OneDrive/Desktop/cohort3.0/Backend%F0%9F%A5%B3/DB-optimization(Zomato)/client/src/pages/owner/OwnerRestaurantsPage.jsx):
- Lines 538–730 define `CreateRestaurantModal`.
- Lines 732–910 define `EditRestaurantModal`.
Both render identical city options, coordinate auto-fillers, cuisine selector checkboxes, and input styling.
**Solution:** Consolidate into a single reusable `RestaurantFormDialog` component.

### 5.3 Duplicated Order Summary & Item Billing
- `OwnerOrdersPage.jsx` renders an itemized bill table in its details modal.
- `CustomerOrdersPage.jsx` renders an itemized order receipt in its modal.
- `CheckoutPage.jsx` renders an itemized breakdown.
**Solution:** Extract a reusable `OrderItemBill` component.

### 5.4 Dead & Zombie Files
- [`src/App.css`](file:///c:/Users/Rahul/OneDrive/Desktop/cohort3.0/Backend%F0%9F%A5%B3/DB-optimization(Zomato)/client/src/App.css) (184 lines): Default Vite counter & logo starter styles. Not imported anywhere. Safe for removal.
- [`src/tokens/index.js`](file:///c:/Users/Rahul/OneDrive/Desktop/cohort3.0/Backend%F0%9F%A5%B3/DB-optimization(Zomato)/client/src/tokens/index.js) (83 lines): Duplicate JS color tokens not imported anywhere (Tailwind uses `tailwind.config.js`). Safe for removal.
- [`src/components/ui/ErrorMessage.jsx`](file:///c:/Users/Rahul/OneDrive/Desktop/cohort3.0/Backend%F0%9F%A5%B3/DB-optimization(Zomato)/client/src/components/ui/ErrorMessage.jsx) & [`src/components/ui/Modal.jsx`](file:///c:/Users/Rahul/OneDrive/Desktop/cohort3.0/Backend%F0%9F%A5%B3/DB-optimization(Zomato)/client/src/components/ui/Modal.jsx): Unused 3-line re-export alias files.

---

## 6. Code Splitting & Performance Audit

Currently, [`src/App.jsx`](file:///c:/Users/Rahul/OneDrive/Desktop/cohort3.0/Backend%F0%9F%A5%B3/DB-optimization(Zomato)/client/src/App.jsx) statically imports all 14 pages:

```javascript
// App.jsx (Current static imports)
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import CustomerHome from '@/pages/customer/CustomerHome';
import RestaurantDetailPage from '@/pages/customer/RestaurantDetailPage';
import RestaurantsPage from '@/pages/customer/RestaurantsPage';
import CheckoutPage from '@/pages/customer/CheckoutPage';
import CustomerOrdersPage from '@/pages/customer/CustomerOrdersPage';
import OwnerDashboard from '@/pages/owner/OwnerDashboard';
import OwnerRestaurantsPage from '@/pages/owner/OwnerRestaurantsPage';
import OwnerOrdersPage from '@/pages/owner/OwnerOrdersPage';
import OwnerMenuPage from '@/pages/owner/OwnerMenuPage';
import OwnerAnalyticsPage from '@/pages/owner/OwnerAnalyticsPage';
import OwnerReviewsPage from '@/pages/owner/OwnerReviewsPage';
import OwnerSettingsPage from '@/pages/owner/OwnerSettingsPage';
import DesignShowcase from '@/showcase/DesignShowcase';
```

**Build Impact:**
- `dist/assets/index-*.js`: **1,340.73 kB** (gzip: 379 kB).
- Vite emits warning: `(!) Some chunks are larger than 500 kB after minification.`
- A customer arriving at `/` downloads all Recharts library code, Lucide icons, owner dashboard tables, and owner settings modals.

**Solution:** Implement route-level code splitting using `React.lazy()` with a `<Suspense fallback={<PageLoader />}>` boundary. This will break the 1.34 MB bundle into distinct chunks:
- Core runtime + customer bundle (~280 kB)
- Owner portal + Recharts bundle (~450 kB, downloaded only when navigating to `/owner`)
- Design showcase bundle (~120 kB, downloaded only on `/showcase`)

---

## 7. Proposed Target Folder Structure

We propose restructuring the code using a **domain-driven, feature-sliced layout** without modifying external URLs or breaking existing imports.

```
client/src/
├── api/                       # Consolidated HTTP & client config
│   ├── axios.js               # Centralized Axios instance with refresh interceptor
│   └── queryClient.js         # TanStack Query client configuration
│
├── services/                  # Domain-aligned API services (1:1 with backend controllers)
│   ├── auth.service.js        # /api/auth/*
│   ├── restaurant.service.js  # /api/restaurants (Listing & CRUD)
│   ├── menu.service.js        # /api/restaurants/:id/menu/* (NEW: isolated from restaurant.service)
│   ├── order.service.js       # /api/orders/* & /api/restaurants/:id/orders (NEW: unified)
│   ├── review.service.js      # /api/reviews & /api/restaurants/:id/reviews (NEW: unified)
│   └── analytics.service.js   # /api/restaurants/:id/revenue & /top-customers (NEW: isolated)
│
├── lib/                       # Pure utilities, constants & query keys
│   ├── utils.js               # cn, formatCurrency, formatDateTime, timeAgo
│   ├── queryKeys.js           # Standardized TanStack Query key factories
│   └── cuisineImages.js       # (NEW: Single source of truth for cuisine photography)
│
├── context/                   # Global React contexts
│   ├── AuthContext.jsx        # User session & token state
│   ├── CartContext.jsx        # Shopping cart (with sessionStorage persistence)
│   ├── OwnerRestaurantContext.jsx # Selected restaurant for owner portal
│   └── ToastContext.jsx       # Global notification toasts
│
├── validations/               # Zod validation schemas
│   ├── auth.schema.js         # Login & Register
│   ├── restaurant.schema.js   # Create / Edit restaurant
│   ├── menuItem.schema.js     # Create / Edit menu item
│   ├── checkout.schema.js     # (NEW: Checkout address validation)
│   └── review.schema.js       # (NEW: Rating & review validation)
│
├── components/
│   ├── ui/                    # Primitive design system components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Select.jsx
│   │   ├── Table.jsx
│   │   ├── Dialog.jsx
│   │   ├── ConfirmDialog.jsx
│   │   ├── Badge.jsx
│   │   ├── Avatar.jsx
│   │   ├── Pagination.jsx
│   │   ├── EmptyState.jsx
│   │   ├── ErrorState.jsx
│   │   ├── Skeleton.jsx
│   │   └── ...
│   │
│   ├── food/                  # Shared culinary domain components
│   │   ├── RestaurantCard.jsx
│   │   ├── FoodCard.jsx
│   │   ├── DietaryIndicator.jsx
│   │   ├── OrderStatusBadge.jsx
│   │   ├── RatingStars.jsx
│   │   └── OrderItemBill.jsx  # (NEW: Reusable itemized bill table)
│   │
│   └── routing/               # Route guard wrappers
│       ├── ProtectedRoute.jsx
│       └── GuestRoute.jsx
│
├── layouts/                   # Layout wrappers
│   ├── CustomerLayout.jsx
│   ├── OwnerLayout.jsx
│   └── AuthLayout.jsx
│
└── pages/                     # Orchestrator pages (decomposed into sub-components)
    ├── auth/
    │   ├── LoginPage.jsx
    │   └── RegisterPage.jsx
    │
    ├── customer/
    │   ├── CustomerHome.jsx
    │   ├── RestaurantsPage.jsx
    │   ├── RestaurantDetailPage/ # (DECOMPOSED: Hero, MenuGrid, ReviewsList, StickyCart)
    │   ├── CheckoutPage/         # (DECOMPOSED: CartReview, DeliveryForm, OrderSummary)
    │   └── CustomerOrdersPage/   # (DECOMPOSED: OrderCard, OrderDetailModal, ReviewModal)
    │
    └── owner/
        ├── OwnerDashboard/       # (DECOMPOSED: KpiGrid, RevenueChart, StatusDonut, TopCustomers)
        ├── OwnerRestaurantsPage/ # (DECOMPOSED: RestaurantCard, RestaurantFormDialog, InspectorModal)
        ├── OwnerMenuPage/        # (DECOMPOSED: MenuKpiBar, MenuTable, MenuGrid, DishFormDialog)
        ├── OwnerOrdersPage/      # (DECOMPOSED: OrderKpiBar, OrdersTable, OrderCards, OrderDetailModal)
        ├── OwnerAnalyticsPage/   # (DECOMPOSED: RevenueSection, StatusSection, VipTable, TopDishesNotice)
        ├── OwnerReviewsPage/     # (DECOMPOSED: RatingDistribution, ReviewFeed, ReviewDetailModal)
        └── OwnerSettingsPage.jsx
```

---

## 8. Exact Refactoring Sequence (Phased Roadmap)

To guarantee **zero downtime**, **zero regressions**, and preserve all working functionality, the refactoring must be executed in 5 strict sequential phases:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ PHASE 1: Service Layer & Query Key Unification (Zero UI Impact)                       │
│ 1. Extract menu.service.js, analytics.service.js from restaurant.service.js.           │
│ 2. Unify review.service.js (add getRestaurantReviews).                                 │
│ 3. Unify order.service.js (add getRestaurantOrders).                                   │
│ 4. Update queryKeys.js to match all endpoints.                                         │
│ 5. Keep backward-compatible re-exports in restaurant.service.js so no page breaks.    │
└───────────────────────────────────┬────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ PHASE 2: Shared Domain Constants & Components Extraction                               │
│ 1. Create src/lib/cuisineImages.js (centralize Unsplash maps).                         │
│ 2. Create src/components/food/OrderItemBill.jsx (reusable itemized receipt table).     │
│ 3. Add cart persistence in CartContext.jsx (sessionStorage sync).                      │
│ 4. Add checkout.schema.js and review.schema.js.                                        │
│ 5. Clean dead files (App.css, tokens/index.js).                                        │
└───────────────────────────────────┬────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ PHASE 3: Code Splitting & Route Optimization                                           │
│ 1. Convert static page imports in App.jsx to React.lazy().                             │
│ 2. Wrap routes in Suspense with PageLoader fallback.                                   │
│ 3. Verify bundle splits in Vite build output (target: core chunk < 400 kB).            │
└───────────────────────────────────┬────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ PHASE 4: Customer Pages Decomposition                                                  │
│ 1. Decompose RestaurantDetailPage.jsx (935L -> ~200L orchestrator + 4 subcomponents).   │
│ 2. Decompose CheckoutPage.jsx (637L -> ~180L orchestrator + 3 subcomponents).          │
│ 3. Decompose CustomerOrdersPage.jsx (678L -> ~190L orchestrator + 3 subcomponents).    │
│ 4. Decompose RestaurantsPage.jsx (490L -> ~180L orchestrator).                         │
└───────────────────────────────────┬────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ PHASE 5: Owner Portal Monoliths Decomposition                                          │
│ 1. Decompose OwnerOrdersPage.jsx (981L -> ~190L orchestrator + Table/Cards/Modal).    │
│ 2. Decompose OwnerMenuPage.jsx (977L -> ~180L orchestrator + Table/Grid/DishDialog).   │
│ 3. Decompose OwnerRestaurantsPage.jsx (947L -> ~170L orchestrator + UnifiedDialog).   │
│ 4. Decompose OwnerAnalyticsPage.jsx (680L -> ~180L orchestrator + Charts/VipTable).   │
│ 5. Decompose OwnerDashboard.jsx (620L -> ~160L orchestrator).                          │
│ 6. Decompose OwnerReviewsPage.jsx (461L -> ~160L orchestrator + Distribution/Feed).    │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Risk Assessment & Mitigation

| Risk | Likelihood | Impact | Mitigation Strategy |
|---|:---:|:---:|---|
| **Query Cache Invalidation Misses** | Medium | High | Maintain backward-compatible query keys during migration; test that mutating menu items or order statuses immediately reflects in TanStack Query devtools without manual page reload. |
| **Auth & Refresh Token De-sync** | Low | Critical | Leave `authStore.js` and `api.js` Axios request/response interceptors completely intact; only clean up consumer hook bindings. |
| **Cart State Loss During Refactor** | Low | High | Do not change action types or signatures of `useCart()`; add non-intrusive `sessionStorage` hydration on reducer initialization. |
| **Modal / Dialog State Glitches** | Medium | Medium | Keep dialog visibility state (`isOpen`) controlled by the orchestrator page; pass item data as explicit props to dialog components. |
| **CSS / Layout Drift** | Low | Low | Only extract JSX into sub-components with the exact same Tailwind utility classes; do not alter wrapper container hierarchy. |

---

## 10. Testing & Verification Strategy

After each phase, execute the following verification steps:
1. **Compilation & Bundle Verification:**
   - Execute `npm run build` in `client/` to verify zero compile errors, correct chunk splitting, and valid syntax.
2. **Customer Portal Regression Checklist:**
   - [ ] Visit `/` (Customer Home) -> verify cuisine carousel and restaurant list render.
   - [ ] Visit `/restaurants` -> test city filter and cuisine pills.
   - [ ] Visit `/restaurants/:id` -> add dish to cart, test cross-restaurant replace dialog, verify reviews list.
   - [ ] Visit `/checkout` -> verify items, change quantity, place COD order.
   - [ ] Visit `/orders` -> verify newly placed order appears, inspect order receipt modal.
3. **Owner Portal Regression Checklist:**
   - [ ] Login as `owner@foodhub.com` -> visit `/owner`.
   - [ ] Test restaurant switcher dropdown in top bar -> verify all charts update to selected restaurant.
   - [ ] Visit `/owner/restaurants` -> test Open/Closed kitchen toggle, test Create/Edit dialog.
   - [ ] Visit `/owner/menu` -> toggle dish In Stock / Sold Out, test Add Dish dialog, test Delete dish.
   - [ ] Visit `/owner/orders` -> verify state machine: transition `placed` -> `preparing` -> `delivered`, verify reject dialog.
   - [ ] Visit `/owner/analytics` -> test 7D / 14D / 30D date range pills, verify Recharts revenue curve and VIP table.
   - [ ] Visit `/owner/reviews` -> verify star distribution bars and paginated review feed.

---

## 11. Approval Request

Per strict pair-programming rules:
- **No code files have been modified or deleted during this audit.**
- **No backend files were touched.**
- **No dummy data was introduced.**

Please review this audit report. Once you approve the proposed folder structure and phased sequence, we will proceed with **Phase 1 (Service Layer & Query Key Unification)**.

