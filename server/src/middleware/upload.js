const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { AppError } = require("../utils/AppError");

const uploadDirectory = path.resolve(__dirname, "../../uploads");
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename(_request, file, callback) {
    const safeExtension = path.extname(file.originalname).toLowerCase().slice(0, 8);
    callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExtension}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(_request, file, callback) {
    if (!file.mimetype.startsWith("image/")) {
      return callback(new AppError("Only image uploads are supported.", 415));
    }
    return callback(null, true);
  },
});

module.exports = { upload, uploadDirectory };
