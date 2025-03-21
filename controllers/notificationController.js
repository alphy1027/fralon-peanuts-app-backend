const Notification = require('../models/notification');
const notificationService = require('../services/notificationService');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../middleware/errorResponse');
const successResponse = require('../middleware/successResponse');
const validateId = require('../utils/validateId');


const getAllNotifications_get = asyncHandler(async (req, res, next) => {
    const notifications = await notificationService.getAllNotifications();
    if (!notifications)
        return next(new ErrorResponse('No Notification found', 404));
    return successResponse(res, 'Notifications retrieved successfully', { notifications });
})

const getSingleNotification_get = asyncHandler(async (req, res, next) => {
    const { notificationId } = req.params;
    validateId(notificationId, next);
    const notification = await notificationService.getNotificationById(notificationId);
    if (!notification)
        return next(new ErrorResponse('Notification not found', 404));
    return successResponse(res, 'Notification retrieved successfully', { notification });
})

module.exports = {
    getAllNotifications_get,
    getSingleNotification_get
}