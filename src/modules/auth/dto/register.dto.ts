import { z } from 'zod';

export const registerSchema = z
  .object({
    email: z.string().email().nonempty(),
    name: z.string().nonempty(),
    password: z.string().min(8).nonempty(),
    address: z.string().nonempty(),
    phone: z.string().nonempty(),
    profession: z.string().nonempty(),
    favorite_colors: z.string().array().nonempty()
  })
  .required().strict();

export type RegisterDto = z.infer<typeof registerSchema>;