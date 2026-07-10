const mongoose = require("mongoose");

const CATEGORIES = [
  "Books",
  "Electronics",
  "Hostel Essentials",
  "Cycles",
  "Notes",
  "Lab Equipment",
  "Other",
];
const CONDITIONS = ["Brand New", "Like New", "Good", "Used"];
const STATUSES = ["Active", "Paused", "Sold"];

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, trim: true, maxlength: 1200 },
    price: { type: Number, required: true, min: 1, max: 10000000 },
    category: { type: String, required: true, enum: CATEGORIES },
    condition: { type: String, required: true, enum: CONDITIONS },
    location: { type: String, required: true, trim: true, maxlength: 100 },
    image: { type: String, default: "" },
    whatsapp: { type: String, required: true, trim: true, maxlength: 20 },
    status: { type: String, enum: STATUSES, default: "Active" },
    views: { type: Number, default: 0, min: 0 },
    inquiries: { type: Number, default: 0, min: 0 },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

listingSchema.index({ title: "text", description: "text", category: "text" });
listingSchema.index({ status: 1, createdAt: -1 });
listingSchema.index({ seller: 1, createdAt: -1 });

listingSchema.set("toJSON", {
  transform(_document, value) {
    delete value.__v;
    return value;
  },
});

module.exports = {
  Listing: mongoose.model("Listing", listingSchema),
  CATEGORIES,
  CONDITIONS,
  STATUSES,
};
