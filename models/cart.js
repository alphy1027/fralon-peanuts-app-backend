const { required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    items: [{
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 }
    }],
    client: {
        type: Schema.Types.ObjectId, ref: 'Client', required: true
    }
}, { timestamps: true })

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;