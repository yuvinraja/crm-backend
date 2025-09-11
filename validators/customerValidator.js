const { z } = require('zod');

// Customer validation schemas
const customerCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email format').toLowerCase(),
  phone: z
    .string()
    .trim()
    .regex(/^[\+]?[0-9\s\-\(\)]+$/, 'Invalid phone number format')
    .optional(),
  totalSpending: z
    .number()
    .min(0, 'Total spending must be positive')
    .default(0)
    .optional(),
  visits: z
    .number()
    .int('Visits must be an integer')
    .min(0, 'Visits must be positive')
    .default(0)
    .optional(),
  lastVisit: z.string().datetime('Invalid date format').or(z.date()).optional(),
  isActive: z.boolean().default(true).optional(),
});

const customerUpdateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .optional(),
  email: z.string().email('Invalid email format').toLowerCase().optional(),
  phone: z
    .string()
    .trim()
    .regex(/^[\+]?[0-9\s\-\(\)]+$/, 'Invalid phone number format')
    .optional(),
  totalSpending: z
    .number()
    .min(0, 'Total spending must be positive')
    .optional(),
  visits: z
    .number()
    .int('Visits must be an integer')
    .min(0, 'Visits must be positive')
    .optional(),
  lastVisit: z.string().datetime('Invalid date format').or(z.date()).optional(),
  isActive: z.boolean().optional(),
});

const customerIdSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'Invalid customer ID format')
    .transform((val) => parseInt(val)),
});

module.exports = {
  customerCreateSchema,
  customerUpdateSchema,
  customerIdSchema,
};
