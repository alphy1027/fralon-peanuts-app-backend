class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode; // custom status code
        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = ErrorResponse;