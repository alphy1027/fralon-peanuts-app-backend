const express = require("express");
const router = express.Router();
const favouriteController = require("../controllers/favouriteController");

router
  .route("/")
  .get(favouriteController.getFavouriteProducts_get)
  .post(favouriteController.addFavouriteProduct_post)
  .delete(favouriteController.removeFavouriteProduct_delete);

module.exports = router;
