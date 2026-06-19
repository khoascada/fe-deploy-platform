'use client';

import { useRegister } from '../hooks';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { PasswordInput } from '@components/ui/password-input';
import { Label } from '@components/ui/label';

import { ArrowRightIcon, Loader2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useTranslateError } from '@lib/hooks';
import { createRegisterSchema, type RegisterFormData } from '../validations';

export default function RegisterForm() {
  const { register, isPending, error } = useRegister();
  const t = useTranslations('auth');
  const locale = useLocale();
  const { resolvedTheme } = useTheme();
  const { getErrorMessage } = useTranslateError();

  // Create schema with translations
  const registerSchema = createRegisterSchema(t);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role_id: undefined,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register({
        email: data.email,
        password: data.password,
        full_name: data.full_name,
        theme: (resolvedTheme as 'light' | 'dark') ?? 'light',
        language: locale === 'en' ? 'EN' : 'VN',
      });
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="grid gap-6">
      {error && (
        <div
          className="rounded-md bg-destructive/15 p-3 text-sm text-destructive"
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
        {/* Name Field */}
        <div className="grid gap-2">
          <Label htmlFor="full_name">{t('name')}</Label>
          <Controller
            name="full_name"
            control={control}
            render={({ field }) => (
              <Input
                id="full_name"
                {...field}
                type="text"
                placeholder={t('placeholder.name')}
                disabled={isPending}
                data-testid="name-input"
                className={errors.full_name ? 'border-destructive focus-visible:ring-destructive' : ''}
              />
            )}
          />
          {errors.full_name?.message && (
            <p className="text-xs text-destructive" role="alert">
              {errors.full_name.message}
            </p>
          )}
        </div>

        {/* Email Field */}
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
            <p className="text-xs text-destructive" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
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
                className={errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}
              />
            )}
          />
          {errors.password?.message && (
            <p className="text-xs text-destructive" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
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
                className={errors.confirmPassword ? 'border-destructive focus-visible:ring-destructive' : ''}
              />
            )}
          />
          {errors.confirmPassword?.message && (
            <p className="text-xs text-destructive" role="alert">
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
