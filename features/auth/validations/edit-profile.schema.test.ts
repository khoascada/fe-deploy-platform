import { describe, it, expect } from 'vitest';
import { createEditProfileSchema } from './edit-profile.schema';

describe('createEditProfileSchema', () => {
  const t = (key: string) => key;
  const schema = createEditProfileSchema(t);

  it('should validate successfully with valid full data', () => {
    const validData = {
      name: 'John Doe',
      bio: 'Hello world',
      dob: new Date('1990-01-01'),
      gender: 'Male',
      nickName: 'johnd',
      avatarUrl: 'https://example.com/avatar.jpg',
    };

    const result = schema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validData);
    }
  });

  it('should fail when name is missing', () => {
    const result = schema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should validate successfully with valid gender', () => {
    expect(schema.safeParse({ name: 'John Doe', gender: 'Male' }).success).toBe(true);
    expect(schema.safeParse({ name: 'Jane Doe', gender: 'Female' }).success).toBe(true);
  });

  it('should fail with invalid gender', () => {
    const result = schema.safeParse({
      name: 'John Doe',
      gender: 'Other',
    });
    expect(result.success).toBe(false);
  });

  it('should fail with invalid date type for dob', () => {
    const result = schema.safeParse({
      name: 'John Doe',
      dob: 'not-a-date-object',
    });
    expect(result.success).toBe(false);
  });

  it('should fail with invalid types for string fields', () => {
    const result = schema.safeParse({
      name: 123,
    });
    expect(result.success).toBe(false);
  });
});
