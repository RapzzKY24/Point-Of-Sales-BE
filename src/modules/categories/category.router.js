const express = require("express");
const router = express.Router();

const validate = require("../../middlewares/validate");
const { verifyJWT, requireRole } = require("../../middlewares/auth");

const {
  createCategorySchema,
  updateCategorySchema,
  listQuerySchema,
} = require("./category.validation");
const ctrl = require("./category.controller");

// public list
router.get("/", validate(listQuerySchema), ctrl.list);

// admin-only
router.post(
  "/",
  verifyJWT,
  requireRole("admin"),
  validate(createCategorySchema),
  ctrl.create
);
router.patch(
  "/:id",
  verifyJWT,
  requireRole("admin"),
  validate(updateCategorySchema),
  ctrl.update
);
router.delete("/:id", verifyJWT, requireRole("admin"), ctrl.remove);

module.exports = router;
