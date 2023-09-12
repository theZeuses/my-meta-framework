import { z } from 'zod';

export const patchReportSchema = z
  .object({
    email: z.string().email().optional(),
    name: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    profession: z.string().optional(),
    favorite_colors: z.string().array().optional()
  })
  .strict();

export type PatchReportDto = z.infer<typeof patchReportSchema>;