const mongoose = requre('mongoose');
const Schema = mongoose.Schema;

const rawUserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    phoneNumber: {
        type: String,
        unique: true
    },
    purchases: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'RawPurchase'
        }],
        default: []
    }
}, { timestamps: true })

const RawUser = mongoose.model('RawUser', rawUserSchema);
module.exports = RawUser;