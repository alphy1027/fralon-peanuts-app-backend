const mongoose = require('mongoose');
const ErrorResponse = require('../middleware/errorResponse');
const purchaseService = require('../services/purchaseService');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    items: [{
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true }
    }],
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['cash', 'mpesa', 'bank', 'paypal']
    },
    orderType: {
        type: String,
        enum: ['wholesale', 'retail']
    },
    paid: {
        type: Boolean,
        required: true
    },
    transaction: {
        type: Schema.Types.ObjectId,
        ref: 'Transaction',
        required: function () {
            return this.paymentMethod === 'mpesa'
        }
    },
    notes: String
}, { timestamps: true });

orderSchema.post('findOneAndUpdate', async function (doc) {
    if (!doc)
        return new ErrorResponse('No document found to add as new purchase', 404);
    try {
        if (doc.status === 'completed') {
            await purchaseService.createNewPurchase({
                order: doc._id,
                totalPrice: doc.totalPrice,
                paymentMethod: doc.paymentMethod
            })
            console.log('New puchase created after completed order')
        }
    } catch (err) {
        new ErrorResponse(err.message)
    }
})


const Order = mongoose.model('Order', orderSchema);
module.exports = Order;