import type { ApiError } from '@lib/types/base';
import { ERROR_CODES } from '@lib/constants/error-code';

export function translateErrorCode(
  errCode: string | null | undefined,
  t: (key: string) => string,
  fallbackMessage?: string
): string {
  if (!errCode) {
    return fallbackMessage || 'An unexpected error occurred';
  }

  // Check if errCode exists in ERROR_CODES
  const isValidErrorCode = (Object.values(ERROR_CODES) as string[]).includes(errCode);

  if (!isValidErrorCode) {
    return fallbackMessage || `Unknown error code: ${errCode}`;
  }

  try {
    return t(errCode);
  } catch {
    return fallbackMessage || `Error: ${errCode}`;
  }
}

export function getTranslatedErrorMessage(
  error: ApiError | null | undefined,
  t: (key: string) => string
): string {
  if (!error) {
    return 'An unexpected error occurred';
  }

  // If errCode exists, translate it
  if (error.errCode) {
    const translated = translateErrorCode(error.errCode, t, error.message);
    return translated;
  }

  // Fallback to error.message from BE
  return error.message || 'An unexpected error occurred';
}
