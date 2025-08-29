const {
  createAccessToken,
  verifyToken,
  createRefreshToken,
  generateCryptoToken,
} = require("../middleware/generateToken");
const { sendForgotPasswordEmail, sendVerificationEmail, sendWelcomeEmail } = require("../utils/emailTransporter");
const Client = require("../models/client");
const clientService = require("./clientService");
const crypto = require("crypto");
const ErrorResponse = require("../middleware/errorResponse");
const { manageRefreshTokens } = require("../utils/manageRefreshTokens");

class AuthService {
  async registerUser(clientDetails) {
    const { token: verificationToken, hashedToken: hashedVerificationToken } = generateCryptoToken();

    const newUser = await clientService.createNewClient({
      ...clientDetails,
      verificationToken: hashedVerificationToken,
      verificationTokenExpiry: Date.now() + 60 * 30 * 1000, // 1/2 hour
    });
    const emailResponse = await sendVerificationEmail(newUser.email, verificationToken, newUser.username);
    return { emailResponse, newUser };
  }

  async loginUser(email, password, oldToken) {
    // login in user using a custom login static method on client schema
    const user = await Client.login(email, password);
    if (!user.isVerified) throw new ErrorResponse("Please verify your email before logging in", 403);
    user.refreshToken = user.refreshToken.filter((token) => token !== oldToken);
    console.log(user);
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user._id);
    const userWithToken = manageRefreshTokens(user, refreshToken);
    await userWithToken.save();
    return { user: userWithToken, accessToken, refreshToken };
  }

  async logoutUser(refreshToken) {
    const decodedToken = await verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const userId = decodedToken.userId;
    const user = await clientService.getClient({ _id: userId });
    if (!user) {
      throw new ErrorResponse("User not found in the token", 404);
    }
    if (!user.refreshToken.includes(refreshToken)) {
      throw new ErrorResponse("Refresh token not found", 400);
    }
    user.refreshToken = user.refreshToken.filter((token) => token !== refreshToken);
    return await user.save();
  }

  async verifyAccount(emailVerificationToken) {
    const hashedEmailVerificationToken = crypto.createHash("sha256").update(emailVerificationToken).digest("hex");
    const userWithValidToken = await clientService.getClient({
      verificationToken: hashedEmailVerificationToken,
      verificationTokenExpiry: { $gt: Date.now() },
    });
    if (!userWithValidToken) throw new ErrorResponse("Invalid or Expired verification link", 400);
    if (userWithValidToken.isVerified) throw new ErrorResponse("User is already verified", 409);

    userWithValidToken.isVerified = true;
    userWithValidToken.verificationToken = undefined;
    userWithValidToken.verificationTokenExpiry = undefined;
    await userWithValidToken.save();
    return await sendWelcomeEmail(userWithValidToken.email, userWithValidToken.username);
  }

  async refresh(refreshToken) {
    const decodedToken = await verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const foundUser = await clientService.getClient({ _id: decodedToken.userId });

    if (!foundUser) {
      throw new ErrorResponse("Unauthorized, No user in decoded token", 401);
    }
    // Refresh token reuse detected
    if (!foundUser.refreshToken.includes(refreshToken)) {
      throw new ErrorResponse("Unauthorized, Refresh token not valid", 401);
    }
    /*  foundUser.refreshToken = foundUser.refreshToken.filter(token => token !== refreshToken);
         foundUser.save(); */
    const accessToken = createAccessToken(foundUser);
    return { accessToken, user: foundUser };
  }

  async resendEmailVerification(email) {
    const THROTTLE_MS = 60 * 1000;
    const user = await clientService.getClient({ email });
    if (!user) {
      throw new ErrorResponse("Email does not match any current user", 404);
    }
    if (user.isVerified) {
      throw new ErrorResponse("Email is already verified", 400);
    }

    if (user.verificationTokenExpiry - Date.now() > 60 * 30 * 1000 - THROTTLE_MS) {
      throw new ErrorResponse("Please wait at least 1 minute before requesting another verification email", 400);
    }
    const { token: emailVerificationToken, hashedToken: hashedEmailVerificationToken } = generateCryptoToken();

    user.verificationToken = hashedEmailVerificationToken;
    user.verificationTokenExpiry = Date.now() + 60 * 30 * 1000; // 1/2 hour
    await user.save();
    return await sendVerificationEmail(user.email, emailVerificationToken, user.username);
  }

  async resetPassword(password, confirmPassword, resetPasswordToken) {
    if (password !== confirmPassword) throw new ErrorResponse("Passwords you provided do not match", 400);

    const hashedResetPasswordToken = crypto.createHash("sha256").update(resetPasswordToken).digest("hex");
    const user = await clientService.getClient({
      resetPasswordToken: hashedResetPasswordToken,
      resetPasswordTokenExpiry: { $gt: Date.now() },
    });
    if (!user) throw new ErrorResponse("Invalid or Expired reset password link", 404);

    user.password = password;
    user.confirmPassword = confirmPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    return await user.save();
  }

  async sendResetPasswordEmail(email) {
    const user = await clientService.getClient({ email });
    console.log("USER ::", user);
    if (!user) {
      throw new ErrorResponse("Invalid user Email", 404);
    }
    const { token: resetToken, hashedToken: hashedResetToken } = generateCryptoToken();

    user.resetPasswordToken = hashedResetToken;
    user.resetPasswordTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    return await sendForgotPasswordEmail(user.email, resetToken, user.username);
  }
}

module.exports = new AuthService();
