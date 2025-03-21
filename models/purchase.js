const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const purchaseSchema = new Schema({
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['cash', 'mpesa', 'bank', 'paypal']
    },
    notes: String
}, { timestamps: true });

const Purchase = mongoose.model('Purchase', purchaseSchema);
module.exports = Purchase;