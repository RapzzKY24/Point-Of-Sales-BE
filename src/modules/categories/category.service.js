const prisma = require("../../config/prisma");

async function listCategories({ search, page = 1, limit = 10 }) {
  const where = search
    ? { name: { contains: search, mode: "insensitive" } }
    : {};

  const [items, total] = await Promise.all([
    prisma.category.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.category.count({ where }),
  ]);

  return { items, total, page, limit, pages: Math.ceil(total / limit) };
}

function createCategory({ name }) {
  return prisma.category.create({ data: { name } });
}

function updateCategory(id, data) {
  return prisma.category.update({
    where: { id: Number(id) },
    data,
  });
}

async function deleteCategory(id) {
  // opsional: cegah delete jika masih dipakai product
  const count = await prisma.product.count({
    where: { categoryId: Number(id) },
  });
  if (count > 0) {
    const e = new Error("CATEGORY_IN_USE");
    e.code = "CATEGORY_IN_USE";
    throw e;
  }
  return prisma.category.delete({ where: { id: Number(id) } });
}

module.exports = {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
