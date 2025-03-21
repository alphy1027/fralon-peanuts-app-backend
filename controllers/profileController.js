const profileService = require('../services/profileService');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../middleware/errorResponse');
const successResponse = require('../middleware/successResponse');
const validateId = require('../utils/validateId');

const getProfileInfo_get = asyncHandler(async (req, res, next) => {
    const clientId = req.user.userId;
    validateId(clientId, next);
    const client = await profileService.getProfile(clientId)
    if (!client)
        return next(new ErrorResponse("No client with this ID.", 400));
    return successResponse(res, 'Profile retrieved successfully', { client })
})

const updateProfileInfo_put = asyncHandler(async (req, res, next) => {
    const clientId = req.user.userId;
    validateId(clientId, next);
    const client = await profileService.updateProfile(clientId, req.body);
    if (!client)
        return next(new ErrorResponse("No client with this ID.", 400));
    return successResponse(res, 'Profile info updated successfully', { updatedClient: client })
})

module.exports = {
    getProfileInfo_get,
    updateProfileInfo_put
}