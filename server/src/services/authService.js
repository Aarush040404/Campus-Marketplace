const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { hasDatabaseConnection } = require("../config/database");
const User = require("../models/User");
const { memoryStore, persistMemoryStore } = require("../store/memoryStore");
const { AppError } = require("../utils/AppError");

async function findUserById(id) {
  if (hasDatabaseConnection()) return User.findById(id);
  return memoryStore.users.find((user) => user.id === id) || null;
}

async function registerUser(input) {
  const email = input.email.trim().toLowerCase();
  const existing = hasDatabaseConnection()
    ? await User.findOne({ email })
    : memoryStore.users.find((user) => user.email === email);
  if (existing) throw new AppError("An account with that email already exists.", 409);

  const passwordHash = await bcrypt.hash(input.password, 12);
  const userData = {
    name: input.name.trim(),
    email,
    college: input.college.trim(),
    phone: (input.phone || "").trim(),
    passwordHash,
  };

  if (hasDatabaseConnection()) return User.create(userData);

  const user = {
    ...userData,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  memoryStore.users.push(user);
  await persistMemoryStore();
  return user;
}

async function loginUser(emailInput, password) {
  const email = emailInput.trim().toLowerCase();
  const user = hasDatabaseConnection()
    ? await User.findOne({ email }).select("+passwordHash")
    : memoryStore.users.find((item) => item.email === email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new AppError("Email or password is incorrect.", 401);
  }
  return user;
}

module.exports = { findUserById, registerUser, loginUser };
