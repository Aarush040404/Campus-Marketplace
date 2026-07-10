const { AppError } = require("../utils/AppError");

function notFound(request, _response, next) {
  next(new AppError(`Route ${request.method} ${request.originalUrl} was not found.`, 404));
}

function errorHandler(error, _request, response, _next) {
  if (error.code === 11000) {
    error = new AppError("An account with that email already exists.", 409);
  }
  if (error.name === "ValidationError") {
    error = new AppError(
      "Some submitted fields are invalid.",
      422,
      Object.values(error.errors).map((item) => item.message)
    );
  }
  if (error.code === "LIMIT_FILE_SIZE") {
    error = new AppError("The image must be smaller than 5 MB.", 413);
  }

  const status = error.statusCode || 500;
  if (status >= 500) console.error(error);
  response.status(status).json({
    success: false,
    message: status >= 500 && !error.isOperational ? "Something went wrong." : error.message,
    details: error.details,
  });
}

module.exports = { notFound, errorHandler };
