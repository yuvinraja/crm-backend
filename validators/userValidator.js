const { z } = require('zod');

// User validation schemas
const userCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email format').toLowerCase(),
  age: z
    .number()
    .int('Age must be an integer')
    .min(0, 'Age must be a positive number')
    .max(150, 'Age must be less than 150')
    .optional(),
});

const userUpdateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .optional(),
  email: z.string().email('Invalid email format').toLowerCase().optional(),
  age: z
    .number()
    .int('Age must be an integer')
    .min(0, 'Age must be a positive number')
    .max(150, 'Age must be less than 150')
    .optional(),
});

const userIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
});

module.exports = {
  userCreateSchema,
  userUpdateSchema,
  userIdSchema,
};
