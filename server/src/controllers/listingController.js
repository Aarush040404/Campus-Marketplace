const listingService = require("../services/listingService");
const { CATEGORIES, CONDITIONS, STATUSES } = require("../models/Listing");
const { AppError } = require("../utils/AppError");

function validateListing(body, partial = false) {
  const errors = [];
  const required = ["title", "description", "price", "category", "condition", "location", "whatsapp"];
  if (!partial) required.forEach((field) => {
    if (body[field] === undefined || String(body[field]).trim() === "") errors.push(`${field} is required.`);
  });
  if (body.title !== undefined && body.title.trim().length < 4) errors.push("Title must be at least 4 characters.");
  if (body.description !== undefined && body.description.trim().length < 15) errors.push("Description must be at least 15 characters.");
  if (body.price !== undefined && (!Number.isFinite(Number(body.price)) || Number(body.price) < 1)) errors.push("Price must be at least ₹1.");
  if (body.category !== undefined && !CATEGORIES.includes(body.category)) errors.push("Choose a valid category.");
  if (body.condition !== undefined && !CONDITIONS.includes(body.condition)) errors.push("Choose a valid condition.");
  if (body.status !== undefined && !STATUSES.includes(body.status)) errors.push("Choose a valid status.");
  if (body.whatsapp !== undefined && body.whatsapp.replace(/\D/g, "").length < 10) errors.push("Enter a valid WhatsApp number.");
  if (errors.length) throw new AppError("Please correct the listing details.", 422, errors);
}

async function list(request, response) {
  const result = await listingService.listPublic(request.query);
  response.json({ success: true, data: result });
}

async function getOne(request, response) {
  const listing = await listingService.getListing(request.params.id, true);
  response.json({ success: true, data: { listing } });
}

async function mine(request, response) {
  const listings = await listingService.getMine((request.user._id || request.user.id).toString(), request.query);
  response.json({ success: true, data: { listings } });
}

async function mineOne(request, response) {
  const listing = await listingService.getMineById(
    (request.user._id || request.user.id).toString(),
    request.params.id
  );
  response.json({ success: true, data: { listing } });
}

async function create(request, response) {
  const input = { ...request.body };
  if (request.file) input.image = `/uploads/${request.file.filename}`;
  validateListing(input);
  const listing = await listingService.createListing(request.user, input);
  response.status(201).json({ success: true, data: { listing } });
}

async function update(request, response) {
  const input = { ...request.body };
  if (request.file) input.image = `/uploads/${request.file.filename}`;
  validateListing(input, true);
  const listing = await listingService.updateListing(
    (request.user._id || request.user.id).toString(),
    request.params.id,
    input
  );
  response.json({ success: true, data: { listing } });
}

async function remove(request, response) {
  await listingService.deleteListing((request.user._id || request.user.id).toString(), request.params.id);
  response.status(204).send();
}

async function inquiry(request, response) {
  await listingService.trackInquiry(request.params.id);
  response.status(204).send();
}

module.exports = { list, getOne, mine, mineOne, create, update, remove, inquiry };
