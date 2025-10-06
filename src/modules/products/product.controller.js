const asyncHandler = require("../../middlewares/asyncHandler");
const svc = require("./product.service");

const list = asyncHandler(async (req, res) => {
  const { search, page, limit, categoryId, onlyActive } = req.query;

  const onlyActiveBool =
    typeof onlyActive === "string" ? onlyActive === "true" : undefined;

  const result = await svc.listProducts({
    search,
    page: Number(page || 1),
    limit: Number(limit || 10),
    categoryId,
    onlyActive: onlyActiveBool,
  });
  res.json(result);
});

const detail = asyncHandler(async (req, res) => {
  const item = await svc.getProduct(req.params.id);
  if (!item) return res.status(404).json({ message: "Not found" });
  res.json(item);
});

const create = asyncHandler(async (req, res) => {
  const b = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
  const created = await svc.createProduct(
    {
      sku: b.sku,
      name: b.name,
      price: Number(b.price),
      stock: Number(b.stock || 0),
      categoryId: b.categoryId ? Number(b.categoryId) : undefined,
      isActive:
        typeof b.isActive === "string" ? b.isActive === "true" : b.isActive,
    },
    imageUrl
  );
  res.status(201).json(created);
});

const update = asyncHandler(async (req, res) => {
  const b = req.body;
  const imageUrl = req.file
    ? `/uploads/${req.file.filename}`
    : b.removeImage === "true"
    ? null
    : undefined;
  const updated = await svc.updateProduct(
    req.params.id,
    {
      name: b.name,
      price: b.price !== undefined ? Number(b.price) : undefined,
      stock: b.stock !== undefined ? Number(b.stock) : undefined,
      categoryId: b.categoryId ? Number(b.categoryId) : undefined,
      isActive:
        typeof b.isActive === "string" ? b.isActive === "true" : b.isActive,
    },
    imageUrl
  );
  res.json(updated);
});

const remove = asyncHandler(async (req, res) => {
  await svc.deleteProduct(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = { list, detail, create, update, remove };
