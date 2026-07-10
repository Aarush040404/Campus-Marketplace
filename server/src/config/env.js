const path = require("path");
const crypto = require("crypto");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

function normalizeMongoUri(value = "") {
  const uri = value.trim();
  if (!uri) return "";
  const queryIndex = uri.indexOf("?");
  const base = queryIndex === -1 ? uri : uri.slice(0, queryIndex);
  const query = queryIndex === -1 ? "" : uri.slice(queryIndex);
  const protocolEnd = base.indexOf("://");
  const lastSlash = base.lastIndexOf("/");
  const hasDatabase = protocolEnd !== -1 && lastSlash > protocolEnd + 2 && base.slice(lastSlash + 1);
  return hasDatabase ? uri : `${base.replace(/\/$/, "")}/campusmarket${query}`;
}

const mongoUri = normalizeMongoUri(process.env.MONGODB_URI);
const derivedJwtSecret = mongoUri
  ? crypto.createHash("sha256").update(`campus-marketplace:${mongoUri}`).digest("hex")
  : "campus-market-dev-secret";

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  mongoUri,
  jwtSecret: process.env.JWT_SECRET || derivedJwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
};

module.exports = { env, normalizeMongoUri };
