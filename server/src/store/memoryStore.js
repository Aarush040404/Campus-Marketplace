const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");
const { seedListings } = require("../data/seedData");

const storePath = path.resolve(__dirname, "../../data/local-store.json");
const memoryStore = {
  users: [],
  listings: [],
};
let writeQueue = Promise.resolve();

async function persistMemoryStore() {
  if (process.env.CAMPUSMARKET_DISABLE_PERSISTENCE === "1") return;
  const snapshot = JSON.stringify(memoryStore, null, 2);
  writeQueue = writeQueue.then(async () => {
    await fs.mkdir(path.dirname(storePath), { recursive: true });
    const temporaryPath = `${storePath}.tmp`;
    await fs.writeFile(temporaryPath, snapshot, "utf8");
    await fs.rename(temporaryPath, storePath);
  });
  await writeQueue;
}

async function initializeMemoryStore() {
  if (memoryStore.users.length) return;
  if (process.env.CAMPUSMARKET_DISABLE_PERSISTENCE !== "1") {
    try {
      const saved = JSON.parse(await fs.readFile(storePath, "utf8"));
      if (Array.isArray(saved.users) && Array.isArray(saved.listings) && saved.users.length) {
        memoryStore.users.push(...saved.users);
        memoryStore.listings.push(...saved.listings);
        return;
      }
    } catch (error) {
      if (error.code !== "ENOENT") console.warn(`Could not read local account store: ${error.message}`);
    }
  }

  const user = {
    id: crypto.randomUUID(),
    name: "Demo Student",
    email: "demo@campusmarket.in",
    college: "CampusMarket Demo University",
    phone: "9876543210",
    passwordHash: await bcrypt.hash("Demo@123", 10),
    createdAt: new Date().toISOString(),
  };

  memoryStore.users.push(user);
  memoryStore.listings.push(
    ...seedListings.map((listing, index) => ({
      ...listing,
      id: crypto.randomUUID(),
      seller: {
        id: user.id,
        name: user.name,
        college: user.college,
      },
      createdAt: new Date(Date.now() - index * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    }))
  );
  await persistMemoryStore();
}

module.exports = { memoryStore, initializeMemoryStore, persistMemoryStore };
