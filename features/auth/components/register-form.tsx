'use client';

import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { PasswordInput } from '@components/ui/password-input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useRegister } from '../hooks';

import { useTranslateError } from '@lib/hooks';
import { ArrowRightIcon, Loader2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { createRegisterSchema, type RegisterFormData } from '../validations';

export default function RegisterForm() {
  const { register, isPending, error } = useRegister();
  const t = useTranslations('auth');
  const locale = useLocale();
  const { resolvedTheme } = useTheme();
  const { getErrorMessage } = useTranslateError();

  const registerSchema = createRegisterSchema(t);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      roleId: undefined,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register({
        email: data.email,
        password: data.password,
        name: data.name,
        theme: resolvedTheme === 'dark' ? 'DARK' : 'LIGHT',
        language: locale === 'en' ? 'EN' : 'VI',
      });
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="grid gap-6">
      {error && (
        <div
          className="bg-destructive/15 text-destructive rounded-md p-3 text-sm"
          data-testid="register-error-message"
          role="alert"
        >
          {getErrorMessage(error) || t('registerFailed')}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        data-testid="register-form"
        aria-label={t('registerFormAriaLabel')}
      >
        <div className="grid gap-2">
          <Label htmlFor="name">{t('name')}</Label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                id="name"
                {...field}
                type="text"
                placeholder={t('placeholder.name')}
                disabled={isPending}
                data-testid="name-input"
                className={errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}
              />
            )}
          />
          {errors.name?.message && (
            <p className="text-destructive text-xs" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">{t('email')}</Label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                id="email"
                {...field}
                type="email"
                placeholder={t('placeholder.email')}
                disabled={isPending}
                data-testid="email-input"
                className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
              />
            )}
          />
          {errors.email?.message && (
            <p className="text-destructive text-xs" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">{t('password')}</Label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <PasswordInput
                id="password"
                {...field}
                placeholder={t('placeholder.createPassword')}
                disabled={isPending}
                data-testid="password-input"
                className={
                  errors.password ? 'border-destructive focus-visible:ring-destructive' : ''
                }
              />
            )}
          />
          {errors.password?.message && (
            <p className="text-destructive text-xs" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <PasswordInput
                id="confirmPassword"
                {...field}
                placeholder={t('placeholder.confirmPassword')}
                disabled={isPending}
                data-testid="confirm-password-input"
                className={
                  errors.confirmPassword ? 'border-destructive focus-visible:ring-destructive' : ''
                }
              />
            )}
          />
          {errors.confirmPassword?.message && (
            <p className="text-destructive text-xs" role="alert">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          variant="default"
          color="primary"
          type="submit"
          disabled={isPending}
          data-testid="register-submit-button"
          aria-label={t('registerSubmitAriaLabel')}
          className="w-full"
          size="lg"
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? t('changing') : t('registerButton')}
          {!isPending && <ArrowRightIcon className="ml-2 h-4 w-4" />}
        </Button>
      </form>
    </div>
  );
}
