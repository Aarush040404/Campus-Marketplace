const { registerUser, loginUser } = require("../services/authService");
const { createToken } = require("../utils/token");
const { publicUser } = require("../utils/serializers");
const { AppError } = require("../utils/AppError");

function validateRegistration(body) {
  const errors = [];
  if (!body.name?.trim() || body.name.trim().length < 2) errors.push("Name must be at least 2 characters.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email || "")) errors.push("Enter a valid email address.");
  if (!body.college?.trim()) errors.push("College name is required.");
  if (!body.password || body.password.length < 8) errors.push("Password must be at least 8 characters.");
  if (errors.length) throw new AppError("Please correct the highlighted details.", 422, errors);
}

async function register(request, response) {
  validateRegistration(request.body);
  const user = await registerUser(request.body);
  response.status(201).json({
    success: true,
    data: { user: publicUser(user), token: createToken(user._id || user.id) },
  });
}

async function login(request, response) {
  if (!request.body.email || !request.body.password) {
    throw new AppError("Email and password are required.", 422);
  }
  const user = await loginUser(request.body.email, request.body.password);
  response.json({
    success: true,
    data: { user: publicUser(user), token: createToken(user._id || user.id) },
  });
}

async function me(request, response) {
  response.json({ success: true, data: { user: publicUser(request.user) } });
}

module.exports = { register, login, me };
