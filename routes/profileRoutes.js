const express = require('express');
const profileController = require('../controllers/profileController');
const router = express.Router();

router
    .route('/')
    .get(profileController.getProfileInfo_get)
    .put(profileController.updateProfileInfo_put)

module.exports = router;