const { z } = require("zod");

const userCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  googleId: z.string().optional(),
  provider: z.enum(["google", "local"]).default("local"),
  avatar: z.string().url().optional(),
});

const userUpdateSchema = userCreateSchema.partial();

const userIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid userId"),
});

module.exports = {
  userCreateSchema,
  userUpdateSchema,
  userIdSchema,
};
