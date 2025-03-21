const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Server Error'

    // Duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        message = `${field} you entered is already in use`;
        statusCode = 409
    }
    console.log(err)
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        error: err
        //  stack: process.env.NODE_ENV === 'development' ? err.stack : null
    })
}

module.exports = errorHandler;