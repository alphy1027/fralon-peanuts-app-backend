const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    message: {
        type: String,
        required: true
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        default: null
    },
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        default: null
    },
    type: {
        type: String,
        enum: ['order', 'payment', 'general'],
        required: true
    },
    read: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;