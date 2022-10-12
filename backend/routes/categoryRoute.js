const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const {
  categoryAll,
  addCategory,
  updateCategory,
  deleteCategory,
  categoryProducts
} = require("../controllers/categoryController");

const router = express.Router();
router.route("/category").get(
 // isAuthenticatedUser,authorizeRoles("admin"),
  categoryAll
);
router.route("/admin/category/add").post(
  isAuthenticatedUser,authorizeRoles("admin"),
  addCategory
);

router.route("/admin/category/:id").post(
 isAuthenticatedUser, authorizeRoles("admin"),
  updateCategory
);

router.route("/admin/category/:id").delete(
  isAuthenticatedUser, authorizeRoles("admin"),
  deleteCategory
);
router.route("/category/products/:id").get(
  //isAuthenticatedUser, authorizeRoles("admin"),
  categoryProducts
);

module.exports = router;
