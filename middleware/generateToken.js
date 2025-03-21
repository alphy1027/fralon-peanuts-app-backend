const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const createAccessToken = (user) => {
    return jwt.sign({
        userInfo: {
            userId: user._id,
            user: user.username,
            role: user.role
        }
    },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '20m' })
}

const createRefreshToken = (userId) => {
    return jwt.sign({ userId },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1h' });
}

const generateCryptoToken = () => {
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    return { token, hashedToken }
}

const verifyToken = (token, secret) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (error, decoded) => {
            if (error) {
                return reject(error);
            }
            resolve(decoded);
        })
    })
}

module.exports = {
    createAccessToken,
    createRefreshToken,
    generateCryptoToken,
    verifyToken
}