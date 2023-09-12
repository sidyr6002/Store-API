const errorHandler = async (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    console.error("error:", err.message)
    res.status(statusCode).json({
        success: false,
        message: "An unexpected error occurred. Please try again later.",
        error: err.message,
    });
};

module.exports = errorHandler;
