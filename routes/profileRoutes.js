const express = require("express");
const profileController = require("../controllers/profileController");
const orderController = require("../controllers/orderController");
const router = express.Router();

router.route("/").get(profileController.getProfileInfo_get).put(profileController.updateProfileInfo_put);
router.route("/orders").get(orderController.getUserOrders_get);

module.exports = router;
