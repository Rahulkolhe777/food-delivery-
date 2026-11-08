const mongoose = require("mongoose");

// Name and price are copied from the menu item when the order is placed,
// so old orders stay correct even if the menu changes later.
const orderItemSchema = new mongoose.Schema(
  {
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (items) => items.length > 0,
        message: "An order needs at least one item",
      },
    },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["placed", "preparing", "delivered", "cancelled"],
      default: "placed",
    },
    paymentMethod: { type: String, enum: ["upi", "card", "cod"], default: "cod" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Customer order history & count (GET /api/orders/my)
orderSchema.index({ customer: 1, createdAt: -1 });

// Owner order list without status filter (GET /api/restaurants/:id/orders)
orderSchema.index({ restaurant: 1, createdAt: -1 });

// Owner order list with status filter & analytics / revenue (GET /api/restaurants/:id/orders?status=...)
orderSchema.index({ restaurant: 1, status: 1, createdAt: -1, totalAmount: 1 });
orderSchema.index({ restaurant: 1, status: 1, customer: 1, totalAmount: 1 });

module.exports = mongoose.model("Order", orderSchema);
