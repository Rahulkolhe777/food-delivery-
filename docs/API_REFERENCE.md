# FoodHub Complete API Reference

This document provides the definitive, production-level API reference for the FoodHub backend. Every endpoint, parameter, payload structure, header, and response schema is documented below based on direct source-code inspection.

---

## 1. Global Specifications

- **Base URL**: `http://localhost:3000` (or `http://localhost:${PORT}`)
- **Default Content-Type**: `application/json`
- **Authentication**: Sent in header as `Authorization: Bearer <accessToken>`
- **Refresh Token Transport**: Transmitted automatically by browser as an `httpOnly` cookie (`path: /api/auth`)
- **Pagination Standard**: Default query params `?page=1&limit=10` (maximum limit: 50)
- **Standard Success Format**: JSON body
- **Standard Error Format**:
  ```json
  {
    "message": "Detailed error message",
    "errors": ["Validation field error"] // optional array for Mongoose ValidationError
  }
  ```

---

## 2. Route Registration Architecture

In `src/app.js`, routers are registered in the following sequence:

```javascript
app.use("/api/auth", authRoutes);
app.use("/api", analyticsRoutes);          // Must precede restaurantRoutes to prevent /search collision
app.use("/api/restaurants", restaurantRoutes); // Contains restaurants, menu CRUD, restaurant orders, reviews, revenue
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
```

> [!IMPORTANT]
> **Menu Routes Note**: There is **no** `menu.routes.js` file. Menu CRUD routes are sub-routes mounted directly inside `src/routes/restaurant.routes.js` as `/api/restaurants/:id/menu...`.

---

## 3. Authentication Endpoints (`/api/auth`)

### 3.1 Register User
- **Method & Path**: `POST /api/auth/register`
- **Access**: Public
- **Request Body**:
  | Field | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `name` | `string` | Yes | User's full name |
  | `email` | `string` | Yes | Normalized to lowercase & trimmed |
  | `password` | `string` | Yes | Minimum 6 characters |
  | `role` | `string` | No | `"customer"` (default) or `"owner"` |
  | `city` | `string` | No | Residential city (e.g. `"Bhopal"`) |

- **Success Response (`201 Created`)**:
  - Sets Cookie: `refreshToken` (`httpOnly`, `path=/api/auth`, `sameSite=strict`)
  ```json
  {
    "message": "Registered successfully",
    "user": {
      "id": "67236b280100000000000001",
      "name": "Rahul Verma",
      "email": "rahul@example.com",
      "role": "customer",
      "city": "Bhopal",
      "createdAt": "2026-10-31T10:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Error Codes**:
  - `400 Bad Request`: `{ "message": "name, email and password are required" }`
  - `400 Bad Request`: `{ "message": "Password must be at least 6 characters" }`
  - `400 Bad Request`: `{ "message": "role must be customer or owner" }`
  - `409 Conflict`: `{ "message": "Email is already registered" }`

---

### 3.2 Login
- **Method & Path**: `POST /api/auth/login`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "owner@foodhub.com",
    "password": "password123"
  }
  ```
