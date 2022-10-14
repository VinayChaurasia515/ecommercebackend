const ErrorHander = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncError");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

//add to cart
exports.addToCart = catchAsyncError(async (req, res, next) => {
  console.log("add to cart start... ", req.user);
  console.log(" req.body... ", req.body);
  Cart.findOne({ userId: req.user._id }).exec((error, cart) => {
    console.log("cart ", cart);
    if (error) return res.status(400).json({ error });
    if (cart) {
      //cart already exist then update cart by quantity
      console.log(
        "req.body.cartItems.productId ::",
        req.body.cartItems.productId
      );
      const isItemAdded = cart.cartItems.find(
        (c) => c.productId == req.body.cartItems.productId
      );
      console.log("isItemAdded ", isItemAdded);

      if (isItemAdded) {
        console.log("old totalPrice ", cart.totalPrice);
        Cart.findOneAndUpdate(
          {
            userId: req.user._id,
            "cartItems.productId": req.body.cartItems.productId,
          },
          {
            $set: {
              totalPrice: (function () {
                console.log("cart.totalPrice ::", cart.totalPrice);
                cart.totalPrice =
                  cart.totalPrice +
                  req.body.cartItems.quantity * req.body.cartItems.price;
                return cart.totalPrice;
              })(),
              "cartItems.$": {
                ...req.body.cartItems,
                quantity: isItemAdded.quantity + req.body.cartItems.quantity,
              },
            },
          },
          { useFindAndModify: false }
        ).exec((error, _cart) => {
          if (error)
            return res
              .status(400)
              .json({ "Add to Cart error :: ": error.message });
          if (_cart) {
            return res.status(200).json({ cart: _cart });
          }
        });
      } else {
        Cart.findOneAndUpdate(
          { userId: req.user._id },
          {
            $push: {
              cartItems: req.body.cartItems,
            },
            $set: {
              totalPrice: (function () {
                console.log("cart.totalPrice ::", cart.totalPrice);

                cart.totalPrice =
                  cart.totalPrice +
                  req.body.cartItems.quantity * req.body.cartItems.price;
                return cart.totalPrice;
              })(),
            },
          },
          { useFindAndModify: false }
        ).exec((error, _cart) => {
          if (error) return res.status(400).json({ error });
          if (_cart) {
            return res.status(200).json({ cart: _cart });
          }
        });
      }
    } else {
      console.log("req.body  ::  ", req.body);
      //cart not  exist then create cart
      const cart = new Cart({
        userId: req.user._id, //req.body.userId,
        totalPrice: req.body.cartItems.price * req.body.cartItems.quantity, // req.body.totalPrice,
        cartItems: [req.body.cartItems],
      });
      console.log("cart ", cart);
      cart.save((error, cart) => {
        if (error) return res.status(400).json({ error });
        if (cart) {
          res.status(200).json({ cart });
        }
      });
    }
  });
});

//View Cart
exports.viewCart = catchAsyncError(async (req, res, next) => {
  const Carts = await Cart.findOne({ userId: req.user._id });
  let items = Carts.cartItems;
  console.log("items :: ", items);
  //Carts.cartItems

  items.forEach(async (item) => {
    console.log("item :: ", item);
    let pro = await Product.findById(item.productId);
    console.log("product :: ", pro.name);
    console.log("product :: ", pro.images.url);
    
  });

  res.status(200).json({
    success: true,
    Carts,
  });
});

//remove from cart
exports.removeCartItems = catchAsyncError(async (req, res, next) => {
  const productId = req.params.productId;

  const cart = await Cart.findOne({ userId: req.user._id });
  console.log(cart);
  let checkquantity = cart.cartItems.filter((c) => c.productId == productId);
  console.log("checkquantity  ", checkquantity);
  console.log("checkquantity  ", checkquantity[0].price);
  if (checkquantity[0].quantity > 1) {
    Cart.findOneAndUpdate(
      {
        userId: req.user._id,
        "cartItems.productId": productId,
      },
      {
        $inc: {
          "cartItems.$.quantity": -1,
          totalPrice: -checkquantity[0].price,
        },
      }
    )
      .then((result) => {
        console.log(" result  :: ", result);
        res.status(200).json({
          result,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({
          err,
        });
      });
  } else {
    console.log("quantity is 1 so delete");
    Cart.updateOne(
      { userId: req.user._id },
      {
        $inc: {
          totalPrice: -checkquantity[0].price,
        },
        $pull: {
          cartItems: {
            productId: productId,
          },
        },
      }
    )
      .then((result) => {
        console.log(" result  :: ", result);
        res.status(200).json({
          result,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({
          err,
        });
      });
  }
});
