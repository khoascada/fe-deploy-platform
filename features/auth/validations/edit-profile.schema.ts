import { z } from 'zod';

export const createEditProfileSchema = (t: (key: string) => string) => {
  void t;

  return z.object({
    name: z.string(),
    bio: z.string().optional(),
    dob: z.date().optional(),
    gender: z.enum(['Male', 'Female']).optional(),
    nickName: z.string().optional(),
    avatarUrl: z.string().optional(),
  });
};
