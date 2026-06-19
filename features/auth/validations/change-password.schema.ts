import { z } from 'zod';

export const createChangePasswordSchema = (t: (key: string) => string) => {
  return z
    .object({
      oldPassword: z
        .string()
        .min(1, t('changePassword.validation.currentPasswordRequired'))
        .min(6, t('changePassword.validation.currentPasswordMin')),
      newPassword: z
        .string()
        .min(1, t('changePassword.validation.newPasswordRequired'))
        .min(6, t('changePassword.validation.newPasswordMin')),
      confirmPassword: z
        .string()
        .min(1, t('changePassword.validation.confirmPasswordRequired'))
        .min(6, t('changePassword.validation.newPasswordMin')),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t('changePassword.validation.newPasswordNotMatch'),
      path: ['confirmPassword'],
    })
    .refine((data) => data.oldPassword !== data.newPassword, {
      message: t('changePassword.validation.newPasswordMustDifferent'),
      path: ['newPassword'],
    });
};
