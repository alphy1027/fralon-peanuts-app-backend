const router = require('express').Router();
const transactionController = require('../controllers/transactionController')
const { USER_ROLES, verifyRoles } = require('../middleware/roles');

router
    .route('/')
    .get(verifyRoles(USER_ROLES.ADMIN), transactionController.getTransactions_get)
    .post(verifyRoles(USER_ROLES.ADMIN), transactionController.addNewTransaction_post)
router
    .route('/:transactionId')
    .get(verifyRoles(USER_ROLES.CLIENT, USER_ROLES.ADMIN), transactionController.getSingleTransaction_get)

module.exports = router;