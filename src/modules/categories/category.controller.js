const asyncHandler = require("../../middlewares/asyncHandler");
const {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("./category.service");

const list = asyncHandler(async (req, res) => {
  const { search, page, limit } = req.query;
  const result = await listCategories({
    search,
    page: Number(page || 1),
    limit: Number(limit || 10),
  });
  res.json(result);
});

const create = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const created = await createCategory({ name });
  res.status(201).json(created);
});

const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updated = await updateCategory(id, req.body);
  res.json(updated);
});

const remove = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    await deleteCategory(id);
    res.json({ message: "Deleted" });
  } catch (err) {
    if (err.code === "CATEGORY_IN_USE") {
      return res
        .status(409)
        .json({ message: "Category still used by products" });
    }
    throw err;
  }
});

module.exports = { list, create, update, remove };
