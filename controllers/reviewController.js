const successResponse = require('../middleware/successResponse');
const ErrorResponse = require('../middleware/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const reviewService = require('../services/reviewService');
const validateId = require('../utils/validateId');

const createReview_post = asyncHandler(async (req, res, next) => {
    const clientId = req.user.userId;
    const productId = req.params.productId;
    const { rating, comment = null } = req.body;
    validateId(productId, next);
    const newReview = await reviewService.createReview({
        client: clientId,
        product: productId,
        rating,
        comment
    })
    return successResponse(res, 'Review created successfully', { newReview }, 201)
})

const getSingleReview_get = asyncHandler(async (req, res, next) => {
    const reviewId = req.params.reviewId;
    const { user } = req;
    validateId(reviewId, next);
    const review = await reviewService.getSingleReviewById(reviewId);
    if (!review)
        return next(new ErrorResponse('Review not found', 404));
    if (!user.role.includes('admin') && user.userId.toString() !== review.client.toString()) {
        return next(new ErrorResponse('You are not authorized to view this review', 403));
    }
    return successResponse(res, 'Review retrieved successfully', { review })
})

const getAllProductReviews_get = asyncHandler(async (req, res, next) => {
    const productId = req.params.productId;
    validateId(productId, next);
    const reviews = await reviewService.getAllProductReviews(productId);
    if (!reviews.length)
        return next(new ErrorResponse('This product has no reviews', 404))
    return successResponse(res, 'Product reviews retrieved successfully', { reviews })
})

const updateReview_patch = asyncHandler(async (req, res, next) => {
    const reviewId = req.params.reviewId;
    const clientId = req.user.userId;
    validateId(reviewId, next);
    const updatedReview = await reviewService.updateReview(clientId, reviewId, req.body)
    return successResponse(res, 'Review updated successfully', { updatedReview })
})

const deleteReview_delete = asyncHandler(async (req, res, next) => {
    const clientId = req.user.userId;
    const { productId, reviewId } = req.params;
    validateId(productId, next);
    const deletedReview = await reviewService.deleteReview(clientId, reviewId, productId);
    if (!deletedReview)
        return next(new ErrorResponse('Failed to delete review'))
    return successResponse(res, 'Review deleted successfully', { deletedReview })
})

module.exports = {
    createReview_post,
    deleteReview_delete,
    getAllProductReviews_get,
    getSingleReview_get,
    updateReview_patch
}