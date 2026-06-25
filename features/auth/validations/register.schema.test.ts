import { describe, it, expect } from 'vitest';
import { createRegisterSchema } from './register.schema';

describe('createRegisterSchema', () => {
  const t = (key: string) => key;
  const schema = createRegisterSchema(t);

  const validData = {
    name: 'Nguyen Van A',
    email: 'test@example.com',
    password: 'password123',
    confirmPassword: 'password123',
    roleId: 1,
  };

  it('validates successfully with valid data', () => {
    const result = schema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('reports an error when confirmPassword does not match password', () => {
    const result = schema.safeParse({
      ...validData,
      confirmPassword: 'password456',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('confirmPassword');
      expect(result.error.issues[0].message).toBe('validation.passwordNotMatch');
    }
  });

  it('reports an error when password is too short', () => {
    const result = schema.safeParse({
      ...validData,
      password: '123',
      confirmPassword: '123',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes('password'));
      expect(issue?.message).toBe('validation.passwordMin');
    }
  });

  it('reports an error when name is empty', () => {
    const result = schema.safeParse({ ...validData, name: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('validation.nameRequired');
    }
  });

  it('reports an error when email is invalid', () => {
    const result = schema.safeParse({ ...validData, email: 'invalid-mail' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('validation.emailInvalid');
    }
  });
});