- **Success Response (`200 OK`)**:
  - Sets Cookie: `refreshToken` (`httpOnly`, `path=/api/auth`, `sameSite=strict`)
  ```json
  {
    "message": "Logged in successfully",
    "user": {
      "id": "67236b280100000000000002",
      "name": "Demo Owner",
      "email": "owner@foodhub.com",
      "role": "owner",
      "city": "Bhopal",
      "createdAt": "2026-10-31T10:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Error Codes**:
  - `400 Bad Request`: `{ "message": "email and password are required" }`
  - `401 Unauthorized`: `{ "message": "Invalid email or password" }`

---

### 3.3 Refresh Token
- **Method & Path**: `POST /api/auth/refresh`
- **Access**: Public (Requires valid `refreshToken` HttpOnly cookie)
- **Request Body**: Empty
- **Success Response (`200 OK`)**:
  - Overwrites Cookie: new rotated `refreshToken`
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Error Codes**:
  - `401 Unauthorized`: `{ "message": "Refresh token missing" }` (clears cookie)
  - `401 Unauthorized`: `{ "message": "Invalid or expired refresh token" }` (clears cookie)
  - `401 Unauthorized`: `{ "message": "Invalid refresh token" }` (clears cookie)

---

### 3.4 Logout
- **Method & Path**: `POST /api/auth/logout`
- **Access**: Public (Cookie-based)
- **Success Response (`200 OK`)**:
  - Clears `refreshToken` in DB and clears cookie in browser.
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

---

### 3.5 Current User Profile
- **Method & Path**: `GET /api/auth/me`
- **Access**: Authenticated (`authUser`)
- **Headers**: `Authorization: Bearer <accessToken>`
- **Success Response (`200 OK`)**:
  ```json
  {
    "user": {
      "id": "67236b280100000000000001",
      "name": "Rahul Verma",
      "email": "rahul@example.com",
      "role": "customer",
      "city": "Bhopal",
      "createdAt": "2026-10-31T10:00:00.000Z"
    }
  }
  ```
- **Error Codes**:
  - `401 Unauthorized`: `{ "message": "Access token missing" | "Access token expired" | "Invalid access token" }`
  - `404 Not Found`: `{ "message": "User not found" }`

---

## 4. Restaurant Endpoints (`/api/restaurants`)

### 4.1 List Restaurants
- **Method & Path**: `GET /api/restaurants`
- **Access**: Public
- **Query Parameters**:
  | Param | Type | Default | Description |
  | :--- | :--- | :--- | :--- |
  | `page` | `number` | `1` | Page index (minimum 1) |
  | `limit` | `number` | `10` | Page size (minimum 1, maximum 50) |
  | `city` | `string` | Optional | Exact match city name filter (e.g. `Bhopal`) |

- **Sorting**: Sorted alphabetically by name, then by `_id` (`{ name: 1, _id: 1 }`).
- **Success Response (`200 OK`)**:
  ```json
  {
    "page": 1,
    "limit": 10,
    "total": 48,
    "totalPages": 5,
    "restaurants": [
      {
        "_id": "67236b280200000000000001",
        "name": "Bhopal Royal Rasoi",
        "owner": "67236b280100000000000002",
        "city": "Bhopal",
        "area": "MP Nagar Zone 1",
        "cuisines": ["North Indian", "Mughlai", "Biryani"],
        "location": {
          "type": "Point",
          "coordinates": [77.4126, 23.2599]
        },
        "isOpen": true,
        "createdAt": "2026-01-10T08:00:00.000Z"
      }
    ]
  }
  ```

---

### 4.2 Get Restaurant Details
- **Method & Path**: `GET /api/restaurants/:id`
- **Access**: Public
- **URL Params**: `:id` — Restaurant MongoDB ObjectId
- **Population**: Populates `owner` field with `{ _id, name }`.
- **Success Response (`200 OK`)**:
  ```json
  {
    "restaurant": {
      "_id": "67236b280200000000000001",
      "name": "Bhopal Royal Rasoi",
      "owner": {
        "_id": "67236b280100000000000002",
        "name": "Demo Owner"
      },
      "city": "Bhopal",
      "area": "MP Nagar Zone 1",
      "cuisines": ["North Indian", "Mughlai", "Biryani"],
      "location": {
        "type": "Point",
        "coordinates": [77.4126, 23.2599]
      },
      "isOpen": true,
      "createdAt": "2026-01-10T08:00:00.000Z"
    }
  }
  ```
- **Error Codes**:
  - `400 Bad Request`: `{ "message": "Invalid id: <value>" }` (CastError)
  - `404 Not Found`: `{ "message": "Restaurant not found" }`

---

### 4.3 Create Restaurant
- **Method & Path**: `POST /api/restaurants`
- **Access**: Owner Only (`authUser`, `authorize("owner")`)
- **Headers**: `Authorization: Bearer <accessToken>`
- **Request Body**:
  ```json
  {
    "name": "The Spice Route",
    "city": "Indore",
    "area": "Vijay Nagar",
    "cuisines": ["North Indian", "Street Food"],
    "lng": 75.8577,
    "lat": 22.7196,
    "isOpen": true
  }
  ```
- **Success Response (`201 Created`)**:
  ```json
  {
    "restaurant": {
      "_id": "67236b280200000000000003",
      "name": "The Spice Route",
      "owner": "67236b280100000000000002",
      "city": "Indore",
      "area": "Vijay Nagar",
      "cuisines": ["North Indian", "Street Food"],
      "location": {
        "type": "Point",
        "coordinates": [75.8577, 22.7196]
      },
      "isOpen": true,
      "createdAt": "2026-10-31T11:00:00.000Z"
    }
  }
  ```
- **Error Codes**:
  - `400 Bad Request`: `{ "message": "Valid lng and lat are required" }` (coordinates must be numbers between -180..180 and -90..90)
  - `403 Forbidden`: `{ "message": "You are not allowed to do this" }`

---

### 4.4 Update Restaurant
- **Method & Path**: `PATCH /api/restaurants/:id`
- **Access**: Owner Only (`authUser`, `authorize("owner")`)
- **Ownership**: Caller must be the restaurant's owner.
- **Updatable Fields**: `name`, `city`, `area`, `cuisines`, `isOpen`, `lng`, `lat` (if coordinates are updated, both `lng` and `lat` must be supplied).
- **Request Body**:
  ```json
  {
    "isOpen": false,
    "area": "Vijay Nagar Scheme 54"
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "restaurant": { ... }
  }
  ```
- **Error Codes**:
  - `403 Forbidden`: `{ "message": "You do not own this restaurant" }`
  - `404 Not Found`: `{ "message": "Restaurant not found" }`

---

### 4.5 Delete Restaurant
- **Method & Path**: `DELETE /api/restaurants/:id`
- **Access**: Owner Only (`authUser`, `authorize("owner")`)
- **Cascading Behavior**: Automatically deletes all associated `MenuItem` documents.
- **Success Response (`200 OK`)**:
  ```json
  {
    "message": "Restaurant deleted"
  }
  ```

---

## 5. Menu Endpoints (Sub-routes of `/api/restaurants`)

### 5.1 Get Restaurant Menu
- **Method & Path**: `GET /api/restaurants/:id/menu`
- **Access**: Public
- **URL Params**: `:id` — Restaurant ObjectId
- **Query Parameters**:
  | Param | Type | Description |
  | :--- | :--- | :--- |
  | `category` | `string` | Filter by category (e.g. `"Starters"`, `"Main Course"`) |
  | `isVeg` | `string` | Filter dietary classification: `"true"` or `"false"` |

- **Sorting**: Sorted by category ascending, then dish name ascending (`{ category: 1, name: 1 }`).
- **Success Response (`200 OK`)**:
  ```json
  {
    "restaurant": {
      "id": "67236b280200000000000001",
      "name": "Bhopal Royal Rasoi"
    },
    "count": 22,
    "menuItems": [
      {
        "_id": "67236b280300000000000001",
        "restaurant": "67236b280200000000000001",
        "name": "Paneer Tikka Angara",
        "category": "Starters",
        "price": 280,
        "isVeg": true,
        "isAvailable": true
      },
      {
        "_id": "67236b280300000000000002",
        "restaurant": "67236b280200000000000001",
        "name": "Murgh Malai Kebab",
        "category": "Starters",
        "price": 360,
        "isVeg": false,
        "isAvailable": true
      }
    ]
  }
  ```

---

### 5.2 Create Menu Item
- **Method & Path**: `POST /api/restaurants/:id/menu`
- **Access**: Owner Only (`authUser`, `authorize("owner")`)
- **Ownership**: User must own restaurant `:id`.
- **Request Body**:
  ```json
  {
    "name": "Dum Biryani Handi",
    "category": "Main Course",
    "price": 340,
    "isVeg": false,
    "isAvailable": true
  }
  ```
- **Success Response (`201 Created`)**:
  ```json
  {
    "menuItem": {
      "_id": "67236b280300000000000099",
      "restaurant": "67236b280200000000000001",
      "name": "Dum Biryani Handi",
      "category": "Main Course",
      "price": 340,
      "isVeg": false,
      "isAvailable": true
    }
  }
  ```

---

### 5.3 Update Menu Item
- **Method & Path**: `PATCH /api/restaurants/:id/menu/:itemId`
- **Access**: Owner Only (`authUser`, `authorize("owner")`)
- **Updatable Fields**: `name`, `category`, `price`, `isVeg`, `isAvailable`
- **Request Body**:
  ```json
  {
    "price": 360,
    "isAvailable": false
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "menuItem": { ... }
  }
  ```
- **Error Codes**:
  - `404 Not Found`: `{ "message": "Menu item not found" }`

---

### 5.4 Delete Menu Item
- **Method & Path**: `DELETE /api/restaurants/:id/menu/:itemId`
- **Access**: Owner Only (`authUser`, `authorize("owner")`)
- **Success Response (`200 OK`)**:
  ```json
  {
    "message": "Menu item deleted"
  }
  ```

---

## 6. Order Endpoints

### 6.1 Place Order (Customer)
- **Method & Path**: `POST /api/orders`
- **Access**: Customer Only (`authUser`, `authorize("customer")`)
- **Headers**: `Authorization: Bearer <accessToken>`
- **Request Body**:
  ```json
  {
    "restaurantId": "67236b280200000000000001",
    "paymentMethod": "upi", // enum: "upi" | "card" | "cod" (default: "cod")
    "items": [
      {
        "menuItemId": "67236b280300000000000001",
        "quantity": 2 // integer from 1 to 20
      }
    ]
  }
  ```
- **Backend Validation & Processing Rules**:
  1. Verifies `restaurantId` exists.
  2. Verifies restaurant is open: `restaurant.isOpen === true`. If closed, returns `400 { message: "Restaurant is closed right now" }`.
  3. Queries all menu items in database; verifies they belong to `restaurantId` and have `isAvailable: true`.
  4. Copies current item name and price from DB into snapshot order item.
  5. Computes total amount server-side: `totalAmount = sum(item.price * item.quantity)`.
  6. Sets initial status to `"placed"`.
- **Success Response (`201 Created`)**:
  ```json
  {
    "order": {
      "_id": "67236b280400000000000001",
      "customer": "67236b280100000000000001",
      "restaurant": "67236b280200000000000001",
      "items": [
        {
          "menuItem": "67236b280300000000000001",
          "name": "Paneer Tikka Angara",
          "price": 280,
          "quantity": 2
        }
      ],
      "totalAmount": 560,
      "paymentMethod": "upi",
      "status": "placed",
      "createdAt": "2026-10-31T12:00:00.000Z"
    }
  }
  ```
- **Error Codes**:
  - `400 Bad Request`: `{ "message": "restaurantId and at least one item are required" }`
  - `400 Bad Request`: `{ "message": "paymentMethod must be upi, card or cod" }`
  - `400 Bad Request`: `{ "message": "Each item needs a menuItemId and a quantity from 1 to 20" }`
  - `400 Bad Request`: `{ "message": "Restaurant is closed right now" }`
  - `400 Bad Request`: `{ "message": "Menu item <id> is not available in this restaurant" }`
  - `404 Not Found`: `{ "message": "Restaurant not found" }`

---

### 6.2 Get Customer Orders (Order History)
- **Method & Path**: `GET /api/orders/my`
- **Access**: Customer Only (`authUser`, `authorize("customer")`)
- **Query Parameters**:
  - `page` (default 1)
  - `limit` (default 10, max 50)
- **Sorting**: Newest first (`{ createdAt: -1 }`).
- **Population**: Populates `restaurant` field with `{ _id, name, city, area }`.
- **Success Response (`200 OK`)**:
  ```json
  {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1,
    "orders": [
      {
        "_id": "67236b280400000000000001",
        "customer": "67236b280100000000000001",
        "restaurant": {
          "_id": "67236b280200000000000001",
          "name": "Bhopal Royal Rasoi",
          "city": "Bhopal",
          "area": "MP Nagar Zone 1"
        },
        "items": [
          {
            "menuItem": "67236b280300000000000001",
            "name": "Paneer Tikka Angara",
            "price": 280,
            "quantity": 2
          }
        ],
        "totalAmount": 560,
        "status": "delivered",
        "paymentMethod": "upi",
        "createdAt": "2026-10-31T12:00:00.000Z"
      }
    ]
  }
  ```

---

### 6.3 Get Restaurant Orders (Owner View)
- **Method & Path**: `GET /api/restaurants/:id/orders`
- **Access**: Owner Only (`authUser`, `authorize("owner")`)
- **Ownership**: User must own restaurant `:id`.
- **Query Parameters**:
  - `page` (default 1)
  - `limit` (default 10, max 50)
  - `status` (optional filter: `"placed"` | `"preparing"` | `"delivered"` | `"cancelled"`)
- **Sorting**: Newest first (`{ createdAt: -1 }`).
- **Population**: Populates `customer` with `{ _id, name }`.
- **Success Response (`200 OK`)**:
  ```json
  {
    "page": 1,
    "limit": 10,
    "total": 14,
    "totalPages": 2,
    "orders": [
      {
        "_id": "67236b280400000000000001",
        "customer": {
          "_id": "67236b280100000000000001",
          "name": "Rahul Verma"
        },
        "restaurant": "67236b280200000000000001",
        "items": [ ... ],
        "totalAmount": 560,
        "status": "placed",
        "paymentMethod": "upi",
        "createdAt": "2026-10-31T12:00:00.000Z"
      }
    ]
  }
  ```

---

### 6.4 Update Order Status (Owner Transition)
- **Method & Path**: `PATCH /api/orders/:id/status`
- **Access**: Owner Only (`authUser`, `authorize("owner")`)
- **Ownership**: Verifies that the order's restaurant is owned by the logged-in owner.
- **Request Body**:
  ```json
  {
    "status": "preparing" // Allowed next status values
  }
  ```
- **State Machine Rules**:
  - `placed` $\rightarrow$ `["preparing", "cancelled"]`
  - `preparing` $\rightarrow$ `["delivered", "cancelled"]`
  - `delivered` $\rightarrow$ `[]` (Terminal state)
  - `cancelled` $\rightarrow$ `[]` (Terminal state)
- **Success Response (`200 OK`)**:
  ```json
  {
    "order": {
      "_id": "67236b280400000000000001",
      "status": "preparing",
      ...
    }
  }
  ```
- **Error Codes**:
  - `400 Bad Request`: `{ "message": "Cannot change status from \"placed\" to \"delivered\". Allowed: preparing, cancelled" }`
  - `403 Forbidden`: `{ "message": "You do not own this restaurant" }`
  - `404 Not Found`: `{ "message": "Order not found" }`

---

## 7. Review Endpoints

### 7.1 Post Review (Customer)
- **Method & Path**: `POST /api/reviews`
- **Access**: Customer Only (`authUser`, `authorize("customer")`)
- **Request Body**:
  ```json
  {
    "orderId": "67236b280400000000000001",
    "rating": 5, // Integer 1 to 5
    "comment": "Exquisite flavours and fast packaging!" // optional
  }
  ```
- **Enforced Constraints**:
  1. `orderId` must exist and belong to the logged-in user (`order.customer === req.user.id`).
  2. Order status must be strictly `"delivered"`.
  3. Exactly one review per order: checked via `Review.findOne({ order: order._id })`.
- **Success Response (`201 Created`)**:
  ```json
  {
    "review": {
      "_id": "67236b280500000000000001",
      "customer": "67236b280100000000000001",
      "restaurant": "67236b280200000000000001",
      "order": "67236b280400000000000001",
      "rating": 5,
      "comment": "Exquisite flavours and fast packaging!",
      "createdAt": "2026-10-31T14:00:00.000Z"
    }
  }
  ```
- **Error Codes**:
  - `400 Bad Request`: `{ "message": "orderId is required" }`
  - `400 Bad Request`: `{ "message": "rating must be a whole number from 1 to 5" }`
  - `400 Bad Request`: `{ "message": "You can only review a delivered order" }`
  - `403 Forbidden`: `{ "message": "You can only review your own orders" }`
  - `404 Not Found`: `{ "message": "Order not found" }`
  - `409 Conflict`: `{ "message": "You already reviewed this order" }`

---

### 7.2 Get Restaurant Reviews
- **Method & Path**: `GET /api/restaurants/:id/reviews`
- **Access**: Public
- **Query Parameters**:
  - `page` (default 1)
  - `limit` (default 10, max 50)
- **Sorting**: Newest first (`{ createdAt: -1 }`).
- **Population**: Populates `customer` with `{ _id, name }`.
- **Success Response (`200 OK`)**:
  ```json
  {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1,
    "reviews": [
      {
        "_id": "67236b280500000000000001",
        "customer": {
          "_id": "67236b280100000000000001",
          "name": "Rahul Verma"
        },
        "restaurant": "67236b280200000000000001",
        "order": "67236b280400000000000001",
        "rating": 5,
        "comment": "Exquisite flavours and fast packaging!",
        "createdAt": "2026-10-31T14:00:00.000Z"
      }
    ]
  }
  ```

---

## 8. Working Owner Analytics Endpoints

The backend codebase has two fully functional aggregation endpoints located in `restaurant.controller.js` and registered in `restaurant.routes.js`:

### 8.1 Restaurant Revenue Trend
- **Method & Path**: `GET /api/restaurants/:id/revenue`
- **Access**: Owner Only (`authUser`, `authorize("owner")`)
- **Query Parameters**:
  | Param | Type | Default | Description |
  | :--- | :--- | :--- | :--- |
  | `to` | `string` (date) | Current Time | End date filter |
  | `from` | `string` (date) | `to` minus 7 days | Start date filter |

- **Pipeline Summary**: Matches delivered orders for `:id` between `from` and `to`, groups by `%Y-%m-%d`, calculates total revenue and daily breakdown.
- **Success Response (`200 OK`)**:
  ```json
  {
    "message": "Revenue data fetched successfully",
    "revenue": 34850,
    "from": "2026-10-24",
    "to": "2026-10-31",
    "days": [
      { "date": "2026-10-24", "revenue": 4500 },
      { "date": "2026-10-25", "revenue": 5200 },
      { "date": "2026-10-26", "revenue": 3900 },
      { "date": "2026-10-27", "revenue": 6100 },
      { "date": "2026-10-28", "revenue": 4800 },
      { "date": "2026-10-29", "revenue": 5150 },
      { "date": "2026-10-30", "revenue": 5200 }
    ]
  }
  ```

---

### 8.2 Top Customers Report
- **Method & Path**: `GET /api/restaurants/:id/top-customers`
- **Access**: Owner Only (`authUser`, `authorize("owner")`)
- **Pipeline Summary**: Matches delivered orders for `:id`, groups by customer `_id`, computes `totalRevenue`, `totalOrder`, and `averageOrderValue`, sorts descending by `totalRevenue`, limits to 5, and joins with `users` collection to retrieve customer `name` and `email`.
- **Success Response (`200 OK`)**:
  ```json
  {
    "message": "Top customers fetched successfully",
    "topCustomers": [
      {
        "_id": "67236b280100000000000001",
        "totalRevenue": 14200,
        "totalOrder": 19,
        "averageOrderValue": 747.36,
        "user": {
          "_id": "67236b280100000000000001",
          "name": "Rahul Verma",
          "email": "rahul@example.com"
        }
      }
    ]
  }
  ```

---

## 9. Analytics Router Endpoints (`/api/...`) — Status: 501 Stubs

Mounted in `analytics.routes.js` and handled by `analytics.controller.js`. All of the following endpoints currently return `501 Not Implemented` with `{ "message": "Not implemented yet" }`:

| Method | Path | Auth | Intended Capability |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/analytics/restaurants/:id/revenue` | Owner | Historical daily revenue with order count |
| `GET` | `/api/analytics/restaurants/:id/top-dishes` | Owner | Top sold menu dishes |
| `GET` | `/api/analytics/restaurants/:id/peak-hours` | Owner | 24-hour order distribution (IST) |
| `GET` | `/api/analytics/restaurants/:id/status-breakdown` | Owner | Order status distribution with percentages |
| `GET` | `/api/analytics/restaurants/:id/top-customers` | Owner | Top 10 customer ranking |
| `GET` | `/api/analytics/restaurants/:id/ratings` | Owner | Star rating counts and average score |
| `GET` | `/api/analytics/platform/city-revenue` | User | Platform-wide city performance |
| `GET` | `/api/analytics/platform/monthly-trend` | User | 12-month platform sales trend |
| `GET` | `/api/restaurants/search` | Public | Faceted search with cuisine counts |
| `GET` | `/api/restaurants/nearby` | Public | Geospatial $geoNear discovery |

> [!CAUTION]
> **Frontend Integration Rule**: The frontend must integrate with the **working** endpoints (`/api/restaurants/:id/revenue` and `/api/restaurants/:id/top-customers`) for analytics, and use client-side search/filtering on top of `GET /api/restaurants?city=...` for discovery.

