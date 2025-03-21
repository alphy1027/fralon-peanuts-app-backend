const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { USER_ROLES, verifyRoles } = require('../middleware/roles');


router
    .route('/')
    .post(contactController.sendEmail_post)

module.exports = router;