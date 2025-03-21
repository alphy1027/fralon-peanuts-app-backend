const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Category = require('../models/category');
const productSchema = new Schema({
    productName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['smooth', 'crunchy'],
        default: 'smooth'
    },
    packageSize: {
        type: String,
        required: true,
        enum: ['200gms', '400gms', '800gms', '1kg', '1.5kg']
    },
    unitPrice: {
        type: Number,
        required: true
    },
    wholesaleUnitPrice: {
        type: Number,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
    },
    available: {
        type: Boolean,
        default: true
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    productImage: {
        image: String,
        publicId: String
    }
}, { timestamps: true })

productSchema.post('save', async function (doc) {
    const category = await Category.findByIdAndUpdate(
        doc.category,
        { $addToSet: { products: doc._id } }, // $addToSet Adds an element to an array only if it doesn't already exist (enforces uniqueness
        { new: true }
    ).exec();
    console.log('Product added to category successfully,:', category)
})

const Product = mongoose.model('Product', productSchema);
module.exports = Product;