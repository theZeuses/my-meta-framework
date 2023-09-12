import { z } from 'zod';

export const createReportSchema = z
  .object({
    email: z.string().email().nonempty(),
    name: z.string().nonempty(),
    address: z.string().nonempty(),
    phone: z.string().nonempty(),
    profession: z.string().nonempty(),
    favorite_colors: z.string().array().nonempty()
  })
  .required().strict();

export type CreateReportDto = z.infer<typeof createReportSchema>;