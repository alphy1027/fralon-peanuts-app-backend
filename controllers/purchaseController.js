const Purchase = require('../models/purchase');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../middleware/errorResponse');
const successResponse = require('../middleware/successResponse');
const purchaseService = require('../services/purchaseService');

// creating new purchase
const addNewPurchase_post = asyncHandler(async (req, res, next) => {
    const { client, items, totalPrice, paymentStatus, paidAmount, paymentMethod, paidInFull, notes } = req.body;

    const newPurchase = await purchaseService.createNewPurchase({
        client: client,
        items: items,
        totalPrice: totalPrice,
        paymentStatus: paymentStatus,
        paidAmount: paidAmount,
        paymentMethod: paymentMethod,
        paidInFull: paidInFull,
        notes: notes
    })
    if (!newPurchase)
        return next(new ErrorResponse('New purchase not found', 404));
    return successResponse(res, 'New purchase saved successsfully', { newPurchase }, 201)
})
// get all purchases
const getAllPurchases_get = asyncHandler(async (req, res, next) => {
    const purchases = await purchaseService.getAllPurchases();
    if (!purchases)
        return next(new ErrorResponse('Purchases not found', 404));
    return successResponse(res, 'Purchases retrieved successfully', { purchases })
})
// get a single purchase
const getSinglePurchase_get = asyncHandler(async (req, res, next) => {
    const purchaseId = req.params.purchaseId;
    const purchase = await purchaseService.getSinglePurchase(purchaseId);
    if (!purchase)
        return next(new ErrorResponse('Purchase not found', 404));
    return successResponse(res, 'Purchase retrieved successfully', { purchase })
})
// update a purchase
const updatePurchase_put = asyncHandler(async (req, res, next) => {
    const purchaseId = req.params.purchaseId;
    const purchase = await purchaseService.updatePurchase(purchaseId, req.body)
    if (!purchase)
        return next(new ErrorResponse('No purchase of the ID you provided', 404));
    return successResponse(res, 'Purchase updated successfully', { updatedPurchase: purchase })
})
// delete a purchase
const deletePurchase_delete = asyncHandler(async (req, res, next) => {
    const purchaseId = req.params.purchaseId;
    const purchase = await purchaseService.deletePurchase(purchaseId);
    if (!purchase)
        return next(new ErrorResponse('No purchase with the ID you provided', 404));
    return successResponse(res, 'Purchase deleted successfully');
})


module.exports = {
    getAllPurchases_get,
    addNewPurchase_post,
    getSinglePurchase_get,
    deletePurchase_delete,
    updatePurchase_put
}
