const { ZodError } = require("zod");

function validate(schema) {
  return (req, res, next) => {
    try {
      // schema = z.object({ body, params, query }).partial()
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res
          .status(400)
          .json({ message: "Validation error", errors: err.errors });
      }
      next(err);
    }
  };
}

module.exports = validate;
