const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');


router
    .route('/')
    .get(notificationController.getAllNotifications_get)
router
    .route('/:notificationId')
    .get(notificationController.getSingleNotification_get)

module.exports = router;