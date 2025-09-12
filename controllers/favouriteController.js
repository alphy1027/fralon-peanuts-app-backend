const asyncHandler = require("../middleware/asyncHandler");
const successResponse = require("../middleware/successResponse");
const favouriteService = require("../services/favouriteService");
const validateId = require("../utils/validateId");

const getFavouriteProducts_get = asyncHandler(async (req, res, next) => {
  const clientId = req.user.userId;
  const favoriteProducts = await favouriteService.getFavouriteProducts(clientId);
  return successResponse(res, "Favorite products retrieved successfully", { favoriteProducts });
});

const addFavouriteProduct_post = asyncHandler(async (req, res, next) => {
  const clientId = req.user.userId;
  const { productId } = req.body;
  validateId(productId, next);
  const favoriteProducts = await favouriteService.addFavouriteProduct(clientId, productId);
  return successResponse(res, "Product added to favorites successfully", { favoriteProducts });
});

const removeFavouriteProduct_delete = asyncHandler(async (req, res, next) => {
  const clientId = req.user.userId;
  const { productId } = req.body;
  validateId(productId, next);
  const favoriteProducts = await favouriteService.removeFavouriteProduct(clientId, productId);
  return successResponse(res, "Product removed from favorites", { favoriteProducts });
});

module.exports = {
  addFavouriteProduct_post,
  removeFavouriteProduct_delete,
  getFavouriteProducts_get,
};
