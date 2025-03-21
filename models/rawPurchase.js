const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rawPurchaseSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'RawUser'
    },
    totalPrice: {
        type: Number,
        required: true
    },
    paidInFull: {
        type: Boolean,
        required: true
    },
    amountPaid: {
        type: Number,
        required: function () {
            return this.paidInFull === false
        }
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['cash', 'mpesa', 'bank', 'paypal']
    },
    notes: String
}, { timestamps: true });

const RawPurchase = mongoose.model('RawPurchase', rawPurchaseSchema);
module.exports = RawPurchase;