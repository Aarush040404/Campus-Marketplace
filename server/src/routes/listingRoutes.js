const express = require("express");
const controller = require("../controllers/listingController");
const { authenticate } = require("../middleware/authenticate");
const { upload } = require("../middleware/upload");
const { asyncHandler } = require("../utils/asyncHandler");

const router = express.Router();
router.get("/", asyncHandler(controller.list));
router.get("/mine", authenticate, asyncHandler(controller.mine));
router.get("/mine/:id", authenticate, asyncHandler(controller.mineOne));
router.get("/:id", asyncHandler(controller.getOne));
router.post("/", authenticate, upload.single("image"), asyncHandler(controller.create));
router.patch("/:id", authenticate, upload.single("image"), asyncHandler(controller.update));
router.delete("/:id", authenticate, asyncHandler(controller.remove));
router.post("/:id/inquiry", asyncHandler(controller.inquiry));

module.exports = router;
