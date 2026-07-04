import { describe, expect, it } from 'vitest';
import {
  buildCreateEnvVarPayload,
  buildUpdateEnvVarPayload,
  createEnvVarFormSchema,
  getEnvVarScopeSelection,
  resolveEnvVarScope,
} from './env-var-form.schema';

describe('env-var-form.schema', () => {
  const t = {
    keyInvalid: 'Invalid key',
    keyRequired: 'Key required',
    scopeRequired: 'Select at least one scope',
    valueRequired: 'Value required',
  };

  it('maps runtime/build checkbox combinations to the correct scope', () => {
    expect(resolveEnvVarScope({ runtime: true, build: false })).toBe('RUNTIME');
    expect(resolveEnvVarScope({ runtime: false, build: true })).toBe('BUILD');
    expect(resolveEnvVarScope({ runtime: true, build: true })).toBe('BOTH');
    expect(resolveEnvVarScope({ runtime: false, build: false })).toBeNull();
  });

  it('maps BOTH scope back to both checkbox selections', () => {
    expect(getEnvVarScopeSelection('BOTH')).toEqual({ runtime: true, build: true });
  });

  it('requires a value on create', () => {
    const schema = createEnvVarFormSchema(t, { isEdit: false });
    const result = schema.safeParse({
      key: 'DATABASE_URL',
      value: '',
      runtime: true,
      build: false,
      isEnabled: true,
    });

    expect(result.success).toBe(false);
  });

  it('allows a blank value on edit so the current secret is retained', () => {
    expect(
      buildUpdateEnvVarPayload({
        key: 'DATABASE_URL',
        value: '',
        runtime: true,
        build: false,
        isEnabled: true,
      }),
    ).toEqual({
      key: 'DATABASE_URL',
      scope: 'RUNTIME',
      isEnabled: true,
    });
  });

  it('includes a replacement value on update when one is provided', () => {
    expect(
      buildUpdateEnvVarPayload({
        key: 'DATABASE_URL',
        value: 'postgres://example',
        runtime: true,
        build: true,
        isEnabled: false,
      }),
    ).toEqual({
      key: 'DATABASE_URL',
      value: 'postgres://example',
      scope: 'BOTH',
      isEnabled: false,
    });
  });

  it('builds the create payload with the resolved scope', () => {
    expect(
      buildCreateEnvVarPayload({
        key: 'NEXT_PUBLIC_API_URL',
        value: 'https://example.com',
        runtime: false,
        build: true,
        isEnabled: true,
      }),
    ).toEqual({
      key: 'NEXT_PUBLIC_API_URL',
      value: 'https://example.com',
      scope: 'BUILD',
      isEnabled: true,
    });
  });
});
