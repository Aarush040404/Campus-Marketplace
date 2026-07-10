const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    college: { type: String, required: true, trim: true, maxlength: 120 },
    phone: { type: String, trim: true, maxlength: 20 },
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  transform(_document, value) {
    delete value.passwordHash;
    delete value.__v;
    return value;
  },
});

module.exports = mongoose.model("User", userSchema);
