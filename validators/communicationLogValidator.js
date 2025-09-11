const { z } = require('zod');

// Communication log validation schemas
const communicationLogCreateSchema = z.object({
  campaignId: z.string().regex(/^\d+$/, 'Invalid campaign ID format'),
  customerId: z.string().regex(/^\d+$/, 'Invalid customer ID format'),
  message: z
    .string()
    .trim()
    .min(1, 'Message is required')
    .max(1000, 'Message must be less than 1000 characters'),
  deliveryStatus: z
    .enum(['PENDING', 'SENT', 'FAILED'])
    .default('PENDING')
    .optional(),
  vendorResponse: z
    .object({
      messageId: z.string().optional(),
      timestamp: z.string().datetime().or(z.date()).optional(),
      errorMessage: z.string().optional(),
    })
    .optional(),
  sentAt: z
    .string()
    .datetime('Invalid sent date format')
    .or(z.date())
    .optional(),
  deliveredAt: z
    .string()
    .datetime('Invalid delivered date format')
    .or(z.date())
    .optional(),
});

const communicationLogUpdateSchema = z.object({
  campaignId: z
    .string()
    .regex(/^\d+$/, 'Invalid campaign ID format')
    .optional(),
  customerId: z
    .string()
    .regex(/^\d+$/, 'Invalid customer ID format')
    .optional(),
  message: z
    .string()
    .trim()
    .min(1, 'Message is required')
    .max(1000, 'Message must be less than 1000 characters')
    .optional(),
  deliveryStatus: z.enum(['PENDING', 'SENT', 'FAILED']).optional(),
  vendorResponse: z
    .object({
      messageId: z.string().optional(),
      timestamp: z.string().datetime().or(z.date()).optional(),
      errorMessage: z.string().optional(),
    })
    .optional(),
  sentAt: z
    .string()
    .datetime('Invalid sent date format')
    .or(z.date())
    .optional(),
  deliveredAt: z
    .string()
    .datetime('Invalid delivered date format')
    .or(z.date())
    .optional(),
});

const communicationLogIdSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'Invalid communication log ID format')
    .transform((val) => parseInt(val)),
});

const deliveryStatusSchema = z.object({
  deliveryStatus: z.enum(['PENDING', 'SENT', 'FAILED']),
});

module.exports = {
  communicationLogCreateSchema,
  communicationLogUpdateSchema,
  communicationLogIdSchema,
  deliveryStatusSchema,
};
