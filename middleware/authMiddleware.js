const jwt = require('jsonwebtoken');
const ErrorResponse = require('./errorResponse');

const checkAuth = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return next(new ErrorResponse('Unauthorized, No token provided, check auth', 401));
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decodedToken) => {
        if (error) {
            if (error.message === 'jwt expired') {
                return next(new ErrorResponse('Unauthorized, token expired', 401));
            }
            return next(new ErrorResponse('Forbidden, Invalid token', 403));
        } else {
            req.user = {
                username: decodedToken.userInfo.user,
                userId: decodedToken.userInfo.userId,
                role: decodedToken.userInfo.role
            }
            next()
        }
    })
}

module.exports = {
    checkAuth
}