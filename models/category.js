const mongoose = require('mongoose')
const { Schema, model } = mongoose

const categorySchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    products: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
        default: []
    }
})

const Category = model('Category', categorySchema);
module.exports = Category;