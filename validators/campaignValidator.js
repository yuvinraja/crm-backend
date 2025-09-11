const { z } = require('zod');

// Campaign validation schemas
const campaignCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Campaign name is required')
    .max(200, 'Campaign name must be less than 200 characters'),
  segmentId: z.string().regex(/^\d+$/, 'Invalid segment ID format'),
  message: z
    .string()
    .trim()
    .min(1, 'Message is required')
    .max(1000, 'Message must be less than 1000 characters'),
  status: z
    .enum(['Draft', 'Scheduled', 'Running', 'Sent', 'Failed'])
    .default('Draft')
    .optional(),
  scheduledAt: z
    .string()
    .datetime('Invalid scheduled date format')
    .or(z.date())
    .optional(),
  completedAt: z
    .string()
    .datetime('Invalid completed date format')
    .or(z.date())
    .optional(),
  stats: z
    .object({
      totalAudience: z.number().int().min(0).default(0).optional(),
      sent: z.number().int().min(0).default(0).optional(),
      failed: z.number().int().min(0).default(0).optional(),
      pending: z.number().int().min(0).default(0).optional(),
    })
    .optional(),
});

const campaignUpdateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Campaign name is required')
    .max(200, 'Campaign name must be less than 200 characters')
    .optional(),
  segmentId: z.string().regex(/^\d+$/, 'Invalid segment ID format').optional(),
  message: z
    .string()
    .trim()
    .min(1, 'Message is required')
    .max(1000, 'Message must be less than 1000 characters')
    .optional(),
  status: z
    .enum(['Draft', 'Scheduled', 'Running', 'Sent', 'Failed'])
    .optional(),
  scheduledAt: z
    .string()
    .datetime('Invalid scheduled date format')
    .or(z.date())
    .optional(),
  completedAt: z
    .string()
    .datetime('Invalid completed date format')
    .or(z.date())
    .optional(),
  stats: z
    .object({
      totalAudience: z.number().int().min(0).optional(),
      sent: z.number().int().min(0).optional(),
      failed: z.number().int().min(0).optional(),
      pending: z.number().int().min(0).optional(),
    })
    .optional(),
});

const campaignIdSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'Invalid campaign ID format')
    .transform((val) => parseInt(val)),
});

const campaignStatusSchema = z.object({
  status: z.enum(['Draft', 'Scheduled', 'Running', 'Sent', 'Failed']),
});

module.exports = {
  campaignCreateSchema,
  campaignUpdateSchema,
  campaignIdSchema,
  campaignStatusSchema,
};
