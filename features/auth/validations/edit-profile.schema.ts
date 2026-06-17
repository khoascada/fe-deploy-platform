import { z } from 'zod';
export const createEditProfileSchema = (t: (key: string) => string) => {
  return z.object({
    full_name: z.string().optional(),
    address: z.string().optional(),
    phone_number: z.string().nullable().optional(),
    bio: z.string().optional(),
    dob: z.date().optional(),
    gender: z.enum(['Male', 'Female']).optional(),
    nick_name: z.string().optional(),
    avt_url: z.string().optional(),
  });
};
