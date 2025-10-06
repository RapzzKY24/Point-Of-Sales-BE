const express = require("express");
const router = express.Router();
const validate = require("../../middlewares/validate");
const { verifyJWT, requireRole } = require("../../middlewares/auth");
const { daily } = require("./report.controller");
const { summaryRange } = require("./report.controller");
const { dailyReportQuery, rangeReportQuery } = require("./report.validation");

router.use(verifyJWT, requireRole("admin", "cashier"));
router.get("/sales/daily", validate(dailyReportQuery), daily);
router.get("/sales/summary", validate(rangeReportQuery), summaryRange);

module.exports = router;
