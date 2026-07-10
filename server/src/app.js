const path = require("path");
const express = require("express");
const cors = require("cors");
const { env } = require("./config/env");
const authRoutes = require("./routes/authRoutes");
const listingRoutes = require("./routes/listingRoutes");
const { notFound, errorHandler } = require("./middleware/errors");
const { uploadDirectory } = require("./middleware/upload");

function createApp() {
  const app = express();
  app.disable("x-powered-by");
  app.use(cors({ origin: env.clientOrigin.split(",").map((item) => item.trim()), credentials: false }));
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use("/uploads", express.static(uploadDirectory, { maxAge: env.nodeEnv === "production" ? "7d" : 0 }));

  app.get("/api/health", (_request, response) => {
    response.json({ success: true, data: { service: "CampusMarket API", status: "ok" } });
  });
  app.use("/api/auth", authRoutes);
  app.use("/api/listings", listingRoutes);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
