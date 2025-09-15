const { z } = require('zod');

const vendorResponseSchema = z.object({
  messageId: z.string().optional(),
  timestamp: z.string().datetime().optional(),
  errorMessage: z.string().optional(),
});

const communicationLogCreateSchema = z.object({
  campaignId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid campaignId'),
  customerId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid customerId'),
  deliveryStatus: z.enum(['PENDING', 'SENT', 'FAILED']).default('PENDING'),
  vendorResponse: vendorResponseSchema.optional(),
});

const communicationLogUpdateSchema = communicationLogCreateSchema.partial();

const communicationLogIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid logId'),
});

module.exports = {
  communicationLogCreateSchema,
  communicationLogUpdateSchema,
  communicationLogIdSchema,
};
