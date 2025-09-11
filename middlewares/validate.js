const { z } = require('zod');

/**
 * Validation middleware factory
 * @param {Object} schemas - Object containing validation schemas
 * @param {z.ZodSchema} schemas.body - Schema for request body
 * @param {z.ZodSchema} schemas.params - Schema for request params
 * @param {z.ZodSchema} schemas.query - Schema for request query
 * @returns {Function} Express middleware function
 */
const validate = (schemas) => {
  return (req, res, next) => {
    try {
      // Validate request body if schema provided
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }

      // Validate request params if schema provided
      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }

      // Validate request query if schema provided
      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
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

      // Handle unexpected errors
      return res.status(500).json({
        success: false,
        message: 'Internal server error during validation',
      });
    }
  };
};

module.exports = validate;
