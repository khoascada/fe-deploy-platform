'use client';

import { useLogin } from '../hooks';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { PasswordInput } from '@components/ui/password-input';
import { Label } from '@components/ui/label';
import { useTranslations } from 'next-intl';
import { useTranslateError } from '@lib/hooks';
import { createLoginSchema, type LoginFormData } from '../validations';
import { ApiError } from '@lib/types/base';
import { Loader2 } from 'lucide-react';

export default function LoginForm() {
  const { login, isPending, error } = useLogin();
  const t = useTranslations('auth');
  const { getErrorMessage } = useTranslateError();
  // Create schema with translations
  const loginSchema = createLoginSchema(t);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    await login({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="grid gap-6">
      {error && (
        <div
          className="rounded-md bg-destructive/15 p-3 text-sm text-destructive"
          data-testid="login-error-message"
          role="alert"
        >
          {getErrorMessage(error as unknown as ApiError) || t('loginFailed')}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        data-testid="login-form"
        aria-label={t('loginFormAriaLabel')}
      >
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
                placeholder={t('placeholder.password')}
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

        {/* Submit Button */}
        <Button
          variant="default"
          color="primary"
          type="submit"
          data-testid="login-submit-button"
          aria-label={t('loginSubmitAriaLabel')}
          disabled={isPending}
          className="w-full"
          size="lg"
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? t('changing') : t('loginButton')}
        </Button>
      </form>
    </div>
  );
}
