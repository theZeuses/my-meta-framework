import { z } from 'zod';

export const loginSchema = z
  .object({
    email: z.string().email().nonempty(),
    password: z.string().nonempty()
  })
  .required().strict();

export type LoginDto = z.infer<typeof loginSchema>;
