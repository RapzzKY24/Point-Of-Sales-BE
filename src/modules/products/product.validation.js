const { z } = require("zod");

const createProductSchema = z.object({
  body: z.object({
    sku: z.string().min(1),
    name: z.string().min(2),
    price: z.coerce.number().nonnegative(),
    stock: z.coerce.number().int().min(0).default(0),
    categoryId: z.coerce.number().int().optional(),
    isActive: z.coerce.boolean().optional(),
  }),
});

const updateProductSchema = z.object({
  params: z.object({ id: z.coerce.number().int() }),
  body: z.object({
    name: z.string().min(2).optional(),
    price: z.coerce.number().nonnegative().optional(),
    stock: z.coerce.number().int().min(0).optional(),
    categoryId: z.coerce.number().int().optional(),
    isActive: z.coerce.boolean().optional(),
    removeImage: z.enum(["true", "false"]).optional(),
  }),
});

const listQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
    categoryId: z.coerce.number().int().optional(),
    onlyActive: z.coerce.boolean().optional(),
  }),
});

module.exports = { createProductSchema, updateProductSchema, listQuerySchema };
