'use client';

import {
  buildCreateEnvVarPayload,
  buildUpdateEnvVarPayload,
  createEnvVarFormSchema,
  getEnvVarFormDefaults,
  type EnvVarFormInput,
} from '@/features/env-vars/validations/env-var-form.schema';
import type { CreateEnvVarRequest, EnvVar, UpdateEnvVarRequest } from '@/types/env-var';
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Switch,
} from '@components/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@lib/utils';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface EnvVarDialogProps {
  envVar?: EnvVar | null;
  isOpen: boolean;
  isPending: boolean;
  mode: 'create' | 'edit';
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (payload: CreateEnvVarRequest | UpdateEnvVarRequest) => Promise<void>;
  submitErrorMessage: string;
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="text-destructive text-xs" role="alert">
      {message}
    </p>
  );
}

export function EnvVarDialog({
  envVar,
  isOpen,
  isPending,
  mode,
  onOpenChange,
  onSubmit,
  submitErrorMessage,
}: EnvVarDialogProps) {
  const t = useTranslations('pages.projectDetail.envVars');
  const schema = createEnvVarFormSchema(
    {
      keyInvalid: t('validation.keyInvalid'),
      keyRequired: t('validation.keyRequired'),
      scopeRequired: t('validation.scopeRequired'),
      valueRequired: t('validation.valueRequired'),
    },
    { isEdit: mode === 'edit' },
  );

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<EnvVarFormInput>({
    resolver: zodResolver(schema),
    defaultValues: getEnvVarFormDefaults(envVar),
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    reset(getEnvVarFormDefaults(envVar));
  }, [envVar, isOpen, reset]);

  const submitLabel =
    mode === 'create' ? t('dialog.actions.create') : t('dialog.actions.save');
  const submittingLabel =
    mode === 'create' ? t('dialog.actions.creating') : t('dialog.actions.saving');

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? t('dialog.createTitle') : t('dialog.editTitle')}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' ? t('dialog.createDescription') : t('dialog.editDescription')}
          </DialogDescription>
        </DialogHeader>

        <form
          id={`env-var-${mode}-form`}
          className="space-y-5"
          onSubmit={handleSubmit(async (values) => {
            if (mode === 'create') {
              await onSubmit(buildCreateEnvVarPayload(values));
              return;
            }

            await onSubmit(buildUpdateEnvVarPayload(values));
          })}
        >
          {submitErrorMessage ? (
            <div
              className="border-destructive/30 bg-destructive/8 text-destructive rounded-xl border px-4 py-3 text-sm"
              role="alert"
            >
              {submitErrorMessage}
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="env-var-key">{t('dialog.fields.key.label')}</Label>
            <Controller
              name="key"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="env-var-key"
                  autoComplete="off"
                  placeholder={t('dialog.fields.key.placeholder')}
                  disabled={isPending}
                  className={cn(
                    errors.key ? 'border-destructive focus-visible:ring-destructive' : '',
                  )}
                />
              )}
            />
            <p className="text-muted-foreground text-xs">{t('dialog.fields.key.description')}</p>
            <FieldError message={errors.key?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="env-var-value">{t('dialog.fields.value.label')}</Label>
            <Controller
              name="value"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="env-var-value"
                  autoComplete="off"
                  type="password"
                  placeholder={
                    mode === 'create'
                      ? t('dialog.fields.value.placeholder')
                      : t('dialog.fields.value.editPlaceholder')
                  }
                  disabled={isPending}
                  className={cn(
                    errors.value ? 'border-destructive focus-visible:ring-destructive' : '',
                  )}
                />
              )}
            />
            <p className="text-muted-foreground text-xs">
              {mode === 'create'
                ? t('dialog.fields.value.description')
                : t('dialog.fields.value.editDescription')}
            </p>
            <FieldError message={errors.value?.message} />
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium">{t('dialog.fields.scope.label')}</p>
              <p className="text-muted-foreground text-xs">{t('dialog.fields.scope.description')}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Controller
                name="runtime"
                control={control}
                render={({ field }) => (
                  <label className="border-border/70 hover:bg-muted/40 flex cursor-pointer items-start gap-3 rounded-xl border p-4">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                      disabled={isPending}
                    />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{t('dialog.fields.scope.runtime')}</p>
                      <p className="text-muted-foreground text-xs">
                        {t('dialog.fields.scope.runtimeDescription')}
                      </p>
                    </div>
                  </label>
                )}
              />
              <Controller
                name="build"
                control={control}
                render={({ field }) => (
                  <label className="border-border/70 hover:bg-muted/40 flex cursor-pointer items-start gap-3 rounded-xl border p-4">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                      disabled={isPending}
                    />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{t('dialog.fields.scope.build')}</p>
                      <p className="text-muted-foreground text-xs">
                        {t('dialog.fields.scope.buildDescription')}
                      </p>
                    </div>
                  </label>
                )}
              />
            </div>
            <FieldError message={errors.runtime?.message} />
          </div>

          <Controller
            name="isEnabled"
            control={control}
            render={({ field }) => (
              <div className="border-border/70 flex items-start justify-between gap-4 rounded-xl border p-4">
                <div className="space-y-1">
                  <Label htmlFor="env-var-enabled">{t('dialog.fields.enabled.label')}</Label>
                  <p className="text-muted-foreground text-xs">
                    {t('dialog.fields.enabled.description')}
                  </p>
                </div>
                <Switch
                  id="env-var-enabled"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isPending}
                />
              </div>
            )}
          />
        </form>

        <DialogFooter>
          <Button variant="outline" type="button" onClick={() => onOpenChange(false)} disabled={isPending}>
            {t('dialog.actions.cancel')}
          </Button>
          <Button type="submit" form={`env-var-${mode}-form`} loading={isPending}>
            {isPending ? submittingLabel : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}