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
});

const segmentUpdateSchema = segmentCreateSchema.partial();

const segmentIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid segmentId'),
});

const segmentPreviewSchema = z.object({
  conditions: z
    .array(conditionSchema)
    .min(1, 'At least one condition is required'),
  logic: z.enum(['AND', 'OR']),
});

module.exports = {
  segmentCreateSchema,
  segmentUpdateSchema,
  segmentIdSchema,
  segmentPreviewSchema,
};
