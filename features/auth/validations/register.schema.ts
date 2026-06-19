import { z } from 'zod';

/**
 * Dynamic register schema that accepts translation function
 * @param t - Translation function from useTranslations
 */
export const createRegisterSchema = (t: (key: string) => string) => {
  return z
    .object({
      name: z.string().min(1, t('validation.nameRequired')),
      email: z.email(t('validation.emailInvalid')),
      password: z
        .string()
        .min(1, t('validation.passwordRequired'))
        .min(6, t('validation.passwordMin')),
      confirmPassword: z
        .string()
        .min(1, t('validation.confirmPasswordRequired'))
        .min(6, t('validation.passwordMin')),
      roleId: z.number().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('validation.passwordNotMatch'),
      path: ['confirmPassword'],
    });
};

export type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  roleId?: number;
};
