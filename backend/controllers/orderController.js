const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");

const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncError");

//create new Order
exports.newOrder = catchAsyncError(async (req, res, next) => {
  console.log("req.user ::", req.user);
  console.log(req.body);

  const { shippingInfo, orderItems, paymentInfo, totalPrice } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    totalPrice,
    user: req.user._id,
  });
  await Cart.findOneAndUpdate(
    { userId: req.user._id },
    {
      $set: {
        totalPrice: 0,
        cartItems: [],
      },
    }
  )
    .then((res) => {
      console.log("cart deleted Successfull for this User");
    })
    .catch((err) => {
      console.log("Order done but Error in Cart Deletion", err);
    });

  setTimeout(() => {
    res.status(201).json({
      success: true,
      order,
    });
  }, 1000);
});

//get Single order
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHander("Order does not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

//get loggedIn user orders
exports.myOrders = catchAsyncError(async (req, res, next) => {
  console.log("order user  ", req.user);
  const order = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    order,
  });
});

//get Single user all orders by admin
exports.getUserOrders = catchAsyncError(async (req, res, next) => {
  console.log("order user  ", req.params.userid);
  const order = await Order.find({ user: req.params.userid });

  res.status(200).json({
    success: true,
    order,
  });
});

//get All orders -->Admin
exports.getAllOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find();

  if (!orders) {
    return next(new ErrorHander("Order does not found with this Id", 404));
  }

  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    orders,
    totalAmount,
  });
});

//update order status -->Admin
exports.updateOrder = catchAsyncError(async (req, res, next) => {
  console.log("change order status req.params.id :: ", req.params.id);
  console.log("Product  req.body :: ", req.body);

  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHander("Order does not found with this Id", 404));
  }

  console.log("ORDER :: ", order);

  order.orderItems.forEach((orderItem) => {
    if (orderItem.productId == req.body.productId) {
      orderItem.courierStatus = req.body.courierStatus;
    }
  });
  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    order,
  });
});


//delete orders -->Admin
// exports.deleteOrder = catchAsyncError(async (req, res, next) => {
//   const order = await Order.findById(req.params.id);
//   if (!order) {
//     return next(new ErrorHander("Order does not found with this Id", 404));
//   }
//   await order.remove();

//   res.status(200).json({
//     success: true,
//   });
// });
