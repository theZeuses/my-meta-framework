import { z } from 'zod';

export const verifyEmailSchema = z
  .object({
    verification_id: z.string().nonempty(),
    code: z.string().nonempty()
  })
  .required().strict();

export type VerifyEmailDto = z.infer<typeof verifyEmailSchema>;
