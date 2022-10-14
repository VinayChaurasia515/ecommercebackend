const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    fullName: { type: String, required: true },
    mobileNo: { type: Number, required: true },
    flat: { type: String, required: true },
    area: { type: String, required: true },
    landmark: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pinCode: { type: Number, required: true },
  },
  orderItems: [
    {
      productName: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      productUrl: { type: String, required: true },
      productId: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
      },
      courierStatus: {
        type: String,
        required: true,
        default: "Your Order has been placed.",
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  paymentInfo: {
    // card:{

    // },
    // COD:{

    // },
    paymentOption: { type: String, required: true },
    id: { type: String, required: true },
    status: { type: String, required: true },
  },
  totalPrice: { type: Number, default: 0, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Order", orderSchema);
