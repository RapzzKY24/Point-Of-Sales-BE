const express = require("express");
const router = express.Router();

const validate = require("../../middlewares/validate");
const { verifyJWT, requireRole } = require("../../middlewares/auth");

const { registerSchema, loginSchema } = require("./auth.validation");
const ctrl = require("./auth.controller");

router.post(
  "/register",
  verifyJWT,
  requireRole("admin"),
  validate(registerSchema),
  ctrl.register
);

router.post("/login", validate(loginSchema), ctrl.login);

router.get("/me", verifyJWT, ctrl.me);

module.exports = router;
