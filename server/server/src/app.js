const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const restaurantRoutes = require("./routes/restaurant.routes");
const orderRoutes = require("./routes/order.routes");
const reviewRoutes = require("./routes/review.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const { notFound, errorHandler } = require("./middlewares/error.middleware");
const cors = require("cors");
const env = require("./config/env");

const app = express();

// CORS middleware: allow requests from local and production frontend origins with credentials
const rawClientUrl = env.CLIENT_URL ? env.CLIENT_URL.split(",") : [];
const configuredOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "https://foodhub-zomato-phi.vercel.app",
  "https://client-three-pi-50.vercel.app",
  ...rawClientUrl,
]
  .filter(Boolean)
  .map((url) => url.trim().replace(/\/+$/, ""));

function isOriginAllowed(origin) {
  if (!origin) return true; // allow non-browser clients (curl, Postman, healthcheck)
  const normalized = origin.trim().replace(/\/+$/, "");
  if (configuredOrigins.includes(normalized)) return true;
  try {
    const url = new URL(normalized);
    if (
      url.hostname.endsWith(".vercel.app") ||
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1"
    ) {
      return true;
    }
  } catch {
    // invalid URL format
  }
  return false;
}

const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ message: "FoodHub API is running" });
});

app.use("/api/auth", authRoutes);

// Must come BEFORE restaurantRoutes, otherwise /api/restaurants/search
// would be caught by /api/restaurants/:id with id = "search".
app.use("/api", analyticsRoutes);

app.use("/api/restaurants", restaurantRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
