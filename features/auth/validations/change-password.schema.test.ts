import { describe, it, expect } from 'vitest';
import { createChangePasswordSchema } from './change-password.schema';

describe('createChangePasswordSchema', () => {
  // Mock translation function
  const t = (key: string) => key;
  const schema = createChangePasswordSchema(t);

  it('should validate successfully with valid data', () => {
    const validData = {
      old_password: 'oldPassword123',
      new_password: 'newPassword123',
      confirm_password: 'newPassword123',
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
        old_password: '123',
        new_password: '123',
        confirm_password: '123',
      };

      const result = schema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        // Check if all fields have errors
        const errorFields = result.error.issues.map((i) => i.path[0]);
        expect(errorFields).toContain('old_password');
        expect(errorFields).toContain('new_password');
        expect(errorFields).toContain('confirm_password');
      }
    });

    it('should fail when fields are empty', () => {
      const invalidData = {
        old_password: '',
        new_password: '',
        confirm_password: '',
      };
      const result = schema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('Validation Logic', () => {
    it('should fail when confirm_password does not match new_password', () => {
      const invalidData = {
        old_password: 'oldPassword123',
        new_password: 'newPassword123',
        confirm_password: 'differentPassword',
      };

      const result = schema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'changePassword.validation.newPasswordNotMatch'
        );
        expect(result.error.issues[0].path).toContain('confirm_password');
      }
    });

    it('should fail when new_password is the same as old_password', () => {
      const invalidData = {
        old_password: 'samePassword123',
        new_password: 'samePassword123',
        confirm_password: 'samePassword123',
      };

      const result = schema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'changePassword.validation.newPasswordMustDifferent'
        );
        expect(result.error.issues[0].path).toContain('new_password');
      }
    });
  });
});
