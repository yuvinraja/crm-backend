const { z } = require('zod');

const customerCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  totalSpending: z.number().nonnegative().optional(),
  lastVisit: z.string().datetime().nullable().optional(),
});

const customerUpdateSchema = customerCreateSchema.partial();

const customerIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid customerId'),
});

module.exports = {
  customerCreateSchema,
  customerUpdateSchema,
  customerIdSchema,
};
