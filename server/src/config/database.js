const mongoose = require("mongoose");
const { env } = require("./env");

async function connectDatabase() {
  if (!env.mongoUri) {
    console.warn("MONGODB_URI is not configured in server/.env.");
    return false;
  }

  try {
    await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log("Connected to MongoDB.");
    return true;
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    return false;
  }
}

function hasDatabaseConnection() {
  return mongoose.connection.readyState === 1;
}

module.exports = { connectDatabase, hasDatabaseConnection };
