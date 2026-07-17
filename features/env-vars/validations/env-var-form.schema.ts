import type { EnvVar, EnvVarScope } from '@/types/env-var';
import { z } from 'zod';

export interface EnvVarFormTranslation {
  keyInvalid: string;
  keyRequired: string;
  scopeRequired: string;
  valueRequired: string;
}

export interface EnvVarFormInput {
  key: string;
  value: string;
  runtime: boolean;
  build: boolean;
  isEnabled: boolean;
}

export type EnvVarFormValues = z.infer<ReturnType<typeof createEnvVarFormSchema>>;

export function createEnvVarFormSchema(
  t: EnvVarFormTranslation,
  options: { isEdit: boolean },
) {
  return z
    .object({
      key: z
        .string()
        .trim()
        .min(1, t.keyRequired)
        .max(255)
        .regex(/^[A-Za-z_][A-Za-z0-9_]*$/, t.keyInvalid),
      value: z.string().max(64 * 1024),
      runtime: z.boolean(),
      build: z.boolean(),
      isEnabled: z.boolean(),
    })
    .superRefine((value, context) => {
      if (!value.runtime && !value.build) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: t.scopeRequired,
          path: ['runtime'],
        });
      }

      if (!options.isEdit && value.value.length === 0) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: t.valueRequired,
          path: ['value'],
        });
      }
    });
}

export function resolveEnvVarScope(selection: {
  runtime: boolean;
  build: boolean;
}): EnvVarScope | null {
  if (selection.runtime && selection.build) {
    return 'BOTH';
  }

  if (selection.runtime) {
    return 'RUNTIME';
  }

  if (selection.build) {
    return 'BUILD';
  }

  return null;
}

export function getEnvVarScopeSelection(scope: EnvVarScope) {
  return {
    runtime: scope === 'RUNTIME' || scope === 'BOTH',
    build: scope === 'BUILD' || scope === 'BOTH',
  };
}

export function getEnvVarFormDefaults(envVar?: EnvVar | null): EnvVarFormInput {
  if (!envVar) {
    return {
      key: '',
      value: '',
      runtime: true,
      build: true,
      isEnabled: true,
    };
  }

  const scopeSelection = getEnvVarScopeSelection(envVar.scope);
  return {
    key: envVar.key,
    value: '',
    runtime: scopeSelection.runtime,
    build: scopeSelection.build,
    isEnabled: envVar.isEnabled,
  };
}

export function buildCreateEnvVarPayload(values: EnvVarFormInput) {
  const scope = resolveEnvVarScope(values);
  if (!scope) {
    throw new Error('At least one env var scope must be selected');
  }

  return {
    key: values.key.trim(),
    value: values.value,
    scope,
    isEnabled: values.isEnabled,
  };
}

export function buildUpdateEnvVarPayload(values: EnvVarFormInput) {
  const scope = resolveEnvVarScope(values);
  if (!scope) {
    throw new Error('At least one env var scope must be selected');
  }

  return {
    key: values.key.trim(),
    ...(values.value.length > 0 ? { value: values.value } : {}),
    scope,
    isEnabled: values.isEnabled,
  };
}
