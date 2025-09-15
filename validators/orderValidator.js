const { z } = require('zod');

const orderCreateSchema = z.object({
  customerId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid customerId'),
  orderDate: z.string().datetime().optional(),
  orderAmount: z.number().positive('Order amount must be positive'),
});

const orderUpdateSchema = orderCreateSchema.partial();

const orderIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid orderId'),
});

module.exports = {
  orderCreateSchema,
  orderUpdateSchema,
  orderIdSchema,
};
