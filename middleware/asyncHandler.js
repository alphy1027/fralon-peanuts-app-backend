const asyncHandler = (func) => (req, res, next) => {
    //if it fails the catch passes the error to next
    func(req, res, next).catch(next);
}

module.exports = asyncHandler;