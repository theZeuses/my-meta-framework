import { z } from 'zod';

export const patchUserSchema = z
  .object({
    email: z.string().email(),
    name: z.string(),
    address: z.string(),
    phone: z.string(),
    profession: z.string(),
    favorite_colors: z.string().array()
  })
  .required().strict();

export type PatchUserDto = z.infer<typeof patchUserSchema>;