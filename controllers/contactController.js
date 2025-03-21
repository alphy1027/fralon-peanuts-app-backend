const nodemailer = require('nodemailer');
const asyncHandler = require('../middleware/asyncHandler');
const { sendContactEmail, sendFeedbackContactEmail } = require('../utils/emailTransporter');
const ErrorResponse = require('../middleware/errorResponse');
const successResponse = require('../middleware/successResponse');

//sending contact email
const sendEmail_post = asyncHandler(async (req, res, next) => {
    const { email, name, message } = req.body;

    const contactEmailResponse = await sendContactEmail(email, name, message);
    if (contactEmailResponse.status !== 201) {
        return next(new ErrorResponse(contactEmailResponse.message, contactEmailResponse.status));
    }

    const feedbackContactEmailResponse = await sendFeedbackContactEmail(email);
    if (feedbackContactEmailResponse.status !== 201) {
        return next(new ErrorResponse(feedbackContactEmailResponse.message, feedbackContactEmailResponse.status));
    }

    return successResponse(res, 'Contact Email sent successfully')
})

module.exports = {
    sendEmail_post
}