const express = require("express");
const router = express.Router();

const upload = require("../../libs/uploader");
const validate = require("../../middlewares/validate");
const { verifyJWT, requireRole } = require("../../middlewares/auth");
const {
  createProductSchema,
  updateProductSchema,
  listQuerySchema,
} = require("./product.validation");
const ctrl = require("./product.controller");

// public
router.get("/", validate(listQuerySchema), ctrl.list);
router.get("/:id", ctrl.detail);

// admin only
router.post(
  "/",
  verifyJWT,
  requireRole("admin"),
  upload.single("image"),
  validate(createProductSchema),
  ctrl.create
);
router.patch(
  "/:id",
  verifyJWT,
  requireRole("admin"),
  upload.single("image"),
  validate(updateProductSchema),
  ctrl.update
);
router.delete("/:id", verifyJWT, requireRole("admin"), ctrl.remove);

module.exports = router;
