const express = require('express');
const purchaseController = require('../controllers/purchaseController');
const router = express.Router();

router
    .route('/')
    .get(purchaseController.getAllPurchases_get)
    .post(purchaseController.addNewPurchase_post);
router
    .route('/:purchaseId')
    .delete(purchaseController.deletePurchase_delete)
    .put(purchaseController.updatePurchase_put)
    .get(purchaseController.getSinglePurchase_get);

module.exports = router;