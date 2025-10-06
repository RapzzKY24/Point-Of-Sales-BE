const prisma = require("../../config/prisma");
const { Prisma } = require("@prisma/client");

function dayRange(dateStr) {
  const base = dateStr ? new Date(dateStr + "T00:00:00") : new Date();
  const start = new Date(
    base.getFullYear(),
    base.getMonth(),
    base.getDate(),
    0,
    0,
    0,
    0
  );
  const end = new Date(
    base.getFullYear(),
    base.getMonth(),
    base.getDate() + 1,
    0,
    0,
    0,
    0
  );
  return { start, end };
}

async function dailySales(dateStr) {
  const { start, end } = dayRange(dateStr);
  const wherePaid = { status: "paid", paidAt: { gte: start, lt: end } };

  const [ordersCount, sumGrand, itemsSum, topGroup, ordersForHours] =
    await Promise.all([
      prisma.order.count({ where: wherePaid }),
      prisma.order.aggregate({ where: wherePaid, _sum: { grandTotal: true } }),
      prisma.orderItem.aggregate({
        where: { order: wherePaid },
        _sum: { qty: true },
      }),
      prisma.orderItem.groupBy({
        by: ["productId"],
        where: { order: wherePaid },
        _sum: { qty: true, lineTotal: true },
        orderBy: [{ _sum: { qty: "desc" } }],
        take: 5,
      }),
      prisma.order.findMany({
        where: wherePaid,
        select: { paidAt: true, grandTotal: true },
        orderBy: { paidAt: "asc" },
      }),
    ]);

  const ids = topGroup.map((t) => t.productId);
  const products = ids.length
    ? await prisma.product.findMany({
        where: { id: { in: ids } },
        select: { id: true, name: true, sku: true },
      })
    : [];
  const nameById = Object.fromEntries(
    products.map((p) => [p.id, `${p.name} (${p.sku})`])
  );

  const revenueByHour = Array.from({ length: 24 }, (_, h) => ({
    hour: h,
    revenue: 0,
  }));
  for (const o of ordersForHours) {
    const h = new Date(o.paidAt).getHours();
    revenueByHour[h].revenue += Number(o.grandTotal);
  }

  return {
    date: dateStr || new Date().toISOString().slice(0, 10),
    totalOrders: ordersCount,
    revenue: Number(sumGrand._sum.grandTotal || 0),
    itemsSold: Number(itemsSum._sum.qty || 0),
    topProducts: topGroup.map((t) => ({
      productId: t.productId,
      name: nameById[t.productId] || `#${t.productId}`,
      qty: Number(t._sum.qty || 0),
      sales: Number(t._sum.lineTotal || 0),
    })),
    revenueByHour,
  };
}

function buildRange(fromStr, toStr) {
  const now = new Date();
  const start = fromStr
    ? new Date(`${fromStr}T00:00:00`)
    : new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const end = toStr
    ? new Date(`${toStr}T23:59:59.999`)
    : new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate(),
        23,
        59,
        59,
        999
      );
  return { start, end };
}

async function rangeSales({ from, to, groupBy = "day" }) {
  const { start, end } = buildRange(from, to);

  const wherePaid = { status: "paid", paidAt: { gte: start, lte: end } };

  const [ordersCount, sumGrand, itemsSum] = await Promise.all([
    prisma.order.count({ where: wherePaid }),
    prisma.order.aggregate({ where: wherePaid, _sum: { grandTotal: true } }),
    prisma.orderItem.aggregate({
      where: { order: wherePaid },
      _sum: { qty: true },
    }),
  ]);

  const topRows = await prisma.orderItem.groupBy({
    by: ["productId"],
    where: { order: wherePaid },
    _sum: { qty: true, lineTotal: true },
    orderBy: [{ _sum: { qty: "desc" } }],
    take: 5,
  });
  const pids = topRows.map((r) => r.productId);
  const products = pids.length
    ? await prisma.product.findMany({
        where: { id: { in: pids } },
        select: { id: true, name: true, sku: true },
      })
    : [];
  const nameById = Object.fromEntries(
    products.map((p) => [p.id, `${p.name} (${p.sku})`])
  );

  const trunc =
    groupBy === "week" ? "week" : groupBy === "month" ? "month" : "day";
  const series = await prisma.$queryRaw`
    SELECT
      date_trunc(${Prisma.sql`${trunc}`}, "paidAt") AS bucket,
      SUM("grandTotal")::numeric AS revenue
    FROM "Order"
    WHERE "status" = 'paid' AND "paidAt" >= ${start} AND "paidAt" <= ${end}
    GROUP BY 1
    ORDER BY 1 ASC
  `;
  const seriesOut = series.map((r) => ({
    label: new Date(r.bucket).toISOString(),
    revenue: Number(r.revenue),
  }));

  return {
    from: start.toISOString().slice(0, 10),
    to: end.toISOString().slice(0, 10),
    groupBy,
    totalOrders: ordersCount,
    revenue: Number(sumGrand._sum.grandTotal || 0),
    itemsSold: Number(itemsSum._sum.qty || 0),
    topProducts: topRows.map((r) => ({
      productId: r.productId,
      name: nameById[r.productId] || `#${r.productId}`,
      qty: Number(r._sum.qty || 0),
      sales: Number(r._sum.lineTotal || 0),
    })),
    series: seriesOut,
  };
}

module.exports = { dailySales, rangeSales };
