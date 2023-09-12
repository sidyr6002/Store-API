const AppError = require(`./appError`);

const invalidPathHandler = (req, res, next) => {
    const error = new AppError(404, "Invalid path");
    next(error);
};

module.exports = invalidPathHandler;
