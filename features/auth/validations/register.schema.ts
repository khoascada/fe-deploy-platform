import { z } from 'zod';

/**
 * Dynamic register schema that accepts translation function
 * @param t - Translation function from useTranslations
 */
export const createRegisterSchema = (t: (key: string) => string) => {
  return z
    .object({
      full_name: z.string().min(1, t('validation.nameRequired')),
      email: z.email(t('validation.emailInvalid')),
      password: z
        .string()
        .min(1, t('validation.passwordRequired'))
        .min(6, t('validation.passwordMin')),
      confirmPassword: z
        .string()
        .min(1, t('validation.confirmPasswordRequired'))
        .min(6, t('validation.passwordMin')),
      // Role field tạm ẩn ở UI — luôn gửi role 'user'. Giữ lại rule strict để bật lại sau:
      // role_id: z.union([z.number(), z.undefined()]).refine((val) => val !== undefined && val >= 1, {
      //   message: t('validation.roleRequired'),
      // }),
      role_id: z.number().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('validation.passwordNotMatch'),
      path: ['confirmPassword'],
    });
};

// Type inference
export type RegisterFormData = {
  full_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role_id?: number;
};
