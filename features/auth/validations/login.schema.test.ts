import { describe, it, expect } from 'vitest';
import { createLoginSchema } from './login.schema';

describe('createLoginSchema', () => {
  // Mock function dịch thuật
  const t = (key: string) => key;
  const schema = createLoginSchema(t);

  it('nên validate thành công với dữ liệu hợp lệ', () => {
    const validData = {
      email: 'test@example.com',
      password: 'password123',
    };

    const result = schema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validData);
    }
  });

  describe('Validation E-mail', () => {
    it('nên báo lỗi khi email không đúng định dạng', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      };

      const result = schema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        // Kiểm tra message lỗi có khớp với key dịch thuật không
        expect(result.error.issues[0].message).toBe('validation.emailInvalid');
      }
    });

    it('nên báo lỗi khi email rỗng', () => {
      const result = schema.safeParse({ email: '', password: '123' });
      expect(result.success).toBe(false);
      // Zod email check bao gồm cả check non-empty format
    });
  });

  describe('Validation Password', () => {
    it('nên báo lỗi khi password rỗng', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '',
      };

      const result = schema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('validation.passwordRequired');
      }
    });
  });
});
