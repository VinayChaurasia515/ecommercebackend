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
      courierStatus: { type: String, required: true, default: "Your Order has been placed." },
     // deliveredAt: { type: Date, required: true },
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

    id: { type: String, required: true },
    status: { type: String, required: true },
  },
  //paidAt: { type: Date, required: true },
  //itemsPrice: { type: Number, default: 0, required: true },
  //taxPrice: { type: Number, default: 0, required: true },
  //shippingPrice: { type: Number, default: 0, required: true },
  totalPrice: { type: Number, default: 0, required: true },
  // orderStatus: { type: String, default: "Processing", required: true },
  // deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Order", orderSchema);
