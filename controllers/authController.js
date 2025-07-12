const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../middleware/errorResponse");
const successResponse = require("../middleware/successResponse");
const authService = require("../services/authService");

// creating new user
const createNewUser_post = asyncHandler(async (req, res, next) => {
  const { username, email, phoneNumber, password, confirmPassword } = req.body;
  if (!username || !email || !phoneNumber || !password || !confirmPassword) {
    return next(new ErrorResponse("All fields are required", 400));
  }
  const { emailResponse, newUser } = await authService.registerUser(req.body);
  return successResponse(res, emailResponse.message, { newUser }, emailResponse.status);
});
// logging in user
const loginUser_post = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const oldToken = req.cookies.jwt;
  const { user, accessToken, refreshToken } = await authService.loginUser(email, password, oldToken);

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 1000, //time in milliseconds
  });

  return successResponse(res, "Login was successfull", {
    token: {
      accessToken,
      roles: user.role,
      username: user.username,
      userId: user._id,
    },
  });
});
// logging out user
const logout_post = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies.jwt;
  if (!refreshToken) {
    return next(new ErrorResponse("No refresh token found", 400));
  }
  await authService.logoutUser(refreshToken);
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production",
  });
  return successResponse(res, "Logout successfull");
});
// refreshing tokens
const refresh_post = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies.jwt;
  if (!refreshToken) return next(new ErrorResponse("Unauthorized, No refresh token provided", 401));
  const { accessToken, user } = await authService.refresh(refreshToken);
  return successResponse(res, "Tokens refreshed successfully", {
    newToken: {
      accessToken,
      roles: user.role,
      username: user.username,
      userId: user._id,
    },
  });
});
//verify email
const emailVerification_get = asyncHandler(async (req, res, next) => {
  const emailVerificationToken = req.params.verificationToken;
  const welcomeEmail = await authService.verifyAccount(emailVerificationToken);
  return successResponse(res, welcomeEmail.message, null, welcomeEmail.status);
});
//reset password
const resetPassword_post = asyncHandler(async (req, res, next) => {
  const { resetPasswordToken } = req.params;
  const { password, confirmPassword } = req.body;
  await authService.resetPassword(password, confirmPassword, resetPasswordToken);
  return successResponse(res, "Password updated successfully");
});
// resending verification email
const resendEmailVerification_post = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  console.log(email);
  if (!email) return next(new ErrorResponse("Email is required", 400));
  const emailResponse = await authService.resendEmailVerification(email);
  return successResponse(res, emailResponse.message, null, emailResponse.status);
});
//resend reset passward email
const sendResetPasswordEmail_post = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new ErrorResponse("Email is required", 400));
  const forgotPasswordEmailResponse = await authService.sendResetPasswordEmail(email);
  return successResponse(res, forgotPasswordEmailResponse.message, null, forgotPasswordEmailResponse.status);
});

module.exports = {
  createNewUser_post,
  loginUser_post,
  refresh_post,
  logout_post,
  emailVerification_get,
  resetPassword_post,
  resendEmailVerification_post,
  sendResetPasswordEmail_post,
};
