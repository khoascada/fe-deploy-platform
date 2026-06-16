import { z } from 'zod';
import { devWarn } from './logger';

export function validateResponse<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    devWarn('[validateResponse] Schema mismatch:', z.treeifyError(result.error));

    throw new Error(`API response validation failed: ${result.error.message}`);
  }
  return result.data;
}
