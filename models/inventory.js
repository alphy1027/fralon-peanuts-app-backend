const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inventorySchema = new Schema({
    productName: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    unitPrice: {
        type: Number,
        required: true
    },
    supplier: {
        type: String,
        required: true
    },
    batchNumber: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Inventory = mongoose.model('Inventory', inventorySchema);
module.exports = Inventory;