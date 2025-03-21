const { Schema, model } = require('mongoose');

const reviewSchema = new Schema({
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: String
}, { timestamps: true });

const Review = model('Review', reviewSchema);
module.exports = Review;