const manageRefreshTokens = (user, newToken) => {
  //Remove any instance of this token
  user.refreshToken = user.refreshToken.filter((token) => token !== newToken);
  //Add new token to the end
  user.refreshToken.push(newToken);
  //Keep only the last two tokens
  user.refreshToken = user.refreshToken.slice(-2);
  return user;
};

module.exports = { manageRefreshTokens };
