const Wishlist = require("../models/wishlistModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");

//create new Order
exports.newWishlist = catchAsyncError(async (req, res, next) => {
  const {productId} = req.body;

  const order = await Wishlist.create({
    productId,
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});
