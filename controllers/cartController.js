const asyncHandler = require('../middleware/asyncHandler');
const validateId = require('../utils/validateId');
const ErrorResponse = require('../middleware/errorResponse');
const cartService = require('../services/cartService');
const successResponse = require('../middleware/successResponse');

// get all cart items
const getCartItems_get = asyncHandler(async (req, res, next) => {
    const clientId = req.user.userId;
    const cart = await cartService.getCartByClient(clientId);
    if (!cart)
        return next(new ErrorResponse('Cart not found', 404));
    return successResponse(res, 'Cart retrieved successfully', { cart })
})
// adding items to cart
const addToCart_post = asyncHandler(async (req, res, next) => {
    const { productId } = req.body;
    console.log(productId)
    const clientId = req.user.userId;
    if (!productId)
        return next(new ErrorResponse('Product ID is required', 400));
    validateId(productId, next);
    validateId(clientId, next);
    const cart = await cartService.addItemToCart(clientId, productId);
    if (!cart)
        return next(new ErrorResponse('Failed to add item to cart'));
    return successResponse(res, 'Item added to cart successfully', { updatedCart: cart });
})
// remove item from cart
const removeFromCart_delete = asyncHandler(async (req, res, next) => {
    const clientId = req.user.userId;
    const { productId } = req.body;
    validateId(productId, next);
    const cart = await cartService.removeItemFromCart(clientId, productId);
    if (!cart)
        return next(new ErrorResponse('No cart found with this user ID', 404));
    return successResponse(res, 'Product removed from cart successfully', { cart });
})

module.exports = {
    getCartItems_get,
    addToCart_post,
    removeFromCart_delete
}