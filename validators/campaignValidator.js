const { z } = require('zod');

const statsSchema = z.object({
  sent: z.number().int().min(0).default(0),
  failed: z.number().int().min(0).default(0),
  audienceSize: z.number().int().min(0).default(0),
});

const campaignCreateSchema = z.object({
  name: z.string().min(1, 'Campaign name is required'),
  segmentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid segmentId'),
  message: z.string().min(1, 'Message is required'),
  stats: statsSchema.optional(),
});

const campaignUpdateSchema = campaignCreateSchema.partial();

const campaignIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid campaignId'),
});

module.exports = {
  campaignCreateSchema,
  campaignUpdateSchema,
  campaignIdSchema,
};
