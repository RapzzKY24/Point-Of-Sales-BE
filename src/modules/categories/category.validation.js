const { z } = require("zod");

const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, "Minimal 2 karakter"),
  }),
});

const updateCategorySchema = z.object({
  params: z.object({ id: z.coerce.number().int() }),
  body: z.object({
    name: z.string().min(2).optional(),
  }),
});

const listQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
  }),
});

module.exports = {
  createCategorySchema,
  updateCategorySchema,
  listQuerySchema,
};
