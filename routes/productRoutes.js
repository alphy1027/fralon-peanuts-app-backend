const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const reviewController = require('../controllers/reviewController');
const categoryController = require('../controllers/categoryController');
const { USER_ROLES, verifyRoles } = require('../middleware/roles');
const multer = require('multer');
/* const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, 'uploads');
        cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
}) */
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

router.route('/')
    .get(verifyRoles(USER_ROLES.CLIENT, USER_ROLES.ADMIN), productController.getAllProducts_get)
    .post(verifyRoles(USER_ROLES.ADMIN), upload.single('productImg'), productController.addNewProduct_post)

router.route('/categories')
    .get(verifyRoles(USER_ROLES.ADMIN), categoryController.getAllCategories_get)
    .post(verifyRoles(USER_ROLES.ADMIN), categoryController.createCategory_post)

router.route('/categories/:categoryId')
    .delete(verifyRoles(USER_ROLES.ADMIN), categoryController.deleteCategory_delete)

router.route('/:productId')
    .get(verifyRoles(USER_ROLES.CLIENT, USER_ROLES.ADMIN), productController.getSingleProduct_get)
    .put(verifyRoles(USER_ROLES.ADMIN), productController.updateProduct_put)
    .delete(verifyRoles(USER_ROLES.ADMIN), productController.deleteProduct_delete)

router
    .route('/:productId/reviews')
    .post(verifyRoles(USER_ROLES.CLIENT), reviewController.createReview_post)
    .get(verifyRoles(USER_ROLES.CLIENT, USER_ROLES.ADMIN), reviewController.getAllProductReviews_get)

router
    .route('/:productId/reviews/:reviewId')
    .get(verifyRoles(USER_ROLES.CLIENT, USER_ROLES.ADMIN), reviewController.getSingleReview_get)
    .patch(verifyRoles(USER_ROLES.CLIENT), reviewController.updateReview_patch)
    .delete(verifyRoles(USER_ROLES.CLIENT), reviewController.deleteReview_delete)

module.exports = router;