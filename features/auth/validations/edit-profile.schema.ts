import { z } from 'zod';

export const createEditProfileSchema = (t: (key: string) => string) => {
  void t;

  return z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    avatarUrl: z.string().optional().or(z.literal('')),
  });
};
