import { describe, it, expect } from 'vitest';
import { createEditProfileSchema } from './edit-profile.schema';

describe('createEditProfileSchema', () => {
  // Mock translation function
  const t = (key: string) => key;
  const schema = createEditProfileSchema(t);

  it('should validate successfully with valid full data', () => {
    const validData = {
      full_name: 'John Doe',
      address: '123 Main St',
      phone_number: '1234567890',
      bio: 'Hello world',
      dob: new Date('1990-01-01'),
      gender: 'Male',
      nick_name: 'johnd',
      avt_url: 'https://example.com/avatar.jpg',
    };

    const result = schema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validData);
    }
  });

  it('should validate successfully with empty/partial data (all optional)', () => {
    const validData = {};
    const result = schema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should validate successfully with nullable phone_number', () => {
    const validData = {
      phone_number: null,
    };
    const result = schema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should validate successfully with undefined phone_number', () => {
    const validData = {
      phone_number: undefined,
    };
    const result = schema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should validate successfully with valid gender', () => {
    const maleData = { gender: 'Male' };
    const femaleData = { gender: 'Female' };

    expect(schema.safeParse(maleData).success).toBe(true);
    expect(schema.safeParse(femaleData).success).toBe(true);
  });

  it('should fail with invalid gender', () => {
    const invalidData = {
      gender: 'Other',
    };
    const result = schema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should fail with invalid date type for dob', () => {
    const invalidData = {
      dob: 'not-a-date-object', // Zod date() expects a Date object, not a string unless using coerce
    };
    const result = schema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should fail with invalid types for string fields', () => {
    const invalidData = {
      full_name: 123,
    };
    const result = schema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
