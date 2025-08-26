const { Template } = require("ejs");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");

// Configure Nodemailer with your email service provider details
const transporter = nodemailer.createTransport({
  service: "Gmail", // Use your email service
  auth: {
    user: process.env.GMAIL_USER, // Your email address
    pass: process.env.GMAIL_PASS, // Your email password
  },
  tls: {
    rejectUnauthorized: false, // Ignore self-signed certificate error
  },
});

const hbsOptions = {
  viewEngine: {
    extName: ".handlebars",
    partialsDir: path.resolve(__dirname, "../views/partials"),
    layoutDir: path.resolve(__dirname, "../views"),
    defaultLayout: false,
  },
  viewPath: path.resolve(__dirname, "../views"),
  extName: ".handlebars",
};

transporter.use("compile", hbs(hbsOptions));

const sendVerificationEmail = (email, token, username) => {
  const verifyEmailUrl = `${process.env.FRONTEND_URL}/auth/verify-email/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email verification",
    template: "verificationEmail",
    context: {
      emailHeading: "Verify Email",
      verifyEmailUrl,
      username,
    },
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        reject({
          status: 500,
          message: "Failed to send verification Email, check your connection",
          error: err.message,
        });
      }
      resolve({ status: 201, message: "Verification Email sent successfully" });
    });
  });
};

const sendWelcomeEmail = (email, username) => {
  const homepageUrl = `${process.env.FRONTEND_URL}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verification completed",
    template: "welcomeEmail",
    context: {
      emailHeading: "Welcome!",
      homepageUrl,
      username,
    },
  };
  console.log(path.resolve(__dirname, "../views"));
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        reject({ status: 500, message: err.message });
        console.log(err);
      }
      resolve({ status: 201, message: "Welcome Email sent successfully" });
    });
  });
};

const sendForgotPasswordEmail = (email, token, username) => {
  const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  console.log(resetPasswordUrl);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset",
    template: "resetPassword",
    context: {
      emailHeading: "Reset password",
      resetPasswordUrl,
      username,
    },
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        reject({
          status: 500,
          message: "Failed to send reset password Email, check your connection",
          error: err.message,
        });
      }
      resolve({ status: 201, message: "Reset password Email sent successfully" });
    });
  });
};

const sendContactEmail = (email, name, message) => {
  const mailOptions = {
    from: email,
    to: process.env.GMAIL_USER,
    subject: `You have new Contact Form submission from ${name}`,
    text: message,
    html: `<p>You have a new contact form submission from ${name}</p>
        <h2>Contact details</h2>
        <ul>
        <li>Name : ${name}</li>
        <li>Email : ${email}</li>
        </ul>
        <p>${message}</p>`,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        reject({ status: 500, message: err.message });
      }
      resolve({ status: 201, message: "Contact Email sent successfully" });
    });
  });
};

const sendFeedbackContactEmail = (email) => {
  const feedbackMailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: `Thank you for contacting us!`,
    html: `<h1>Thank You for Contacting Us</h1>
            <h2>Hello,</h2>
            <p>We have received your message and would like to thank you for writing to us.</p>
            <p>One of our team members will get back to you shortly. In the meantime, you can browse our <a href="https://yourwebsite.com">website</a> or follow us on social media for the latest updates.</p>
            <p>Best regards,</p>
            <p><strong>Fralon Peanuts</p>
            <p>&copy; 2024 Fralon Peanuts. All rights reserved.</p>`,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(feedbackMailOptions, (err, info) => {
      if (err) {
        reject({ status: 500, message: err.message });
      }
      resolve({ status: 201, message: "Contact Email sent successfully" });
    });
  });
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendForgotPasswordEmail,
  sendContactEmail,
  sendFeedbackContactEmail,
};
