const asyncHandler = require("../../middlewares/asyncHandler");
const svc = require("./order.service");

const create = asyncHandler(async (req, res) => {
  const draft = await svc.createDraft(req.user.id);
  res.status(201).json(draft);
});

const addItem = asyncHandler(async (req, res) => {
  const orderId = Number(req.params.id);
  try {
    const ord = await svc.addItem(orderId, req.body);
    res.json(ord);
  } catch (err) {
    if (err.message === "PRODUCT_NOT_FOUND")
      return res.status(404).json({ message: "Product not found" });
    if (err.message === "PRODUCT_INACTIVE")
      return res.status(409).json({ message: "Product inactive" });
    throw err;
  }
});

const setMeta = asyncHandler(async (req, res) => {
  const order = await svc.setMeta(Number(req.params.id), req.body);
  res.json(order);
});

const checkout = asyncHandler(async (req, res) => {
  try {
    const paid = await svc.checkout(Number(req.params.id));
    res.json(paid);
  } catch (err) {
    if (err.message === "ORDER_NOT_FOUND")
      return res.status(404).json({ message: "Order not found" });
    if (err.message === "ORDER_NOT_DRAFT")
      return res.status(409).json({ message: "Order is not draft" });
    if (err.message === "ORDER_EMPTY")
      return res.status(400).json({ message: "Order has no items" });
    if (err.message === "INSUFFICIENT_STOCK") {
      return res
        .status(409)
        .json({ message: "Insufficient stock", detail: err.meta });
    }
    throw err;
  }
});

const detail = asyncHandler(async (req, res) => {
  const ord = await svc.getOrder(Number(req.params.id));
  if (!ord) return res.status(404).json({ message: "Not found" });
  res.json(ord);
});

const list = asyncHandler(async (req, res) => {
  const { status, from, to, page, limit } = req.query;
  const data = await svc.listOrders({
    status,
    from,
    to,
    page: Number(page || 1),
    limit: Number(limit || 10),
  });
  res.json(data);
});

module.exports = { create, addItem, setMeta, checkout, detail, list };
