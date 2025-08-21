const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const reviewController = require("../controllers/reviewController");
const categoryController = require("../controllers/categoryController");

router.route("/").get(productController.getAllProducts_get);

router.route("/categories").get(categoryController.getAllCategories_get);

router.route("/:productId").get(productController.getSingleProduct_get);

router.route("/:productId/reviews").get(reviewController.getAllProductReviews_get);

router.route("/:productId/reviews/:reviewId").get(reviewController.getSingleReview_get);

module.exports = router;
