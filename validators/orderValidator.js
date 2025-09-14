const { z } = require('zod');

// Order validation schemas
const orderCreateSchema = z.object({
  customerId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid customer ID format'),
  orderDate: z.string().datetime('Invalid date format').or(z.date()).optional(),
  orderAmount: z.number().positive('Order amount must be positive'),
  status: z
    .enum(['Pending', 'Shipped', 'Delivered', 'Cancelled'])
    .default('Pending')
    .optional(),
});

const orderUpdateSchema = z.object({
  customerId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid customer ID format')
    .optional(),
  orderDate: z.string().datetime('Invalid date format').or(z.date()).optional(),
  orderAmount: z.number().positive('Order amount must be positive').optional(),
  status: z.enum(['Pending', 'Shipped', 'Delivered', 'Cancelled']).optional(),
});

const orderIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid order ID format'),
});

const orderStatusSchema = z.object({
  status: z.enum(['Pending', 'Shipped', 'Delivered', 'Cancelled']),
});

module.exports = {
  orderCreateSchema,
  orderUpdateSchema,
  orderIdSchema,
  orderStatusSchema,
};
