import { z } from 'zod';

export const createChangePasswordSchema = (t: (key: string) => string) => {
  return z
    .object({
      old_password: z
        .string()
        .min(1, t('changePassword.validation.currentPasswordRequired'))
        .min(6, t('changePassword.validation.currentPasswordMin')),
      new_password: z
        .string()
        .min(1, t('changePassword.validation.newPasswordRequired'))
        .min(6, t('changePassword.validation.newPasswordMin')),
      confirm_password: z
        .string()
        .min(1, t('changePassword.validation.confirmPasswordRequired'))
        .min(6, t('changePassword.validation.newPasswordMin')),
    })
    .refine((data) => data.new_password === data.confirm_password, {
      message: t('changePassword.validation.newPasswordNotMatch'),
      path: ['confirm_password'],
    })
    .refine((data) => data.old_password !== data.new_password, {
      message: t('changePassword.validation.newPasswordMustDifferent'),
      path: ['new_password'],
    });
};
