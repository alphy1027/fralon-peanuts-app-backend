const { default: mongoose } = require('mongoose');
const ErrorResponse = require('../middleware/errorResponse');
const Product = require('../models/product');
const Review = require('../models/review');
const productService = require('./productService');

class ReviewService {
    constructor(reviewModel) {
        this.Review = reviewModel;
    }

    async createReview(reviewDetails) {
        const { client, product } = reviewDetails;
        const session = await mongoose.startSession();

        const clientHasReview = await this.getSingleReview({ client, product });
        if (clientHasReview)
            throw new ErrorResponse('You have already reviewed this product', 409)
        try {
            await session.withTransaction(async () => {
                const review = await this.Review.create([reviewDetails], { session })
                if (!review.length)
                    throw new ErrorResponse('Failed to create review', 404)
                const newReview = review[0]
                console.log(newReview);
                const productReviews = await this.addReviewToProduct(newReview.product, newReview._id, session);
                console.log(productReviews);
                return newReview;
            })

        } finally {
            session.endSession()
        }
    }

    async addReviewToProduct(productId, reviewId, session) {
        const product = await Product.findById(productId, null, { session });
        if (!product)
            throw new ErrorResponse('No product found to add review', 404);
        product.reviews.push(reviewId);
        const updatedProduct = await product.save();
        console.log('Review added to product reviews array successfully');
        return updatedProduct.reviews
    }

    async getSingleReview(reviewDetails) {
        return await this.Review.findOne({ ...reviewDetails }).exec();
    }

    async getSingleReviewById(reviewId) {
        return await this.Review.findById(reviewId).exec();
    }

    async getAllProductReviews(productId) {
        const product = await productService.getProductById(productId);
        if (!product)
            throw new ErrorResponse('No product exist with the ID provided', 404);
        return await this.Review.find({ product: productId }).populate('client', 'username').exec();
    }

    async updateReview(clientId, reviewId, reviewDetails) {
        const review = await this.getSingleReviewById(reviewId);
        if (!review)
            throw new ErrorResponse('No review found with the ID provided', 404);
        if (review.client.toString() !== clientId.toString())
            throw new ErrorResponse('You are not authorized to edit this review', 403);
        for (let [key, value] of Object.entries(reviewDetails)) {
            review[key] = value;
        }
        return await review.save();
    }

    async deleteReview(clientId, reviewId, productId) {
        const review = await this.getSingleReviewById(reviewId);
        if (!review)
            throw new ErrorResponse('No review found with the ID provided', 404);
        if (review.client.toString() !== clientId.toString())
            throw new ErrorResponse('You are not authorized to delete this review', 403);
        const deletedReview = await review.deleteOne();
        const updatedProduct = await Product.findByIdAndUpdate(productId,
            { $pull: { reviews: reviewId } },
            { new: true }
        )
        if (!updatedProduct)
            throw new ErrorResponse('Failed to remove review from product reviews', 404);
        return deletedReview
    }

}

module.exports = new ReviewService(Review);