const router = require('express').Router();
const orderController = require('../controllers/orderController');
const { USER_ROLES, verifyRoles } = require('../middleware/roles');

router
    .route('/')
    .get(verifyRoles(USER_ROLES.ADMIN), orderController.getAllOrders_get)
    .post(verifyRoles(USER_ROLES.CLIENT), orderController.placeOrder_post)
router
    .route('/revenue-trends')
    .get(verifyRoles(USER_ROLES.ADMIN), orderController.getRevenueTrends_get)
router
    .route('/:orderId')
    .get(verifyRoles(USER_ROLES.CLIENT, USER_ROLES.ADMIN), orderController.getSingleOrder_get)
    .put(verifyRoles(USER_ROLES.CLIENT), orderController.updateSingleOrder_put)
    .patch(verifyRoles(USER_ROLES.ADMIN), orderController.updateOrderStatus_patch)
router
    .route('/:orderId/cancel')
    .patch(verifyRoles(USER_ROLES.CLIENT), orderController.cancelOrder_patch)


module.exports = router;