const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, default: "" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

reviewSchema.index({ order: 1 }, { unique: true });
reviewSchema.index({ restaurant: 1, createdAt: -1 });
reviewSchema.index({ customer: 1 });

module.exports = mongoose.model("Review", reviewSchema);
