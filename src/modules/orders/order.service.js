const prisma = require("../../config/prisma");

// helper untuk hitung ulang total
async function recalcTotals(orderId) {
  const items = await prisma.orderItem.findMany({
    where: { orderId },
    select: { qty: true, price: true },
  });
  const subtotal = items.reduce((s, it) => s + Number(it.price) * it.qty, 0);
  const ord = await prisma.order.findUnique({
    where: { id: orderId },
    select: { discountAmount: true, taxAmount: true },
  });
  const discount = Number(ord?.discountAmount || 0);
  const tax = Number(ord?.taxAmount || 0);
  const grand = subtotal - discount + tax;
  await prisma.order.update({
    where: { id: orderId },
    data: { subtotal, grandTotal: grand },
  });
}

async function createDraft(cashierId) {
  const orderNumber = "ORD-" + Date.now();
  return prisma.order.create({
    data: { orderNumber, cashierId, status: "draft" },
  });
}

async function addItem(orderId, { productId, qty }) {
  // ambil price snapshot dari Product
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error("PRODUCT_NOT_FOUND");
  if (!product.isActive) throw new Error("PRODUCT_INACTIVE");

  const price = Number(product.price);
  await prisma.orderItem.create({
    data: {
      orderId,
      productId,
      qty,
      price,
      lineTotal: price * qty,
    },
  });
  await recalcTotals(orderId);

  return prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
}

async function setMeta(orderId, { discountAmount = 0, taxAmount = 0 }) {
  await prisma.order.update({
    where: { id: orderId },
    data: {
      discountAmount,
      taxAmount,
    },
  });
  await recalcTotals(orderId);
  return prisma.order.findUnique({ where: { id: orderId } });
}

async function checkout(orderId) {
  // jalankan dalam transaksi: cek stok → kurangi stok → set status paid
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order) throw new Error("ORDER_NOT_FOUND");
    if (order.status !== "draft") throw new Error("ORDER_NOT_DRAFT");
    if (order.items.length === 0) throw new Error("ORDER_EMPTY");

    // cek stok cukup
    for (const it of order.items) {
      const p = await tx.product.findUnique({ where: { id: it.productId } });
      if (!p) throw new Error("PRODUCT_NOT_FOUND");
      if (p.stock < it.qty) {
        const e = new Error("INSUFFICIENT_STOCK");
        e.meta = {
          productId: p.id,
          name: p.name,
          stock: p.stock,
          need: it.qty,
        };
        throw e;
      }
    }

    // reduce stok
    for (const it of order.items) {
      await tx.product.update({
        where: { id: it.productId },
        data: { stock: { decrement: it.qty } },
      });
    }

    // final recalc + set paid
    await recalcTotals(orderId);
    const updated = await tx.order.update({
      where: { id: orderId },
      data: { status: "paid", paidAt: new Date() },
    });

    return updated;
  });
}

async function getOrder(id) {
  return prisma.order.findUnique({
    where: { id: Number(id) },
    include: {
      items: { include: { product: true } },
      cashier: { select: { id: true, name: true, email: true } },
    },
  });
}

async function listOrders({ status, from, to, page = 1, limit = 10 }) {
  const where = {
    AND: [
      status ? { status } : {},
      from ? { createdAt: { gte: new Date(from) } } : {},
      to ? { createdAt: { lte: new Date(to) } } : {},
    ],
  };
  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { cashier: true },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);
  return { items, total, page, limit, pages: Math.ceil(total / limit) };
}

module.exports = {
  createDraft,
  addItem,
  setMeta,
  checkout,
  getOrder,
  listOrders,
};
