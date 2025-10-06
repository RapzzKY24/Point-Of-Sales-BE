const { z } = require("zod");

const createOrderSchema = z.object({
  body: z.object({}), // draft tidak butuh payload
});

const addItemSchema = z.object({
  params: z.object({ id: z.coerce.number().int() }),
  body: z.object({
    productId: z.coerce.number().int(),
    qty: z.coerce.number().int().min(1),
  }),
});

const setMetaSchema = z.object({
  params: z.object({ id: z.coerce.number().int() }),
  body: z.object({
    discountAmount: z.coerce.number().min(0).default(0),
    taxAmount: z.coerce.number().min(0).default(0),
  }),
});

const checkoutSchema = z.object({
  params: z.object({ id: z.coerce.number().int() }),
});

const listOrderQuery = z.object({
  query: z.object({
    status: z.enum(["draft", "paid", "cancelled"]).optional(),
    from: z.string().optional(), // ISO date
    to: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
  }),
});

module.exports = {
  createOrderSchema,
  addItemSchema,
  setMetaSchema,
  checkoutSchema,
  listOrderQuery,
};
