const successResponse = (res, message, payload = null, statusCode = 200) => {

    return res.status(statusCode).json({
        success: true,
        statusCode,
        message,
        ...(payload && { payload })
    })
}

module.exports = successResponse;