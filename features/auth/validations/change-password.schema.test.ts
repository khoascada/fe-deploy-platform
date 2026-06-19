import { describe, it, expect } from 'vitest';
import { createChangePasswordSchema } from './change-password.schema';

describe('createChangePasswordSchema', () => {
  const t = (key: string) => key;
  const schema = createChangePasswordSchema(t);

  it('should validate successfully with valid data', () => {
    const validData = {
      oldPassword: 'oldPassword123',
      newPassword: 'newPassword123',
      confirmPassword: 'newPassword123',
    };

    const result = schema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validData);
    }
  });

  describe('Validation Length', () => {
    it('should fail when passwords are too short', () => {
      const invalidData = {
        oldPassword: '123',
        newPassword: '123',
        confirmPassword: '123',
      };

      const result = schema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorFields = result.error.issues.map((i) => i.path[0]);
        expect(errorFields).toContain('oldPassword');
        expect(errorFields).toContain('newPassword');
        expect(errorFields).toContain('confirmPassword');
      }
    });

    it('should fail when fields are empty', () => {
      const invalidData = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      };
      const result = schema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('Validation Logic', () => {
    it('should fail when confirmPassword does not match newPassword', () => {
      const invalidData = {
        oldPassword: 'oldPassword123',
        newPassword: 'newPassword123',
        confirmPassword: 'differentPassword',
      };

      const result = schema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'changePassword.validation.newPasswordNotMatch'
        );
        expect(result.error.issues[0].path).toContain('confirmPassword');
      }
    });

    it('should fail when newPassword is the same as oldPassword', () => {
      const invalidData = {
        oldPassword: 'samePassword123',
        newPassword: 'samePassword123',
        confirmPassword: 'samePassword123',
      };

      const result = schema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'changePassword.validation.newPasswordMustDifferent'
        );
        expect(result.error.issues[0].path).toContain('newPassword');
      }
    });
  });
});
