const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");
const { hasDatabaseConnection } = require("../config/database");
const { Listing } = require("../models/Listing");
const { memoryStore, persistMemoryStore } = require("../store/memoryStore");
const { AppError } = require("../utils/AppError");
const { publicListing, publicUser } = require("../utils/serializers");

function normalizeWhatsapp(phone) {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits;
}

async function safeDeleteImage(imagePath) {
  if (!imagePath || typeof imagePath !== "string") return;
  if (!imagePath.startsWith("/uploads/")) return;

  try {
    const filename = path.basename(imagePath);
    const absolutePath = path.resolve(__dirname, "../../uploads", filename);
    await fs.unlink(absolutePath);
    console.log(`Deleted orphaned image: ${absolutePath}`);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error(`Failed to delete file ${imagePath}:`, error.message);
    }
  }
}

function normalizeSellerId(seller) {
  return (seller?._id || seller?.id || seller)?.toString();
}

function parseFilters(query) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(48, Math.max(1, Number(query.limit) || 12));
  return {
    search: (query.search || "").trim(),
    category: (query.category || "").trim(),
    condition: (query.condition || "").trim(),
    status: (query.status || "Active").trim(),
    sort: query.sort || "newest",
    page,
    limit,
  };
}

async function listPublic(query) {
  const filters = parseFilters(query);
  if (hasDatabaseConnection()) {
    const mongoFilter = {};
    if (filters.status !== "All") mongoFilter.status = filters.status;
    if (filters.category && filters.category !== "All") mongoFilter.category = filters.category;
    if (filters.condition && filters.condition !== "All") mongoFilter.condition = filters.condition;
    if (filters.search) {
      const searchTerms = filters.search.trim().split(/\s+/).filter(Boolean);
      const orConditions = [];
      searchTerms.forEach((term) => {
        const termsToMatch = [term];
        if (term.endsWith("s") && term.length > 3) {
          termsToMatch.push(term.slice(0, -1));
        }
        termsToMatch.forEach((t) => {
          const escaped = t.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
          orConditions.push(
            { title: { $regex: escaped, $options: "i" } },
            { description: { $regex: escaped, $options: "i" } },
            { location: { $regex: escaped, $options: "i" } }
          );
        });
      });
      mongoFilter.$or = orConditions;
    }
    const sort = filters.sort === "price-low" ? { price: 1 } :
      filters.sort === "price-high" ? { price: -1 } : { createdAt: -1 };
    const [items, total] = await Promise.all([
      Listing.find(mongoFilter)
        .populate("seller", "name college")
        .sort(sort)
        .skip((filters.page - 1) * filters.limit)
        .limit(filters.limit),
      Listing.countDocuments(mongoFilter),
    ]);
    return {
      items: items.map(publicListing),
      pagination: { page: filters.page, limit: filters.limit, total, pages: Math.ceil(total / filters.limit) },
    };
  }

  const searchTerms = filters.search.toLowerCase().split(/\s+/).filter(Boolean);
  let items = memoryStore.listings.filter((listing) => {
    const haystack = `${listing.title} ${listing.description} ${listing.location} ${listing.category}`.toLowerCase();
    const matchesSearch = searchTerms.every((term) => {
      if (haystack.includes(term)) return true;
      if (term.endsWith("s") && term.length > 3) {
        const singular = term.slice(0, -1);
        if (haystack.includes(singular)) return true;
      }
      return false;
    });

    return (filters.status === "All" || listing.status === filters.status) &&
      (!filters.category || filters.category === "All" || listing.category === filters.category) &&
      (!filters.condition || filters.condition === "All" || listing.condition === filters.condition) &&
      (!filters.search || matchesSearch);
  });
  items.sort((a, b) => filters.sort === "price-low" ? a.price - b.price :
    filters.sort === "price-high" ? b.price - a.price : new Date(b.createdAt) - new Date(a.createdAt));
  const total = items.length;
  items = items.slice((filters.page - 1) * filters.limit, filters.page * filters.limit);
  return {
    items: items.map(publicListing),
    pagination: { page: filters.page, limit: filters.limit, total, pages: Math.ceil(total / filters.limit) },
  };
}

async function getListing(id, incrementView = false) {
  if (hasDatabaseConnection()) {
    const update = incrementView ? { $inc: { views: 1 } } : {};
    const listing = await Listing.findByIdAndUpdate(id, update, { new: true })
      .populate("seller", "name college");
    if (!listing) throw new AppError("Listing not found.", 404);
    return publicListing(listing);
  }
  const listing = memoryStore.listings.find((item) => item.id === id);
  if (!listing) throw new AppError("Listing not found.", 404);
  if (incrementView) {
    listing.views += 1;
    await persistMemoryStore();
  }
  return publicListing(listing);
}

