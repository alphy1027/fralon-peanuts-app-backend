const mongoose = require('mongoose');
const ErrorResponse = require('../middleware/errorResponse');

const validateId = (id, next) => {
    if (!mongoose.Types.ObjectId.isValid(id, next)) {
        return next(new ErrorResponse('Invalid ID, This is not a valid mongoose ID', 400))
    }
    return true;
};

module.exports = validateId;