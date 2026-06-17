import { z } from 'zod';

export const createLoginSchema = (t: (key: string) => string) => {
  return z.object({
    email: z.email(t('validation.emailInvalid')),
    password: z.string().min(1, t('validation.passwordRequired')),
  });
};

// Type inference
export type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;
