const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.route('/signup')
    .post(authController.createNewUser_post)

router.route('/login')
    .post(authController.loginUser_post)

router.route('/refresh')
    .post(authController.refresh_post)

router.route('/logout')
    .post(authController.logout_post)

router.route('/verify-email/:verificationToken')
    .get(authController.emailVerification_get)

router.route('/forgot-password')
    .post(authController.sendResetPasswordEmail_post)

router.route('/reset-password/:resetPasswordToken')
    .post(authController.resetPassword_post)

router.route('/resend-verification-email')
    .post(authController.resendEmailVerification_post)

module.exports = router;