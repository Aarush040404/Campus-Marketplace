process.env.CAMPUSMARKET_DISABLE_PERSISTENCE = "1";

const assert = require("node:assert/strict");
const { createApp } = require("../src/app");
const { initializeMemoryStore } = require("../src/store/memoryStore");

async function request(baseUrl, path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, options);
  const data = response.status === 204 ? null : await response.json();
  if (!response.ok) {
    throw new Error(`${options.method || "GET"} ${path}: ${response.status} ${JSON.stringify(data)}`);
  }
  return data;
}

async function run() {
  await initializeMemoryStore();
  const server = createApp().listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  try {
    const health = await request(baseUrl, "/api/health");
    assert.equal(health.data.status, "ok");

    const session = await request(baseUrl, "/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "demo@campusmarket.in", password: "Demo@123" }),
    });
    assert.ok(session.data.token);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.data.token}`,
    };

    const listingResponse = await request(baseUrl, "/api/listings", {
      method: "POST",
      headers,
      body: JSON.stringify({
        title: "Integration Test Textbook",
        description: "A temporary listing created by the automated integration check.",
        price: 399,
        category: "Books",
        condition: "Good",
        location: "Library entrance",
        whatsapp: "919876543210",
      }),
    });
    const listing = listingResponse.data.listing;
    assert.equal(listing.status, "Active");

    const updated = await request(baseUrl, `/api/listings/${listing.id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status: "Paused" }),
    });
    assert.equal(updated.data.listing.status, "Paused");

    const mine = await request(baseUrl, "/api/listings/mine", { headers });
    assert.ok(mine.data.listings.some((item) => item.id === listing.id));

    await request(baseUrl, `/api/listings/${listing.id}`, { method: "DELETE", headers });
    console.log("API smoke test passed: health, login, create, update, owner list, and delete.");
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
