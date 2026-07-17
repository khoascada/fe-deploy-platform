'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createChangePasswordSchema, useChangePassword } from '@features/auth';
import type { ChangePasswordData, ChangePasswordFormData } from '@/types/auth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
} from '@components/ui';
import { PasswordInput } from '@components/ui/password-input';
import { toast } from 'sonner';
import { useTranslateError } from '@lib/hooks';
import type { ApiError } from '@lib/types/base';
interface ModalChangePasswordProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ModalChangePassword = ({ open, setOpen }: ModalChangePasswordProps) => {
  const t = useTranslations('auth');
  const { getErrorMessage } = useTranslateError();


  // mutation
  const { changePassword, isPending: isPendingChangePassword } = useChangePassword();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(createChangePasswordSchema(t)),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      const cleanData: ChangePasswordData = {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      };
      // TODO: Call API to change password
      await changePassword(cleanData);
      toast.success(t('success.changePassword'));
      handleClose();
    } catch (err) {
      const errorMessage = getErrorMessage(err as ApiError) || t('errors.changePasswordFailed');
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('changePassword.title')}</DialogTitle>
          <DialogDescription>{t('changePassword.description')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Current Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {t('changePassword.currentPassword')}
              </label>
              <PasswordInput {...register('oldPassword')} />
              {errors.oldPassword && (
                <p className="text-xs text-red-500">{errors.oldPassword.message}</p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {t('changePassword.newPassword')}
              </label>
              <PasswordInput {...register('newPassword')} />
              {errors.newPassword && (
                <p className="text-xs text-red-500">{errors.newPassword.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {t('changePassword.confirmPassword')}
              </label>
              <PasswordInput {...register('confirmPassword')} />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <DialogFooter className="pt-2">
              <div className="flex w-full flex-col gap-2 md:flex-row md:justify-end md:gap-2">
                <Button
                  type="submit"
                  variant="default"
                  color="primary"
                  loading={isSubmitting || isPendingChangePassword}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting || isPendingChangePassword
                    ? t('changing')
                    : t('changePassword.submitButton')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  loading={isSubmitting || isPendingChangePassword}
                  className="w-full sm:w-auto"
                >
                  {t('changePassword.cancelButton')}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalChangePassword;
