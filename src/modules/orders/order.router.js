const express = require("express");
const router = express.Router();

const validate = require("../../middlewares/validate");
const { verifyJWT, requireRole } = require("../../middlewares/auth");
const v = require("./order.validation");
const ctrl = require("./order.controller");

// Semua endpoint order butuh login (cashier/admin)
router.use(verifyJWT, requireRole("cashier", "admin"));

router.post("/", validate(v.createOrderSchema), ctrl.create);
router.post("/:id/items", validate(v.addItemSchema), ctrl.addItem);
router.patch("/:id", validate(v.setMetaSchema), ctrl.setMeta);
router.post("/:id/checkout", validate(v.checkoutSchema), ctrl.checkout);

router.get("/", validate(v.listOrderQuery), ctrl.list);
router.get("/:id", ctrl.detail);

module.exports = router;
