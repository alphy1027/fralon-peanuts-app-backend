const ErrorResponse = require("./errorResponse");

const USER_ROLES = {
  CLIENT: "client",
  ADMIN: "admin",
};

const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRoles = req.user.role;
    if (!userRoles) return next(new ErrorResponse("User has no assigned roles", 404));
    const rolesArray = [...allowedRoles];
    const hasRole = rolesArray.some((role) => userRoles.includes(role));
    if (hasRole) {
      console.log("ACCESS GRANTED");
      next();
    } else {
      console.log("ACCESS DENIED");
      return next(new ErrorResponse("You are not authorized to access this route", 403));
    }
  };
};

module.exports = {
  USER_ROLES,
  verifyRoles,
};
