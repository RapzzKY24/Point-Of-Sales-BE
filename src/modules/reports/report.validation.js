const { z } = require("zod");

const dailyReportQuery = z.object({
  query: z.object({
    date: z.string().optional(), // 'YYYY-MM-DD'
  }),
});

const rangeReportQuery = z.object({
  query: z.object({
    from: z.string().optional(),
    to: z.string().optional(),
    groupBy: z.enum(["day", "week", "month"]).optional(),
  }),
});

module.exports = { dailyReportQuery, rangeReportQuery };
