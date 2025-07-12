const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { USER_ROLES, verifyRoles } = require("../middleware/roles");

router
  .route("/")
  .get(cartController.getCartItems_get)
  .post(cartController.addToCart_post)
  .delete(cartController.removeFromCart_delete)
  .patch(cartController.updateQuantity_patch);

module.exports = router;
