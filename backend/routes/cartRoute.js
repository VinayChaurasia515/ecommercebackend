const express = require("express");
const router = express.Router();

const { isAuthenticatedUser } = require("../middleware/auth");
const {
  addToCart,addToCartArrow,
  viewCart,
  deleteProductFromCart,
  removeCartItems
} = require("../controllers/cartController");

router.route("/cart/addtocart").post(isAuthenticatedUser, addToCart);
//router.route("/cart/addtocart1").post(isAuthenticatedUser, addToCartArrow);


router.route("/cart").get(isAuthenticatedUser, viewCart);

router
  .route("/cart/product/:productId")
 // .delete(isAuthenticatedUser, deleteProductFromCart)
  .put(isAuthenticatedUser, removeCartItems);

module.exports = router;