async function getMine(userId, query) {
  if (hasDatabaseConnection()) {
    const filter = { seller: userId };
    if (query.status && query.status !== "All") filter.status = query.status;
    const items = await Listing.find(filter).populate("seller", "name college").sort({ createdAt: -1 });
    return items.map(publicListing);
  }
  return memoryStore.listings
    .filter((listing) => normalizeSellerId(listing.seller) === userId &&
      (!query.status || query.status === "All" || listing.status === query.status))
    .map(publicListing);
}

async function getMineById(userId, id) {
  if (hasDatabaseConnection()) {
    const listing = await Listing.findOne({ _id: id, seller: userId }).populate("seller", "name college");
    if (!listing) throw new AppError("Listing not found or you cannot edit it.", 404);
    return publicListing(listing);
  }
  const listing = memoryStore.listings.find(
    (item) => item.id === id && normalizeSellerId(item.seller) === userId
  );
  if (!listing) throw new AppError("Listing not found or you cannot edit it.", 404);
  return publicListing(listing);
}

async function createListing(user, input) {
  const data = {
    title: input.title.trim(),
    description: input.description.trim(),
    price: Number(input.price),
    category: input.category,
    condition: input.condition,
    location: input.location.trim(),
    whatsapp: normalizeWhatsapp(input.whatsapp),
    image: input.image || "",
    seller: user._id || user.id,
  };
  if (hasDatabaseConnection()) {
    const listing = await Listing.create(data);
    await listing.populate("seller", "name college");
    return publicListing(listing);
  }
  const listing = {
    ...data,
    id: crypto.randomUUID(),
    seller: publicUser(user),
    status: "Active",
    views: 0,
    inquiries: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  memoryStore.listings.unshift(listing);
  await persistMemoryStore();
  return publicListing(listing);
}

async function updateListing(userId, id, input) {
  const allowed = ["title", "description", "price", "category", "condition", "location", "whatsapp", "status", "image"];
  const updates = Object.fromEntries(allowed.filter((key) => input[key] !== undefined).map((key) => [key, input[key]]));
  if (updates.price !== undefined) updates.price = Number(updates.price);
  if (updates.whatsapp !== undefined) updates.whatsapp = normalizeWhatsapp(updates.whatsapp);

  if (hasDatabaseConnection()) {
    const existing = await Listing.findOne({ _id: id, seller: userId });
    if (!existing) throw new AppError("Listing not found or you cannot edit it.", 404);

    const oldImage = existing.image;
    const listing = await Listing.findOneAndUpdate({ _id: id, seller: userId }, updates, {
      new: true,
      runValidators: true,
    }).populate("seller", "name college");

    if (updates.image && oldImage && oldImage !== updates.image) {
      await safeDeleteImage(oldImage);
    }
    return publicListing(listing);
  }

  const index = memoryStore.listings.findIndex(
    (listing) => listing.id === id && normalizeSellerId(listing.seller) === userId
  );
  if (index < 0) throw new AppError("Listing not found or you cannot edit it.", 404);
  
  const oldImage = memoryStore.listings[index].image;
  memoryStore.listings[index] = {
    ...memoryStore.listings[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await persistMemoryStore();

  if (updates.image && oldImage && oldImage !== updates.image) {
    await safeDeleteImage(oldImage);
  }
  return publicListing(memoryStore.listings[index]);
}

async function deleteListing(userId, id) {
  if (hasDatabaseConnection()) {
    const listing = await Listing.findOne({ _id: id, seller: userId });
    if (!listing) throw new AppError("Listing not found or you cannot delete it.", 404);
    
    await Listing.deleteOne({ _id: id, seller: userId });
    if (listing.image) {
      await safeDeleteImage(listing.image);
    }
    return;
  }
  const index = memoryStore.listings.findIndex(
    (listing) => listing.id === id && normalizeSellerId(listing.seller) === userId
  );
  if (index < 0) throw new AppError("Listing not found or you cannot delete it.", 404);
  
  const oldListing = memoryStore.listings[index];
  memoryStore.listings.splice(index, 1);
  await persistMemoryStore();
  
  if (oldListing.image) {
    await safeDeleteImage(oldListing.image);
  }
}

async function trackInquiry(id) {
  if (hasDatabaseConnection()) {
    await Listing.findByIdAndUpdate(id, { $inc: { inquiries: 1 } });
  } else {
    const listing = memoryStore.listings.find((item) => item.id === id);
    if (listing) {
      listing.inquiries += 1;
      await persistMemoryStore();
    }
  }
}

module.exports = { listPublic, getListing, getMine, getMineById, createListing, updateListing, deleteListing, trackInquiry };
