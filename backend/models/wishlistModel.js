const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  wishlistProduct: [
    {
      userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      productId: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
