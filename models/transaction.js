const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
    },
    service: {
        type: String,
        default: 'till',
        enum: ['paybill', 'till', 'pochi']
    },
    senderName: {
        type: String,
        required: true
    },
    senderNumber: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    reversed: {
        type: Boolean,
        default: false
    },
    code: {
        type: String,
        required: true
    },
    network: {
        type: String,
        default: 'mpesa',
        enum: ['mpesa', 'airtel money']
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        required: true
    },
    notes: String
}, { timestamps: true })

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;