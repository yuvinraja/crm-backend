const { z } = require('zod');

// Segment rule validation schema
const segmentRuleSchema = z.object({
  field: z.string().min(1, 'Field is required'),
  operator: z.enum([
    '>',
    '>=',
    '<=',
    '<',
    '=',
    '!=',
    'contains',
    'startsWith',
    'endsWith',
    'in_last_days',
  ]),
  value: z.any(), // Can be string, number, boolean, etc.
  logicalOperator: z.enum(['AND', 'OR']).default('AND').optional(),
});

// Segment validation schemas
const segmentCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Segment name is required')
    .max(200, 'Segment name must be less than 200 characters'),
  description: z
    .string()
    .trim()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  rules: z.array(segmentRuleSchema).min(1, 'At least one rule is required'),
  createdBy: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format')
    .optional(),
});

const segmentUpdateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Segment name is required')
    .max(200, 'Segment name must be less than 200 characters')
    .optional(),
  description: z
    .string()
    .trim()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  rules: z
    .array(segmentRuleSchema)
    .min(1, 'At least one rule is required')
    .optional(),
  createdBy: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format')
    .optional(),
});

const segmentIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid segment ID format'),
});

module.exports = {
  segmentCreateSchema,
  segmentUpdateSchema,
  segmentIdSchema,
  segmentRuleSchema,
};
