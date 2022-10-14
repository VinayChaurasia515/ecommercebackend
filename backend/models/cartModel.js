const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    // { type: String },
    userId: {
      type: mongoose.Schema.Types.ObjectID,
      ref: "User",
      required: true,
    },
    totalPrice: { type: Number, default: 0 },
    cartItems: [
      {
        // { type: String },
        productId: {
          type: mongoose.Schema.Types.ObjectID,
          ref: "Product",
          required: true,
        },
        productName: { type: String },
        productUrl: { type: String },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity can not be less then 1."],
        },
        price: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
