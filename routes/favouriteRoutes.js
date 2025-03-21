const express = require('express');
const router = express.Router();
const favouriteController = require('../controllers/favouriteController');
const { verifyRoles, USER_ROLES } = require('../middleware/roles');

router
    .route('/')
    .get(verifyRoles(USER_ROLES.CLIENT, USER_ROLES.ADMIN), favouriteController.getFavouriteProducts_get)

router
    .route('/:productId')
    .post(verifyRoles(USER_ROLES.CLIENT), favouriteController.addFavouriteProduct_post)
    .delete(verifyRoles(USER_ROLES.CLIENT), favouriteController.removeFavouriteProduct_delete)


module.exports = router;