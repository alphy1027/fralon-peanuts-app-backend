const asyncHandler = require("../middleware/asyncHandler");
const successResponse = require("../middleware/successResponse");
const favouriteService = require("../services/favouriteService");
const validateId = require("../utils/validateId");

const getFavouriteProducts_get = asyncHandler(async (req, res, next) => {
    const clientId = req.user.userId;
    const favouriteProducts = await favouriteService.getFavouriteProducts(clientId);
    return successResponse(res, 'Favourite products retrieved successfully', { favouriteProducts })
})

const addFavouriteProduct_post = asyncHandler(async (req, res, next) => {
    const clientId = req.user.userId;
    const { productId } = req.params;
    validateId(productId, next)
    const favouriteProducts = await favouriteService.addFavouriteProduct(clientId, productId);
    return successResponse(res, 'Product added to favourites successfully', { favouriteProducts });
})

const removeFavouriteProduct_delete = asyncHandler(async (req, res, next) => {
    const clientId = req.user.userId;
    const { productId } = req.params;
    validateId(productId, next)
    const favouriteProducts = await favouriteService.removeFavouriteProduct(clientId, productId);
    return successResponse(res, 'Product removed from favourites', { favouriteProducts });
})

module.exports = {
    addFavouriteProduct_post,
    removeFavouriteProduct_delete,
    getFavouriteProducts_get
}