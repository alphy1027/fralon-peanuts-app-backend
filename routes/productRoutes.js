const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const reviewController = require("../controllers/reviewController");
const categoryController = require("../controllers/categoryController");
const { USER_ROLES, verifyRoles } = require("../middleware/roles");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router
  .route("/")
  .get(productController.getAllProducts_get)
  .post(verifyRoles(USER_ROLES.ADMIN), upload.single("productImg"), productController.addNewProduct_post);

router
  .route("/categories")
  .get(categoryController.getAllCategories_get)
  .post(verifyRoles(USER_ROLES.ADMIN), categoryController.createCategory_post);

router.route("/categories/:categoryId").delete(verifyRoles(USER_ROLES.ADMIN), categoryController.deleteCategory_delete);

router
  .route("/:productId")
  .get(productController.getSingleProduct_get)
  .put(verifyRoles(USER_ROLES.ADMIN), productController.updateProduct_put)
  .delete(verifyRoles(USER_ROLES.ADMIN), productController.deleteProduct_delete);

router
  .route("/:productId/reviews")
  .post(verifyRoles(USER_ROLES.CLIENT), reviewController.createReview_post)
  .get(reviewController.getAllProductReviews_get);

router
  .route("/:productId/reviews/:reviewId")
  .get(reviewController.getSingleReview_get)
  .patch(verifyRoles(USER_ROLES.CLIENT), reviewController.updateReview_patch)
  .delete(verifyRoles(USER_ROLES.CLIENT), reviewController.deleteReview_delete);

module.exports = router;
