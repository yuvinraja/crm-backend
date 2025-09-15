const { z, ZodError } = require('zod');

/**
 * Validation middleware factory
 * @param {Object} schemas - Object containing validation schemas
 * @param {z.ZodSchema} [schemas.body] - Schema for request body
 * @param {z.ZodSchema} [schemas.params] - Schema for request params
 * @param {z.ZodSchema} [schemas.query] - Schema for request query
 * @returns {Function} Express middleware function
 */
const validate = (schemas) => {
  return (req, res, next) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body);
      if (schemas.params) req.params = schemas.params.parse(req.params);
      if (schemas.query) req.query = schemas.query.parse(req.query);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        }));

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errorMessages,
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Internal server error during validation',
      });
    }
  };
};

module.exports = validate;
