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

export function getApiErrorCode(error: ApiError | null | undefined): string | undefined {
  return error?.error.code;
}

export function getApiErrorMessage(error: ApiError | null | undefined): string {
  return error?.error.message || 'An unexpected error occurred';
}

export function getApiErrorStatusCode(error: ApiError | null | undefined): number | undefined {
  return error?.statusCode ?? error?.error.statusCode;
}

export function getTranslatedErrorMessage(
  error: ApiError | null | undefined,
  t: (key: string) => string
): string {
  if (!error) {
    return 'An unexpected error occurred';
  }

  const errCode = getApiErrorCode(error);
  const fallbackMessage = getApiErrorMessage(error);

  if (errCode) {
    return translateErrorCode(errCode, t, fallbackMessage);
  }

  return fallbackMessage;
}
