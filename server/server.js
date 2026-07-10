const { createApp } = require("./src/app");
const { connectDatabase } = require("./src/config/database");
const { env } = require("./src/config/env");

async function startServer() {
  const dbConnected = await connectDatabase();

  if (!dbConnected) {
    const { initializeMemoryStore } = require("./src/store/memoryStore");
    await initializeMemoryStore();
    console.log("Running in local memory-store mode (no active MongoDB connection).");
  }

  const app = createApp();
  app.listen(env.port, () => {
    console.log(
      `CampusMarket API running on http://localhost:${env.port} (${
        dbConnected ? "MongoDB connected" : "In-memory store"
      })`
    );
  });
}

startServer().catch((error) => {
  console.error("Unable to start server:", error);
  process.exit(1);
});
