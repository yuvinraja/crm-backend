const { z } = require('zod');

const conditionSchema = z.object({
  field: z.string().min(1),
  operator: z.enum(['>', '<', '>=', '<=', '=', '!=']),
  value: z.union([z.string(), z.number(), z.date()]),
});

const segmentCreateSchema = z.object({
  name: z.string().min(1, 'Segment name is required'),
  conditions: z.array(conditionSchema).nonempty(),
  logic: z.enum(['AND', 'OR']).default('AND'),
  createdBy: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid userId'),
});

const segmentUpdateSchema = segmentCreateSchema.partial();

const segmentIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid segmentId'),
});

module.exports = {
  segmentCreateSchema,
  segmentUpdateSchema,
  segmentIdSchema,
};
