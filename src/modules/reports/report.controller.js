const asyncHandler = require("../../middlewares/asyncHandler");
const { dailySales, rangeSales } = require("./report.service");

const daily = asyncHandler(async (req, res) => {
  const { date } = req.query;
  res.json(await dailySales(date));
});

const summaryRange = asyncHandler(async (req, res) => {
  const { from, to, groupBy = "day" } = req.query;
  res.json(await rangeSales({ from, to, groupBy }));
});

module.exports = { daily, summaryRange };
