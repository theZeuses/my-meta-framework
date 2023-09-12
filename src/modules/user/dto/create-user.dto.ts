import { z } from 'zod';

export const createUserSchema = z
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

export type CreateUserDto = z.infer<typeof createUserSchema>;