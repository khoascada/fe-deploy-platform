import { describe, it, expect } from 'vitest';
import { createRegisterSchema } from './register.schema';

describe('createRegisterSchema', () => {
  const t = (key: string) => key;
  const schema = createRegisterSchema(t);

  const validData = {
    full_name: 'Nguyen Van A',
    email: 'test@example.com',
    password: 'password123',
    confirmPassword: 'password123',
    role_id: 1, // Student
  };

  it('validate thành công với dữ liệu hợp lệ', () => {
    const result = schema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  describe('Validation Password Check', () => {
    it('báo lỗi nếu confirmPassword không khớp password', () => {
      const result = schema.safeParse({
        ...validData,
        password: 'password123',
        confirmPassword: 'password456',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        // Kiểm tra lỗi nằm ở field confirmPassword
        expect(result.error.issues[0].path).toContain('confirmPassword');
        expect(result.error.issues[0].message).toBe('validation.passwordNotMatch');
      }
    });

    it('báo lỗi nếu password quá ngắn (< 6 ký tự)', () => {
      const result = schema.safeParse({
        ...validData,
        password: '123',
        confirmPassword: '123',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        // Tìm lỗi liên quan đến độ dài password
        const issue = result.error.issues.find((i) => i.path.includes('password'));
        expect(issue?.message).toBe('validation.passwordMin');
      }
    });
  });

  describe('Validation Role', () => {
    it('báo lỗi nếu không chọn role (undefined)', () => {
      const result = schema.safeParse({
        ...validData,
        role_id: undefined,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('validation.roleRequired');
      }
    });

    it('báo lỗi nếu role_id không hợp lệ (ví dụ: 0 hoặc < 1 xem refine có bắt ko?)', () => {
      // Theo refine(val >= 1)
      const result = schema.safeParse({
        ...validData,
        role_id: 0,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('validation.roleRequired');
      }
    });
  });

  describe('Other Fields', () => {
    it('báo lỗi nếu full_name rỗng', () => {
      const result = schema.safeParse({ ...validData, full_name: '' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('validation.nameRequired');
      }
    });

    it('báo lỗi nếu email không hợp lệ', () => {
      const result = schema.safeParse({ ...validData, email: 'invalid-mail' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('validation.emailInvalid');
      }
    });
  });
});
