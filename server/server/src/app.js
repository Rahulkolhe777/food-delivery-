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

// CORS middleware: allow requests from local frontend dev servers with credentials
const allowedOrigins = [
  "http://localhost:5173",
  "https://foodhub-zomato-phi.vercel.app",
  "https://client-three-pi-50.vercel.app/",
  env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
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
