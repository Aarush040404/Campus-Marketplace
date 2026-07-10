const { verifyToken } = require("../utils/token");
const { AppError } = require("../utils/AppError");
const { findUserById } = require("../services/authService");

async function authenticate(request, _response, next) {
  try {
    const header = request.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    if (!token) throw new AppError("Sign in to continue.", 401);

    const payload = verifyToken(token);
    const user = await findUserById(payload.sub);
    if (!user) throw new AppError("This account no longer exists.", 401);
    request.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return next(new AppError("Your session is invalid or has expired.", 401));
    }
    return next(error);
  }
}

module.exports = { authenticate };
