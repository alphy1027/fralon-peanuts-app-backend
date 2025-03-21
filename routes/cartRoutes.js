const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController')
const { USER_ROLES, verifyRoles } = require('../middleware/roles');

router.route('/')
    .get(cartController.getCartItems_get)
router.route('/add')
    .post(cartController.addToCart_post)
router.route('/remove')
    .delete(cartController.removeFromCart_delete)

module.exports = router;