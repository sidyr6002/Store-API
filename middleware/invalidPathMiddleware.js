const invalidPathHandler = (req, res, next) => {
    const error = new Error('Invalid path');
    error.statusCode = 404; // Not Found
    next(error); // Pass the error to the error handler
};

module.exports = invalidPathHandler
