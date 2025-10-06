const prisma = require("../../config/prisma");

async function listProducts({
  search,
  page = 1,
  limit = 10,
  categoryId,
  onlyActive,
}) {
  const where = {
    AND: [
      search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { sku: { contains: search, mode: "insensitive" } },
            ],
          }
        : {},
      categoryId ? { categoryId: Number(categoryId) } : {},
      typeof onlyActive === "boolean" ? { isActive: onlyActive } : {},
    ],
  };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return { items, total, page, limit, pages: Math.ceil(total / limit) };
}

function getProduct(id) {
  return prisma.product.findUnique({
    where: { id: Number(id) },
    include: { category: true },
  });
}

function createProduct(data, imageUrl) {
  return prisma.product.create({
    data: { ...data, imageUrl: imageUrl || null },
  });
}

function updateProduct(id, data, imageUrl) {
  const payload = { ...data };
  if (imageUrl !== undefined) payload.imageUrl = imageUrl; // null = hapus
  return prisma.product.update({ where: { id: Number(id) }, data: payload });
}

function deleteProduct(id) {
  return prisma.product.delete({ where: { id: Number(id) } });
}

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
